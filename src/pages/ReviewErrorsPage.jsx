import TopBar from '../components/navigation/TopBar'
import { getReviewErrors } from '../utils/reviewErrorsStore'

function ReviewErrorsPage() {
  const errors = getReviewErrors()

  return (
    <main className="page-shell">
      <TopBar
        title="Revisão de Erros"
        subtitle="Histórico local das questões respondidas incorretamente."
        showBack
      />

      <section className="panel">
        {errors.length === 0 ? (
          <article className="empty-state">
            <h2>Nenhum erro registrado ainda.</h2>
            <p>Responda um quiz e finalize para alimentar esta revisão.</p>
          </article>
        ) : (
          <div className="error-list">
            {errors.map((item) => (
              <article key={item.id} className="error-item">
                <p className="error-meta">{item.moduleTitle} • {item.examTitle}</p>
                <h2>{item.questionStatement}</h2>
                <p><strong>Sua resposta:</strong> {item.selectedAlternativeText}</p>
                <p><strong>Correta:</strong> {item.correctAlternativeText}</p>
                <p><strong>Explicação:</strong> {item.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ReviewErrorsPage

