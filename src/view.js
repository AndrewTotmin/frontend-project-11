const renderError = (state, elements) => {
  if (state.form.isValid) {
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = ''
  }
  else {
    elements.input.classList.add('is-invalid')
    elements.feedback.textContent = state.form.error
  }
}

export {
  renderError,
}
