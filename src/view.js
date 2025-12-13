import { APP_MESSAGES, STATUS } from './constants'

const renderError = (state, elements, i18nInstance) => {
  if (state.form.isValid) {
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = ''
  }
  else {
    elements.input.classList.add('is-invalid')
    elements.feedback.textContent = i18nInstance.t(state.form.error)
  }
}

const renderLoadingProcces = (state, elements, i18nInstance) => {
  elements.feedback.classList.remove('text-danger', 'text-success', 'text-info')
  switch (state.loadingProcces.status) {
    case STATUS.LOADING:
      elements.submitButton.disabled = true
      elements.feedback.classList.add('text-info')
      elements.feedback.textContent = i18nInstance.t(APP_MESSAGES.STATUS_LOADING)
      break

    case STATUS.SUCCESS:
      elements.submitButton.disabled = false
      elements.feedback.classList.add('text-success')
      elements.feedback.textContent = i18nInstance.t(APP_MESSAGES.STATUS_SUCCESS)
      break

    case STATUS.ERROR:
      elements.submitButton.disabled = false
      elements.feedback.classList.add('text-danger')
      elements.feedback.textContent = i18nInstance.t(state.loadingProcces.error)
      break

    case STATUS.IDLE:
      elements.submitButton.disabled = false
      break

    default:
      throw new Error(`Unknown status: ${state.loadingProcces.status}`)
  }
}

export { renderError, renderLoadingProcces }
