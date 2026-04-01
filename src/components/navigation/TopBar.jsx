import { Link, useNavigate } from 'react-router-dom'

function TopBar({ title, subtitle, showBack = false }) {
  const navigate = useNavigate()

  return (
    <header className="top-bar">
      <div className="top-bar-actions">
        {showBack ? (
          <button type="button" className="nav-chip" onClick={() => navigate(-1)}>
            Voltar
          </button>
        ) : (
          <span className="nav-chip nav-chip-ghost">Quiz EV</span>
        )}
        <Link to="/" className="nav-chip">
          Início
        </Link>
      </div>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  )
}

export default TopBar

