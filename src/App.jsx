import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ModuleSelectionPage from './pages/ModuleSelectionPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import ReviewErrorsPage from './pages/ReviewErrorsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/selecao" element={<ModuleSelectionPage />} />
      <Route path="/quiz/:moduleId/:examId/:mode" element={<QuizPage />} />
      <Route path="/resultado" element={<ResultPage />} />
      <Route path="/revisao-erros" element={<ReviewErrorsPage />} />
    </Routes>
  )
}

export default App

