import { normalizeRawText } from '../text/QuestionTextNormalizer'

export function formatQuestionForDisplay(statement) {
  const content = normalizeRawText(statement)
  const listMatch = content.match(/^(.*?)(\b1\s*[–-]\s*.+)$/)
  if (!listMatch) {
    return { intro: content, items: [] }
  }

  const intro = listMatch[1].trim()
  const listPart = listMatch[2]
  const items = []
  const regex = /(\d+)\s*[–-]\s*([^]+?)(?=(\d+\s*[–-]\s*)|$)/g
  let match
  while ((match = regex.exec(listPart))) {
    items.push({ number: match[1], text: match[2].trim() })
  }

  return { intro, items }
}

