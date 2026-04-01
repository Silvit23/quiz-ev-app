const provaModules = import.meta.glob('./prova*.js', { eager: true })

function extractNumberFromText(text) {
  const match = String(text || '').match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function normalizeAlternatives(question) {
  const alternativesSource = question.alternatives || question.alternativas || []

  const normalizeText = (text) =>
    String(text || '')
      .replace(/\bTeion\b/gi, 'Teórica')
      .replace(/\bp\/\b/gi, 'para')
      .replace(/\bc\/\b/gi, 'com')
      .replace(/\bc\s+onduz/gi, 'conduz')
      .replace(/\br\s+elacion/gi, 'relacion')
      .replace(/\bs\s+ubaqu/gi, 'subaqu')
      .replace(/\bcl\s+assificar/gi, 'classificar')
      .replace(/\bnã\s+o/gi, 'nao')

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
  const normalizeText = (text) =>
    String(text || '')
      .replace(/\bTeion\b/gi, 'Teórica')
      .replace(/\bp\/\b/gi, 'para')
      .replace(/\bc\/\b/gi, 'com')
      .replace(/\bc\s+onduz/gi, 'conduz')
      .replace(/\br\s+elacion/gi, 'relacion')
      .replace(/\bs\s+ubaqu/gi, 'subaqu')
      .replace(/\bcl\s+assificar/gi, 'classificar')
      .replace(/\bnã\s+o/gi, 'nao')

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
    explanation: String(question.explanation || question.explicacao || ''),
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
