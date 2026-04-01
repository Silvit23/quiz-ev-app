import { Link } from 'react-router-dom'
import TopBar from '../components/navigation/TopBar'
import PrimaryButton from '../components/navigation/PrimaryButton'
import { getAllModules, getTotalQuestionCount } from '../data'
import { getTeoricaLoadSummary } from '../data/teorica'

function HomePage() {
  const modules = getAllModules()
  const teorica = modules.find((module) => module.id === 'teorica-geral-ev')
  const descontinuidades = modules.find((module) => module.id === 'descontinuidades-juntas-soldadas')
  const totalQuestions = getTotalQuestionCount()
  const teoricaSummary = getTeoricaLoadSummary()

  return (
    <main className="page-shell">
      <TopBar
        title="Quiz EV ABENDI"
        subtitle="Base de estudo para Inspeção Visual Subaquática com fluxo de treino e prova."
      />

      <section className="panel hero-panel">
        <p className="kicker">Navegação rápida</p>
        <div className="button-grid">
          <Link to={`/selecao?module=${teorica?.id || ''}`} className="button-link">
            <PrimaryButton>Teórica Geral EV</PrimaryButton>
          </Link>
          <Link to={`/selecao?module=${descontinuidades?.id || ''}`} className="button-link">
            <PrimaryButton>Descontinuidades</PrimaryButton>
          </Link>
          <Link to="/revisao-erros" className="button-link">
            <PrimaryButton className="secondary">Revisar erros</PrimaryButton>
          </Link>
        </div>
      </section>

      <section className="panel info-panel">
        <h2>Base atual</h2>
        <p>Teórica Geral EV: <strong>{teoricaSummary.totalExams}</strong> prova(s), <strong>{teoricaSummary.totalQuestions}</strong> questão(ões).</p>
        <p>Total geral cadastrado no app: <strong>{totalQuestions}</strong> questão(ões).</p>
        <p>As provas da Teórica são carregadas automaticamente de <code>src/data/teorica/prova*.js</code>.</p>
      </section>
    </main>
  )
}

export default HomePage
