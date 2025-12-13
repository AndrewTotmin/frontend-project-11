import * as yup from 'yup'
import axios from 'axios'
import i18n from 'i18next'
import _ from 'lodash'
import onChange from 'on-change'

import { LOADING_ERRORS, STATUS, VALIDATION_ERRORS } from './constants'
import resources from './locales/index'
import { renderError, renderLoadingProcces } from './view'

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
      loadingProcces: {
        status: STATUS.IDLE, // loading, success, error
        error: null,
      },
      feeds: [],
      posts: [],
    }

    const handleChange = (path) => {
      if (path.startsWith('form')) {
        renderError(watchedState, elements, i18nInstance)
      }
      else if (path.startsWith('loadingProcces')) {
        renderLoadingProcces(watchedState, elements, i18nInstance)
      }
      else {
        throw new Error(`Unknown path ${path}`)
      }
    }

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      submitButton: document.querySelector('button[type=submit]'),
      feedback: document.querySelector('.feedback'),
    }

    const watchedState = onChange(initialState, handleChange)

    const parseData = (data) => {
      const parser = new DOMParser()
      return parser.parseFromString(data, 'application/xml')
    }

    const getProxyUrl = (url) => {
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
      const feedDescription = parsedData.querySelector(
        'channel > description',
      ).textContent
      const feed = { title: feedTitle, description: feedDescription, url: url }

      const itemElements = Array.from(
        parsedData.querySelectorAll('channel > item'),
      )
      const posts = itemElements.map((post) => {
        return {
          title: post.querySelector('title').textContent,
          description: post.querySelector('description').textContent,
          url: post.querySelector('link').textContent,
        }
      })
      return { feed, posts }
    }

    const handleLoadingError = (error, watchedState) => {
      console.log(error)

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
      watchedState.loadingProcces = { status: STATUS.ERROR, error: errorCode }
    }

    const loadData = (url) => {
      watchedState.loadingProcces.status = STATUS.LOADING

      const proxyUrl = getProxyUrl(url)

      axios
        .get(proxyUrl)
        .then((response) => {
          const { feed, posts } = extractData(response.data.contents, url)

          feed.id = _.uniqueId('feed_')
          watchedState.feeds.push(feed)

          const relatedPosts = posts.map((post) => {
            return {
              ...post,
              id: _.uniqueId('post_'),
              feedId: feed.id,
            }
          })
          watchedState.posts.push(...relatedPosts)
          watchedState.loadingProcces.status = STATUS.SUCCESS
        })
        .catch((error) => {
          handleLoadingError(error, watchedState)
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
          elements.form.reset()
          elements.input.focus()
        }
      })
    })
  })
  .catch((error) => {
    throw new Error(`Error ${error}`)
  })
