import { APP_MESSAGES, STATUS } from './constants'

const renderError = (state, elements, i18nInstance) => {
  elements.feedback.classList.remove('text-danger', 'text-success', 'text-info')
  if (state.form.isValid) {
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = ''
  }
  else {
    elements.input.classList.add('is-invalid')
    elements.feedback.classList.add('text-danger')
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

const renderFeeds = (state, elements, i18nInstance) => {
  elements.feeds.innerHTML = ''

  const cardBorder = document.createElement('div')
  cardBorder.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  cardBody.innerHTML = `<h2 class="card-title h4">${i18nInstance.t(APP_MESSAGES.ELEMENT_FEEDS)}</h2>`

  const feedListEl = document.createElement('ul')
  feedListEl.classList.add('list-group', 'border-0', 'rounded-0')

  state.feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')

    li.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>`

    feedListEl.prepend(li)
  })

  cardBorder.append(cardBody, feedListEl)
  elements.feeds.append(cardBorder)
}

const setAttribute = (element, attr) => {
  Object.entries(attr).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

const renderPosts = (state, elements, i18nInstance) => {
  elements.posts.innerHTML = ''

  const cardBorder = document.createElement('div')
  cardBorder.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  cardBody.innerHTML = `<h2 class="card-title h4">${i18nInstance.t(APP_MESSAGES.ELEMENT_POSTS)}</h2>`

  const postsListEl = document.createElement('ul')
  postsListEl.classList.add('list-group', 'border-0', 'rounded-0')

  state.posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    )

    const linkEl = document.createElement('a')
    const linkAttributes = {
      'href': post.url,
      'class': 'fw-bold',
      'data-id': post.id,
      'target': '_blank',
      'rel': 'noopener noreferrer',
    }

    setAttribute(linkEl, linkAttributes)
    linkEl.textContent = post.title

    const buttonEl = document.createElement('button')
    const buttonAttribute = {
      'type': 'button',
      'class': 'btn btn-outline-primary btn-sm',
      'data-id': post.id,
      'data-bs-toggle': 'modal',
      'data-bs-target': '#modal',
    }

    setAttribute(buttonEl, buttonAttribute)
    buttonEl.textContent = i18nInstance.t(APP_MESSAGES.BUTTON_VIEW)

    li.append(linkEl, buttonEl)
    postsListEl.append(li)
  })

  cardBorder.append(cardBody, postsListEl)
  elements.posts.append(cardBorder)
}

const renderModal = (post, modalElement, i18nInstance) => {
  const modalTitleEl = modalElement.querySelector('.modal-title')
  const modalBodyEl = modalElement.querySelector('.modal-body')
  const modalLinkEl = modalElement.querySelector('.full-article')
  const modalButtonClose = modalElement.querySelector('.modal-footer > [data-bs-dismiss="modal"]')

  modalTitleEl.textContent = post.title
  modalBodyEl.textContent = post.description
  modalLinkEl.href = post.url

  modalLinkEl.textContent = i18nInstance.t(APP_MESSAGES.MODAL_READ)
  modalButtonClose.textContent = i18nInstance.t(APP_MESSAGES.MODAL_CLOSE)
}

export { renderError, renderFeeds, renderModal, renderPosts, renderLoadingProcces }
