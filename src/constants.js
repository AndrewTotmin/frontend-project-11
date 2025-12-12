const LOADING_ERRORS = {
  INVALID_RSS: 'errors.invalidRSS',
  NETWORK_ERROR: 'errors.networkError',
  UNKNOWN_ERROR: 'errors.unknownError',
}

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

const VALIDATION_ERRORS = {
  URL: 'errors.url',
  REQUIRED: 'errors.requiered',
  NOT_ONE_OF: 'errors.notOneOf',
}

export { LOADING_ERRORS, STATUS, VALIDATION_ERRORS }
