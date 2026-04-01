const provaModules = import.meta.glob('./prova*.js', { eager: true })

function extractNumberFromText(text) {
  const match = String(text || '').match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\bTeion\b/gi, 'Teórica')
    .replace(/\bp\/\b/gi, 'para')
    .replace(/\bc\/\b/gi, 'com')
    .replace(/\bc\s+onduz/gi, 'conduz')
    .replace(/\br\s+elacion/gi, 'relacion')
    .replace(/\bs\s+ubaqu/gi, 'subaqu')
    .replace(/\bcl\s+assificar/gi, 'classificar')
    .replace(/\bnã\s+o/gi, 'nao')
    .replace(/\bnaou\b/gi, ' ou ')
    .replace(/\bnaos\b/gi, 'nos')
    .replace(/\bAsnao/gi, 'As ')
    .replace(/\basnao/gi, 'as ')
    .replace(/\bcnao/gi, 'co')
    .replace(/\bverdadeiranaou\b/gi, 'verdadeira ou')
    .replace(/\bfalsanaou\b/gi, 'falsa ou')
    .replace(/\bentrenaos\b/gi, 'entre os')
    .replace(/\bdentrenaos\b/gi, 'dentre os')
    .replace(/\bapresentanaos\b/gi, 'apresenta os')
    .replace(/\bladonaonde\b/gi, 'lado onde')
    .replace(/\bformanaoriginal\b/gi, 'forma original')
    .replace(/\banaocorr(ê|e)ncia\b/gi, 'a ocorrencia')
    .replace(/\bdanaocorr(ê|e)ncia\b/gi, 'da ocorrencia')
    .replace(/\bnaocorr(ê|e)ncia\b/gi, 'ocorrencia')
    .replace(/\bnao([a-zA-Z])/g, 'nao $1')
    .replace(/([a-zA-Z])nao\b/g, '$1 nao')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function normalizeExplanation(text) {
  let cleaned = normalizeText(text)
  if (!cleaned) return ''

  const collapseDuplicateBlock = (value) => {
    const trimmed = value.trim()
    const half = Math.floor(trimmed.length / 2)
    if (half > 0 && trimmed.length % 2 === 0) {
      const first = trimmed.slice(0, half)
      const second = trimmed.slice(half)
      if (first === second) return first.trim()
    }
    return trimmed
  }

  cleaned = collapseDuplicateBlock(cleaned)

  const sentences = cleaned.split(/(?<=[.!?])\s+/)
  if (sentences.length > 1 && sentences.length % 2 === 0) {
    const half = sentences.length / 2
    const firstBlock = sentences.slice(0, half).join(' ')
    const secondBlock = sentences.slice(half).join(' ')
    if (firstBlock === secondBlock) {
      cleaned = firstBlock.trim()
    }
  }

  return cleaned
}

function normalizeAlternatives(question) {
  const alternativesSource = question.alternatives || question.alternativas || []

  if (Array.isArray(alternativesSource)) {
    return alternativesSource.map((alternative, index) => {
      if (typeof alternative === 'string') {
        return { id: String.fromCharCode(65 + index), text: normalizeText(alternative) }
      }

      return {
        id: String(alternative.id || String.fromCharCode(65 + index)).toUpperCase(),
        text: normalizeText(alternative.text || alternative.texto || ''),
      }
    })
  }

  if (alternativesSource && typeof alternativesSource === 'object') {
    return Object.entries(alternativesSource).map(([id, text]) => ({
      id: String(id).toUpperCase(),
      text: normalizeText(text),
    }))
  }

  return []
}

function getQuestionsFromExportValue(value) {
  if (Array.isArray(value)) return value

  if (value && typeof value === 'object') {
    if (Array.isArray(value.questions)) return value.questions
    if (Array.isArray(value.questoes)) return value.questoes
  }

  return []
}

function collectRawQuestions() {
  const questions = []

  Object.values(provaModules).forEach((moduleExports) => {
    Object.values(moduleExports).forEach((exportValue) => {
      getQuestionsFromExportValue(exportValue).forEach((question) => {
        questions.push(question)
      })
    })
  })

  return questions
}

function toExamId(title, fallbackIndex) {
  const number = extractNumberFromText(title)

  if (number !== Number.MAX_SAFE_INTEGER) {
    return `teorica-prova-${String(number).padStart(2, '0')}`
  }

  return `teorica-prova-${String(fallbackIndex + 1).padStart(2, '0')}`
}

function normalizeQuestion(question, examId, index) {
  const alternatives = normalizeAlternatives(question)
  const fallbackCorrectId = alternatives[0]?.id || 'A'

  return {
    id: String(question.id || `${examId}-q${String(index + 1).padStart(3, '0')}`),
    statement: normalizeText(question.statement || question.enunciado || ''),
    alternatives,
    correctAlternativeId: String(
      question.correctAlternativeId ||
        question.respostaCorreta ||
        question.gabarito ||
        question.correta ||
        fallbackCorrectId,
    ).toUpperCase(),
    explanation: normalizeExplanation(question.explanation || question.explicacao || ''),
  }
}

function buildTeoricaExams() {
  const groupedByProva = new Map()

  collectRawQuestions().forEach((question) => {
    const provaTitle = String(question.prova || 'Prova sem identificação')

    if (!groupedByProva.has(provaTitle)) {
      groupedByProva.set(provaTitle, [])
    }

    groupedByProva.get(provaTitle).push(question)
  })

  return Array.from(groupedByProva.entries())
    .sort(([titleA], [titleB]) => {
      const numberA = extractNumberFromText(titleA)
      const numberB = extractNumberFromText(titleB)
      if (numberA !== numberB) return numberA - numberB
      return titleA.localeCompare(titleB)
    })
    .map(([title, questions], examIndex) => {
      const examId = toExamId(title, examIndex)

      const normalizedQuestions = questions
        .slice()
        .sort((a, b) => Number(a.numero || 0) - Number(b.numero || 0))
        .map((question, questionIndex) => normalizeQuestion(question, examId, questionIndex))

      return {
        id: examId,
        title,
        description: '',
        questions: normalizedQuestions,
      }
    })
}

const teoricaExams = buildTeoricaExams()

export const teoricaModuleData = {
  id: 'teorica-geral-ev',
  title: 'Teórica Geral EV',
  shortLabel: 'Teórica Geral EV',
  exams: teoricaExams,
}

export function getTeoricaLoadSummary() {
  const totalExams = teoricaExams.length
  const totalQuestions = teoricaExams.reduce((acc, exam) => acc + exam.questions.length, 0)
  return { totalExams, totalQuestions }
}
