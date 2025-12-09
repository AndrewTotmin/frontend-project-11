import * as yup from 'yup'
import i18n from 'i18next'
import resources from './locales/index'
import onChange from 'on-change'
import { renderError } from './view'

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
        url: 'errors.url',
      },
      mixed: {
        required: 'errors.required',
        notOneOf: 'errors.notOneOf',
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
      feeds: [],
      posts: [],
      loadingProcces: {
        status: 'idle', // loading, success, error
        errors: null,
      },
    }

    const handleChange = (path) => {
      if (path.startsWith('form')) {
        renderError(watchedState, elements, i18nInstance)
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

    // const loadData = (url) => {
    //   watchedState.loadingProcces.status = 'loading'
    // }

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
          // loadData(url)
          // elements.form.reset()
          // elements.input.focus()
        }
      })
    })
  })
  .catch((error) => {
    throw new Error(`Error ${error}`)
  })
