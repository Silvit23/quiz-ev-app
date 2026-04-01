import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../components/navigation/TopBar'
import PrimaryButton from '../components/navigation/PrimaryButton'
import ProgressBar from '../components/quiz/ProgressBar'
import { QUIZ_MODES } from '../data/constants'
import { getExamById, getModuleById } from '../data'
import { appendReviewErrors } from '../utils/reviewErrorsStore'

function QuizPage() {
  const navigate = useNavigate()
  const { moduleId, examId, mode } = useParams()

  const module = getModuleById(moduleId)
  const exam = getExamById(moduleId, examId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAlternativeId, setSelectedAlternativeId] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState([])

  const question = exam?.questions[currentIndex]
  const totalQuestions = exam?.questions.length || 0
  const isTrainingMode = mode === QUIZ_MODES.TRAINING
  const isVisualQuestion = Boolean(question?.type === 'visual' || (question?.options && !question?.alternatives))
  const moduleTitle = moduleId === 'teorica-geral-ev' ? 'Teórica Geral EV' : module?.title

  const selectedAlternative = question?.alternatives
    ? question.alternatives.find((item) => item.id === selectedAlternativeId)
    : null
  const visualOptions = isVisualQuestion ? question?.options || [] : []
  const visualCorrectOptions = isVisualQuestion ? question?.correctOptions || [] : []
  const isVisualCorrect =
    isVisualQuestion &&
    selectedOptions.length === visualCorrectOptions.length &&
    selectedOptions.every((item) => visualCorrectOptions.includes(item))
  const isAnswerCorrect = answered && (isVisualQuestion ? isVisualCorrect : selectedAlternativeId === question.correctAlternativeId)

  if (!module || !exam || !question) {
    return (
      <main className="page-shell">
        <TopBar title="Quiz não encontrado" subtitle="Verifique o módulo, prova e modo selecionados." showBack />
        <section className="panel">
          <PrimaryButton onClick={() => navigate('/selecao')}>Voltar para seleção</PrimaryButton>
        </section>
      </main>
    )
  }

  function normalizeDisplayText(text) {
    if (!text) return ''
    return String(text)
      .replace(/\bTeion\b/gi, 'Teórica')
      .replace(/\bp\/\b/gi, 'para')
      .replace(/\bc\/\b/gi, 'com')
      .replace(/\bAsnao/gi, 'As ')
      .replace(/\basnao/gi, 'as ')
      .replace(/\bcnao/gi, 'co')
      .replace(/\bnaou\b/gi, ' ou ')
      .replace(/\bnaos\b/gi, 'nos')
      .replace(/\bverdadeiranaou\b/gi, 'verdadeira ou')
      .replace(/\bfalsanaou\b/gi, 'falsa ou')
      .replace(/\bentrenaos\b/gi, 'entre os')
      .replace(/\bdentrenaos\b/gi, 'dentre os')
      .replace(/\bapresentanaos\b/gi, 'apresenta os')
      .replace(/\bladonaonde\b/gi, 'lado onde')
      .replace(/\bformanaoriginal\b/gi, 'forma original')
      .replace(/\bnao([a-zA-Z])/g, 'nao $1')
      .replace(/([a-zA-Z])nao\b/g, '$1 nao')
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  function formatQuestionBlocks(text) {
    const content = normalizeDisplayText(text)
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

  function toggleVisualOption(option) {
    if (answered) return
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    )
  }

  function handleSubmitAnswer() {
    if (answered) return

    if (isVisualQuestion) {
      if (selectedOptions.length === 0) return

      const isCorrect =
        selectedOptions.length === visualCorrectOptions.length &&
        selectedOptions.every((item) => visualCorrectOptions.includes(item))

      const answerEntry = {
        moduleId,
        moduleTitle,
        examId,
        examTitle: exam.title,
        mode,
        questionId: question.id,
        questionStatement: question.statement,
        selectedAlternativeId: selectedOptions.join('|'),
        selectedAlternativeText: selectedOptions.join('; '),
        correctAlternativeId: visualCorrectOptions.join('|'),
        correctAlternativeText: visualCorrectOptions.join('; '),
        explanation: question.explanation || '',
        isCorrect,
        id: `${moduleId}__${examId}__${question.id}`,
      }

      setAnswers((prev) => [...prev, answerEntry])
      setAnswered(true)
      return
    }

    if (!selectedAlternativeId) return

    const answerEntry = {
      moduleId,
      moduleTitle,
      examId,
      examTitle: exam.title,
      mode,
      questionId: question.id,
      questionStatement: question.statement,
      selectedAlternativeId,
      selectedAlternativeText: selectedAlternative?.text || '',
      correctAlternativeId: question.correctAlternativeId,
      correctAlternativeText:
        question.alternatives.find((item) => item.id === question.correctAlternativeId)?.text || '',
      explanation: question.explanation || '',
      isCorrect: selectedAlternativeId === question.correctAlternativeId,
      id: `${moduleId}__${examId}__${question.id}`,
    }

    setAnswers((prev) => [...prev, answerEntry])
    setAnswered(true)
  }

  function handleNextQuestion() {
    const isLastQuestion = currentIndex >= totalQuestions - 1

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAlternativeId('')
      setSelectedOptions([])
      setAnswered(false)
      return
    }

    const nextAnswers = answers
    const wrongAnswers = nextAnswers.filter((item) => !item.isCorrect)
    appendReviewErrors(wrongAnswers)

    const totalCorrect = nextAnswers.filter((item) => item.isCorrect).length
    const totalWrong = nextAnswers.length - totalCorrect
    const percentage = nextAnswers.length > 0 ? Math.round((totalCorrect / nextAnswers.length) * 100) : 0

    navigate('/resultado', {
      state: {
        moduleId,
        moduleTitle: module.title,
        examId,
        examTitle: exam.title,
        mode,
        totalQuestions: nextAnswers.length,
        totalCorrect,
        totalWrong,
        percentage,
        answers: nextAnswers,
      },
    })
  }

  function getOptionClassName(alternativeId) {
    if (!answered) {
      const selectedClass = alternativeId === selectedAlternativeId ? ' is-selected' : ''
      return `option-button${selectedClass}`
    }

    if (alternativeId === question.correctAlternativeId) return 'option-button is-correct'
    if (alternativeId === selectedAlternativeId && selectedAlternativeId !== question.correctAlternativeId) {
      return 'option-button is-wrong'
    }

    return 'option-button'
  }

  const canSubmit = isVisualQuestion
    ? Boolean(selectedOptions.length > 0 && !answered)
    : Boolean(selectedAlternativeId && !answered)
  const canProceed = answered

  const formattedStatement = formatQuestionBlocks(question.statement)

  return (
    <main className="page-shell">
      <TopBar
        title={normalizeDisplayText(moduleTitle)}
        subtitle={`${exam.title} • Modo ${isTrainingMode ? 'Treino' : 'Prova'}`}
        showBack
      />

      <section className="panel">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        <article className="question-card">
          {question.structureStatus === 'inconsistent' ? (
            <p className="question-warning">Questão com estrutura inconsistente.</p>
          ) : null}
          <div className="question-text">
            {formattedStatement.intro ? <p>{formattedStatement.intro}</p> : null}
            {formattedStatement.items.length > 0 ? (
              <ol className="question-list">
                {formattedStatement.items.map((item) => (
                  <li key={`${item.number}-${item.text}`}>
                    <strong>{item.number}.</strong> {item.text}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          {isVisualQuestion ? (
            <>
              <p className="photo-label">{question.title}</p>
              <div className="photo-frame">
                <img
                  src={question.imageUrl}
                  alt={question.title || 'Foto do treino'}
                  loading="lazy"
                />
              </div>
              <div className="options-list">
                {visualOptions.map((option) => {
                  const isSelected = selectedOptions.includes(option)
                  const isCorrect = visualCorrectOptions.includes(option)
                  let optionClass = 'option-button'

                  if (!answered && isSelected) {
                    optionClass = 'option-button is-selected'
                  } else if (answered && isCorrect) {
                    optionClass = 'option-button is-correct'
                  } else if (answered && isSelected && !isCorrect) {
                    optionClass = 'option-button is-wrong'
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      className={`${optionClass} visual-option`}
                      onClick={() => toggleVisualOption(option)}
                      disabled={answered}
                    >
                      <span>{isSelected ? '[x]' : '[ ]'}</span>
                      <p>{normalizeDisplayText(option)}</p>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="options-list">
              {question.alternatives.map((alternative) => (
                <button
                  key={alternative.id}
                  type="button"
                  className={getOptionClassName(alternative.id)}
                  onClick={() => setSelectedAlternativeId(alternative.id)}
                  disabled={answered}
                >
                  <span>{alternative.id.toUpperCase()})</span>
                  <p>{normalizeDisplayText(alternative.text)}</p>
                </button>
              ))}
            </div>
          )}
          {isTrainingMode && answered ? (
            <>
              {isVisualQuestion && question.gabaritoImageUrl ? (
                <div className="gabarito-frame">
                  <p><strong>Gabarito visual:</strong></p>
                  <div className="gabarito-image">
                    <img
                      src={question.gabaritoImageUrl}
                      alt={`Gabarito ${question.title}`}
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}
              <div className={`feedback-box ${isAnswerCorrect ? 'ok' : 'error'}`}>
                <strong>
                  {isAnswerCorrect ? 'Resposta correta.' : 'Resposta incorreta.'}
                </strong>
                {isVisualQuestion ? (
                  <>
                    <div className="feedback-list">
                      <p><strong>Você marcou:</strong></p>
                      <ul>
                        {selectedOptions.map((item) => (
                          <li key={`sel-${item}`}>{normalizeDisplayText(item)}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="feedback-list">
                      <p><strong>Correto seria:</strong></p>
                      <ul>
                        {(question.answerKey || []).map((entry) => (
                          <li key={`cor-${entry.number}-${entry.label}`}>
                            {entry.number}. {normalizeDisplayText(entry.label)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p>{normalizeDisplayText(question.explanation)}</p>
                  </>
                ) : (
                  <p>{normalizeDisplayText(question.explanation)}</p>
                )}
              </div>
            </>
          ) : null}
        </article>

        <div className="quiz-actions">
          <PrimaryButton onClick={handleSubmitAnswer} disabled={!canSubmit}>
            Responder
          </PrimaryButton>
          <PrimaryButton onClick={handleNextQuestion} disabled={!canProceed} className="secondary">
            {currentIndex >= totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
          </PrimaryButton>
        </div>
      </section>
    </main>
  )
}

export default QuizPage
