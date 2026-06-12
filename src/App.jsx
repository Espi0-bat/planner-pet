import { useState, useEffect } from 'react'
import Landing from './components/Landing'
import Wizard from './components/Wizard'
import LoadingScreen from './components/LoadingScreen'
import Paywall from './components/Paywall'
import Dashboard from './components/Dashboard'
import { generateToken, saveSession, loadSession, getTokenFromUrl, setUrlToken } from './utils/token'

// screens: landing | wizard | loading | paywall | dashboard
export default function App() {
  const [screen, setScreen] = useState('landing')
  const [userData, setUserData] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const urlToken = getTokenFromUrl()
    if (urlToken) {
      const saved = loadSession(urlToken)
      if (saved) {
        setUserData(saved)
        setToken(urlToken)
        setScreen('dashboard')
      }
    }
  }, [])

  function handleWizardComplete(data) {
    setUserData(data)
    setScreen('loading')
  }

  function handleLoadingDone() {
    setScreen('paywall')
  }

  function handlePayment() {
    const newToken = generateToken()
    saveSession(newToken, userData)
    setUrlToken(newToken)
    setToken(newToken)
    setScreen('dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {screen === 'landing' && <Landing onStart={() => setScreen('wizard')} />}
      {screen === 'wizard' && <Wizard onComplete={handleWizardComplete} />}
      {screen === 'loading' && <LoadingScreen userData={userData} onDone={handleLoadingDone} />}
      {screen === 'paywall' && <Paywall userData={userData} onPay={handlePayment} />}
      {screen === 'dashboard' && <Dashboard userData={userData} token={token} />}
    </div>
  )
}
