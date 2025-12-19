import * as yup from 'yup'
import axios from 'axios'
import i18n from 'i18next'
import _ from 'lodash'
import onChange from 'on-change'

import { LOADING_ERRORS, STATUS, VALIDATION_ERRORS, UPDATE_INTERVAL } from './constants'
import resources from './locales/index'
import { renderError, renderFeeds, renderPosts, renderModal, renderLoadingProcess } from './view'

const parseData = (data) => {
  const parser = new DOMParser()
  return parser.parseFromString(data, 'application/xml')
}

const makeProxyUrl = (url) => {
  const allOrigins = 'https://allorigins.hexlet.app/get'
  const proxyBaseUrl = new URL(allOrigins)
  proxyBaseUrl.searchParams.set('disableCache', 'true')
  proxyBaseUrl.searchParams.set('url', url)
  return proxyBaseUrl.toString()
}

const extractData = (data, url) => {
  const parsedData = parseData(data)
  if (parsedData.querySelector('parsererror')) {
    throw new Error(LOADING_ERRORS.INVALID_RSS)
  }

  const feedTitle = parsedData.querySelector('channel > title').textContent
  const feedDescription = parsedData.querySelector('channel > description').textContent
  const feed = { title: feedTitle, description: feedDescription, url: url }

  const itemElements = Array.from(parsedData.querySelectorAll('channel > item'))
  const posts = itemElements.map((post) => {
    return {
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent,
      url: post.querySelector('link').textContent,
    }
  })
  return { feed, posts }
}

export default () => {
  const i18nInstance = i18n.createInstance()

  i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: resources,
    })
    .then(() => {
      const setLocaleObj = {
        string: {
          url: VALIDATION_ERRORS.URL,
        },
        mixed: {
          required: VALIDATION_ERRORS.REQUIRED,
          notOneOf: VALIDATION_ERRORS.NOT_ONE_OF,
        },
      }

      yup.setLocale(setLocaleObj)

      const validate = (url, urls) => {
        const schema = yup.object({
          url: yup.string().required().url().notOneOf(urls),
        })
        return schema
          .validate({ url: url })
          .then(() => null)
          .catch(e => e.message)
      }

      const initialState = {
        form: {
          isValid: true,
          error: null,
        },
        loadingProcess: {
          status: STATUS.IDLE,
          error: null,
        },
        feeds: [],
        posts: [],
        seenPosts: new Set(),
      }

      const handleChange = (path) => {
        const pathPrefix = path.split('.')[0]
        switch (pathPrefix) {
          case 'form':
            renderError(watchedState, elements, i18nInstance)
            break

          case 'loadingProcess':
            renderLoadingProcess(watchedState, elements, i18nInstance)
            break

          case 'feeds':
            renderFeeds(watchedState, elements, i18nInstance)
            break

          case 'posts':
          case 'seenPosts':
            renderPosts(watchedState, elements, i18nInstance)
            break

          default:
            throw new Error(`Unknown path ${path}`)
        }
      }

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#url-input'),
        submitButton: document.querySelector('button[type=submit]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        modal: document.querySelector('#modal'),
      }

      const watchedState = onChange(initialState, handleChange)

      const processAndAddPosts = (posts, feedId) => {
        const existingPostUrls = watchedState.posts.filter(post => post.feedId === feedId).map(post => post.url)
        const newPosts = posts.filter(newPost => !existingPostUrls.includes(newPost.url))
        const relatedPosts = newPosts.map((post) => {
          return { ...post, id: _.uniqueId('post_'), feedId: feedId }
        })
        if (relatedPosts.length > 0) {
          watchedState.posts.unshift(...relatedPosts)
        }
      }

      const handleLoadingError = (error) => {
        console.error(error)

        let errorCode

        if (axios.isAxiosError(error)) {
          errorCode = LOADING_ERRORS.NETWORK_ERROR
        }
        else if (error.message === LOADING_ERRORS.INVALID_RSS) {
          errorCode = LOADING_ERRORS.INVALID_RSS
        }
        else {
          errorCode = LOADING_ERRORS.UNKNOWN_ERROR
        }
        watchedState.loadingProcess = { status: STATUS.ERROR, error: errorCode }
      }

      const loadData = (url) => {
        watchedState.loadingProcess.status = STATUS.LOADING

        const proxyUrl = makeProxyUrl(url)

        axios
          .get(proxyUrl)
          .then((response) => {
            const { feed, posts } = extractData(response.data.contents, url)

            feed.id = _.uniqueId('feed_')
            watchedState.feeds.push(feed)

            processAndAddPosts(posts, feed.id)
            watchedState.loadingProcess.status = STATUS.SUCCESS

            fetchAndProcessFeed(feed)
          })
          .catch((error) => {
            handleLoadingError(error)
          })
      }

      const fetchAndProcessFeed = (feed) => {
        const proxyUrl = makeProxyUrl(feed.url)
        axios
          .get(proxyUrl)
          .then((response) => {
            const { posts } = extractData(response.data.contents, feed.url)
            processAndAddPosts(posts, feed.id)
          })
          .catch((error) => {
            console.error(`Error during feed update ${feed.url}`, error)
          })
          .finally(() => {
            setTimeout(() => fetchAndProcessFeed(feed), UPDATE_INTERVAL)
          })
      }

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const url = formData.get('url').trim()
        const existingUrls = watchedState.feeds.map(feed => feed.url)

        validate(url, existingUrls).then((errorKey) => {
          if (errorKey) {
            watchedState.form = { isValid: false, error: errorKey }
            return
          }
          else {
            watchedState.form = { isValid: true, error: null }
            loadData(url)
          }
        })
      })

      elements.posts.addEventListener('click', (e) => {
        const postId = e.target.dataset.id
        if (!postId) return

        const post = watchedState.posts.find(post => postId === post.id)
        if (!post) return

        renderModal(post, elements.modal, i18nInstance)
        watchedState.seenPosts = new Set([...watchedState.seenPosts, postId])
      })
    })
    .catch((error) => {
      throw new Error(`Error ${error}`)
    })
}
