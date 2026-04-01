import { teoricaModuleData } from './teorica'
import { descontinuidadesModuleData } from './descontinuidades'

const modules = [teoricaModuleData, descontinuidadesModuleData]

export function getAllModules() {
  return modules
}

export function getModuleById(moduleId) {
  return modules.find((module) => module.id === moduleId)
}

export function getExamById(moduleId, examId) {
  const module = getModuleById(moduleId)
  if (!module) return null
  return module.exams.find((exam) => exam.id === examId) || null
}

export function getTotalQuestionCount() {
  return modules.reduce((moduleAcc, module) => {
    const moduleQuestions = module.exams.reduce((examAcc, exam) => examAcc + exam.questions.length, 0)
    return moduleAcc + moduleQuestions
  }, 0)
}

export function getQuestionById(moduleId, examId, questionId) {
  const exam = getExamById(moduleId, examId)
  if (!exam) return null
  return exam.questions.find((question) => question.id === questionId) || null
}
