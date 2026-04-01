import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../components/navigation/TopBar'
import PrimaryButton from '../components/navigation/PrimaryButton'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state

  if (!result) {
    return (
      <main className="page-shell">
        <TopBar title="Resultado indisponível" subtitle="Inicie um quiz para visualizar o desempenho." showBack />
        <section className="panel">
          <PrimaryButton onClick={() => navigate('/selecao')}>Ir para seleção</PrimaryButton>
        </section>
      </main>
    )
  }

  function handleRetry() {
    navigate(`/quiz/${result.moduleId}/${result.examId}/${result.mode}`)
  }

  const wrongAnswers = Array.isArray(result.answers)
    ? result.answers.filter((item) => !item.isCorrect)
    : []

  return (
    <main className="page-shell">
      <TopBar title="Resultado" subtitle={`${result.moduleTitle} • ${result.examTitle}`} showBack />

      <section className="panel result-grid">
        <article className="result-card">
          <h2>Acertos</h2>
          <p>{result.totalCorrect}</p>
        </article>
        <article className="result-card">
          <h2>Erros</h2>
          <p>{result.totalWrong}</p>
        </article>
        <article className="result-card highlight">
          <h2>Percentual</h2>
          <p>{result.percentage}%</p>
        </article>
      </section>

      <section className="panel button-grid result-actions">
        <PrimaryButton onClick={handleRetry}>Refazer</PrimaryButton>
        <PrimaryButton onClick={() => navigate('/revisao-erros')} className="secondary">
          Revisar erros
        </PrimaryButton>
      </section>

      {wrongAnswers.length > 0 ? (
        <section className="panel">
          <h2>Revisão rápida dos erros</h2>
          <div className="error-list">
            {wrongAnswers.map((item) => (
              <article key={item.id} className="error-item">
                <h2>{item.questionStatement}</h2>
                <p><strong>Sua resposta:</strong> {item.selectedAlternativeText}</p>
                <p><strong>Correta:</strong> {item.correctAlternativeText}</p>
                <p><strong>Explicação:</strong> {item.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default ResultPage

