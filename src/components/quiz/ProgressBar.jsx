function ProgressBar({ current, total }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <section className="progress-wrap" aria-label="Progresso do quiz">
      <div className="progress-label-row">
        <span>Questão {current} de {total}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}

export default ProgressBar

