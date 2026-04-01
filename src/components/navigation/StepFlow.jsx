function StepFlow({ currentStep }) {
  const steps = ['Módulo', 'Prova', 'Modo', 'Início']

  return (
    <ol className="step-flow" aria-label="Fluxo de seleção">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const status = stepNumber === currentStep ? 'is-current' : stepNumber < currentStep ? 'is-complete' : ''

        return (
          <li key={step} className={status}>
            <span>{stepNumber}</span>
            <strong>{step}</strong>
          </li>
        )
      })}
    </ol>
  )
}

export default StepFlow

