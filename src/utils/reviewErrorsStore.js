const STORAGE_KEY = 'quizEvApp_reviewErrors'

export function getReviewErrors() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Erro ao ler revisão de erros:', error)
    return []
  }
}

export function saveReviewErrors(errors) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(errors))
}

export function appendReviewErrors(newErrors) {
  if (!newErrors.length) return

  const currentErrors = getReviewErrors()
  const mergedById = new Map()

  currentErrors.forEach((errorItem) => {
    mergedById.set(errorItem.id, errorItem)
  })

  newErrors.forEach((errorItem) => {
    mergedById.set(errorItem.id, errorItem)
  })

  saveReviewErrors(Array.from(mergedById.values()))
}

