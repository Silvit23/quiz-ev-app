import { QUESTION_TYPES } from '../domain/QuestionTypes'

export function detectQuestionType(statement, options) {
  const text = String(statement || '').toLowerCase()
  const hasEnumList = /\b1\s*[–-]/.test(statement || '')
  const hasTrueFalse = /verdadeir[ao]\s+ou\s+fals[ao]/i.test(text) || /assinalar.*verdadeir/i.test(text)

  if (hasTrueFalse) return QUESTION_TYPES.TRUE_FALSE
  if (hasEnumList) return QUESTION_TYPES.ENUMERATED

  const mergedOption = (options || []).some((opt) => /[A-E]\)/.test(opt.text || ''))
  if (mergedOption) return QUESTION_TYPES.COMPLEX_STATEMENT

  return QUESTION_TYPES.SINGLE_CHOICE
}

