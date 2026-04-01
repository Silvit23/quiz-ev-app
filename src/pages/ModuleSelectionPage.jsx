import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../components/navigation/TopBar'
import StepFlow from '../components/navigation/StepFlow'
import PrimaryButton from '../components/navigation/PrimaryButton'
import { QUIZ_MODES } from '../data/constants'
import { getAllModules, getModuleById } from '../data'

function ModuleSelectionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const modules = getAllModules()

  const preselectedModule = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('module')
  }, [location.search])

  const [moduleId, setModuleId] = useState(preselectedModule || modules[0]?.id || '')
  const module = getModuleById(moduleId)
  const [examId, setExamId] = useState(module?.exams[0]?.id || '')
  const [mode, setMode] = useState(QUIZ_MODES.TRAINING)

  function handleSelectModule(nextModuleId) {
    setModuleId(nextModuleId)
    const selectedModule = getModuleById(nextModuleId)
    setExamId(selectedModule?.exams[0]?.id || '')
  }

  function handleStartQuiz() {
    if (!moduleId || !examId || !mode) return
    navigate(`/quiz/${moduleId}/${examId}/${mode}`)
  }

  const canStart = Boolean(moduleId && examId && mode)
  const hasExams = Boolean(module?.exams.length)

  return (
    <main className="page-shell">
      <TopBar
        title="Seleção do Quiz"
        subtitle="Siga as etapas para iniciar seu estudo."
        showBack
      />

      <section className="panel">
        <StepFlow currentStep={canStart ? 4 : 3} />

        <div className="selector-block">
          <h2>1) Escolha o módulo</h2>
          <div className="selector-grid">
            {modules.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`select-card ${item.id === moduleId ? 'is-selected' : ''}`}
                onClick={() => handleSelectModule(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.exams.length} prova(s)</span>
              </button>
            ))}
          </div>
        </div>

        <div className="selector-block">
          <h2>2) Escolha a prova</h2>
          {hasExams ? (
            <div className="selector-grid">
              {module?.exams.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  className={`select-card ${exam.id === examId ? 'is-selected' : ''}`}
                  onClick={() => setExamId(exam.id)}
                >
                  <strong>{exam.title}</strong>
                  <span>{exam.questions.length} questão(ões)</span>
                </button>
              ))}
            </div>
          ) : (
            <p>Nenhuma prova disponível neste módulo no momento.</p>
          )}
        </div>

        <div className="selector-block">
          <h2>3) Escolha o modo</h2>
          <div className="selector-grid two-columns">
            <button
              type="button"
              className={`select-card ${mode === QUIZ_MODES.TRAINING ? 'is-selected' : ''}`}
              onClick={() => setMode(QUIZ_MODES.TRAINING)}
            >
              <strong>Treino</strong>
              <span>Mostra feedback imediato após responder.</span>
            </button>
            <button
              type="button"
              className={`select-card ${mode === QUIZ_MODES.EXAM ? 'is-selected' : ''}`}
              onClick={() => setMode(QUIZ_MODES.EXAM)}
            >
              <strong>Prova</strong>
              <span>Sem feedback imediato, foco em simulação.</span>
            </button>
          </div>
        </div>

        <PrimaryButton onClick={handleStartQuiz} disabled={!canStart}>
          Iniciar Quiz
        </PrimaryButton>
      </section>
    </main>
  )
}

export default ModuleSelectionPage

