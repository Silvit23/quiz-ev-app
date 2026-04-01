import { extractOptions } from '../../parser/QuestionParser'
import { detectQuestionType } from '../../parser/QuestionTypeDetector'
import { validateParsedQuestion } from '../../parser/QuestionValidator'
import { normalizeRawText, normalizeExplanation } from '../../text/QuestionTextNormalizer'
import { buildTrainingExplanation } from '../../presentation/TrainingExplanationBuilder'
import { QUESTION_TYPES } from '../../domain/QuestionTypes'

const provaModules = import.meta.glob('./prova*.js', { eager: true })

function extractNumberFromText(text) {
  const match = String(text || '').match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
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
  const alternatives = extractOptions(question.alternatives || question.alternativas || [])
  const fallbackCorrectId = alternatives[0]?.id || 'A'

  const normalized = {
    id: String(question.id || `${examId}-q${String(index + 1).padStart(3, '0')}`),
    statement: normalizeRawText(question.statement || question.enunciado || ''),
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

  normalized.type = detectQuestionType(normalized.statement, normalized.alternatives)
  normalized.trainingExplanation = buildTrainingExplanation(normalized)

  const validation = validateParsedQuestion(normalized)
  if (!validation.isValid) {
    normalized.structureStatus = 'inconsistent'
    normalized.structureIssues = validation.issues
  }

  if (import.meta.env.DEV) {
    console.debug('[QUESTION_RAW]', question)
    console.debug('[QUESTION_NORMALIZED]', normalized)
    console.debug('[QUESTION_PARSED]', {
      statement: normalized.statement,
      alternatives: normalized.alternatives,
      correct: normalized.correctAlternativeId,
      type: normalized.type,
    })
    console.debug('[QUESTION_VALIDATION]', validation)
  }

  return normalized
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

