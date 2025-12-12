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

export { LOADING_ERRORS, STATUS, VALIDATION_ERRORS }
