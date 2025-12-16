const APP_MESSAGES = {
  STATUS_LOADING: 'loadingStatus.loading',
  STATUS_SUCCESS: 'loadingStatus.success',
  ELEMENT_FEEDS: 'elements.feeds',
  ELEMENT_POSTS: 'elements.posts',
  BUTTON_VIEW: 'buttons.view',
  MODAL_READ: 'buttons.modalRead',
  MODAL_CLOSE: 'buttons.modalClose',
}

const LOADING_ERRORS = {
  INVALID_RSS: 'loadingErrors.invalidRSS',
  NETWORK_ERROR: 'loadingErrors.networkError',
  UNKNOWN_ERROR: 'loadingErrors.unknownError',
}

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

const VALIDATION_ERRORS = {
  URL: 'validation.url',
  REQUIRED: 'validation.required',
  NOT_ONE_OF: 'validation.notOneOf',
}

const UPDATE_INTERVAL = 5000

export { APP_MESSAGES, LOADING_ERRORS, STATUS, VALIDATION_ERRORS, UPDATE_INTERVAL }
