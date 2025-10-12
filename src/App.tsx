import { Routes, Route } from 'react-router'
import LandingPage from './pages/landing/landingPage'
import LoginPage from './pages/login/loginPage'
import OnboardingPage from './pages/onboarding/onboardingPage'
import DashboardPage from './pages/dashboard/dashboardPage'
import { ROUTES } from './lib/constants'
import './styles/global.css'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.ARTICLES} element={<DashboardPage />} />
      <Route path={ROUTES.CHATBOT} element={<DashboardPage />} />
      <Route path={ROUTES.PROSPECTUS} element={<DashboardPage />} />
      <Route path={ROUTES.DIRECTORY} element={<DashboardPage />} />
    </Routes>
  )
}

export default App
