const APP_MESSAGES = {
  STATUS_LOADING: 'loadingStatus.loading',
  STATUS_SUCCESS: 'loadingStatus.success',
  ELEMENTS_FEEDS: 'elements.feeds',
  ELEMENTS_POSTS: 'elements.posts',
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

export { APP_MESSAGES, LOADING_ERRORS, STATUS, VALIDATION_ERRORS }
