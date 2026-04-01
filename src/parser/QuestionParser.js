import { normalizeRawText } from '../text/QuestionTextNormalizer'

function splitAlternativesText(rawText) {
  const text = normalizeRawText(rawText)
  const matches = [...text.matchAll(/([A-E])\)\s*/g)]
  if (matches.length < 2) return null

  const parts = []
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i]
    const next = matches[i + 1]
    const id = current[1]
    const start = current.index + current[0].length
    const end = next ? next.index : text.length
    const value = text.slice(start, end).trim()
    if (value) {
      parts.push({ id, text: value })
    }
  }

  return parts.length ? parts : null
}

export function extractOptions(rawAlternatives) {
  const normalized = []

  if (Array.isArray(rawAlternatives)) {
    rawAlternatives.forEach((alternative) => {
      if (typeof alternative === 'string') {
        const split = splitAlternativesText(alternative)
        if (split) {
          split.forEach((item) => normalized.push({ id: item.id, text: item.text }))
        } else {
          normalized.push({
            id: String.fromCharCode(65 + normalized.length),
            text: normalizeRawText(alternative),
          })
        }
        return
      }

      const rawText = alternative.text || alternative.texto || ''
      const split = splitAlternativesText(rawText)
      if (split) {
        split.forEach((item) => normalized.push({ id: item.id, text: item.text }))
        return
      }

      normalized.push({
        id: String(alternative.id || String.fromCharCode(65 + normalized.length)).toUpperCase(),
        text: normalizeRawText(rawText),
      })
    })
    return normalized
  }

  if (rawAlternatives && typeof rawAlternatives === 'object') {
    Object.entries(rawAlternatives).forEach(([id, text]) => {
      const split = splitAlternativesText(text)
      if (split) {
        split.forEach((item) => normalized.push({ id: item.id, text: item.text }))
      } else {
        normalized.push({ id: String(id).toUpperCase(), text: normalizeRawText(text) })
      }
    })
  }

  return normalized
}

