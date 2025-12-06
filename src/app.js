import * as yup from 'yup'
import onChange from 'on-change'
import { renderError } from './view'

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
  // loadingState: {
  //   status: 'idle',
  //   errors: null,
  // },
}

const handlerChange = (path) => {
  if (path.startsWith('form')) {
    renderError(watchedState, elements)
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

elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const url = formData.get('url').trim()
  const existingUrls = watchedState.feeds.map(feed => feed.url)

  validate(url, existingUrls)
    .then((error) => {
      if (error) {
        watchedState.form = { isValid: false, error: error }
        return
      }
      else {
        watchedState.form = { isValid: true, error: null }
      }
    })
})

const watchedState = onChange(initialState, handlerChange)
