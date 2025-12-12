export default {
  translation: {
    validation: {
      required: 'Поле не должно быть пустым',
      url: 'Ссылка должна быть валидным URL',
      notOneOf: 'RSS уже существует',
    },
    loadingErrors: {
      invalidRSS: 'Ресурс по этой ссылке не является корректным RSS-фидом',
      networkError: 'Проблемы с сетью. Не удалось подключиться к серверу',
      unknownError: 'Произошла непредвиденная ошибка приложения',
    },
    status: {
      success: 'RSS успешно загружен',
      loading: 'Загрузка...',
    },
    elements: {
      feeds: 'Фиды',
      Posts: 'Посты',
    },
  },
}
