// import './style.css'
// import onChange from 'on-change'
import * as yup from 'yup'

const form = document.querySelector('.rss-form')
const input = document.querySelector('#url-input')
const buttonSubmit = document.querySelector('button[type=submit]')

const validate = (url, urls) => {
  const schema = yup.object({
    url: yup.string().required().url().notOneOf(urls),
  })
  return schema
    .validate({ url: url })
    .then(() => null)
    .catch((e) => e.message)
}

const state = {
  form: {
    isValid: null,
    error: null,
  },
  feeds: [],
  posts: [],
  // loadingState: {
  //   status: 'idle',
  //   errors: null,
  // },
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const url = formData.get('url').trim()
  const existingUrls = state.feeds.map((feed) => feed.url)

  validate(url, existingUrls)
    .then((error) => {
      if (error) {
        state.form = { isValid: false, error: error }
        return
      } else {
        state.form = { isValid: true, error: null }
      }
    })
})
