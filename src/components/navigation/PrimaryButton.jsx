function PrimaryButton({ children, onClick, disabled = false, type = 'button', className = '' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`primary-button ${className}`.trim()}>
      {children}
    </button>
  )
}

export default PrimaryButton

