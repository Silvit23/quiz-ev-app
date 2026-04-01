export function hasMergedOptions(options) {
  return (options || []).some((opt) => /[A-E]\)/.test(opt.text || ''))
}

export function validateParsedQuestion(question) {
  const issues = []

  if (!question.statement) issues.push('statement')
  if (!question.alternatives || question.alternatives.length < 2) issues.push('alternatives')

  const ids = new Set((question.alternatives || []).map((alt) => alt.id))
  if (ids.size !== (question.alternatives || []).length) issues.push('duplicate_alternatives')
  if (!ids.has(question.correctAlternativeId)) issues.push('correct_not_found')
  if (hasMergedOptions(question.alternatives)) issues.push('merged_alternatives')

  return {
    isValid: issues.length === 0,
    issues,
  }
}

export function buildSafeFallbackQuestion(rawText) {
  return {
    statement: rawText || '',
    alternatives: [],
    correctAlternativeId: 'A',
    structureStatus: 'inconsistent',
    structureIssues: ['fallback'],
  }
}

