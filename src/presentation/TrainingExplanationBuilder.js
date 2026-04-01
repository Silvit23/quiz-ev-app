import { normalizeRawText } from '../text/QuestionTextNormalizer'

function extractConcept(text) {
  const match = String(text || '').match(/Conceito\s+central:\s*([^.\n]+)/i)
  return match ? match[1].trim() : ''
}

export function buildTrainingExplanation(question) {
  const correctId = question.correctAlternativeId
  const explanationText = normalizeRawText(question.explanation || '')
  const concept = extractConcept(explanationText)

  const correctRationale = explanationText
    ? explanationText
    : concept
      ? `O conceito principal envolvido é ${concept}.`
      : 'Explicação não cadastrada.'

  const wrongRationales = (question.alternatives || []).map((alt) => {
    if (alt.id === correctId) return null
    const base = concept
      ? `Não está alinhada ao conceito central (${concept}).`
      : 'Não há justificativa cadastrada para esta alternativa.'
    return { id: alt.id, text: base }
  }).filter(Boolean)

  const summary = concept
    ? `Resumo: ${concept}.`
    : 'Resumo: revise o conceito principal da questão.'

  return {
    correctId,
    correctRationale,
    wrongRationales,
    summary,
  }
}

