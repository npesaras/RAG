import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing'
import LoginPage from './pages/login'
import './styles/global.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
