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

export {
  renderError,
}
