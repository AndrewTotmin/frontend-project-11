const ERROR_CODES = {
  URL: 'errors.url',
  REQUIRED: 'errors.requiered',
  NOT_ONE_OF: 'errors.notOneOf',
  INVALID_RSS: 'errors.invalidRSS',
  NETWORK_ERROR: 'errors.networkError',
  UNKNOWN_ERROR: 'errors.unknownError'
}

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

export { ERROR_CODES, STATUS }