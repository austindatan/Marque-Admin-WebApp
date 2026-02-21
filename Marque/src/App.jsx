import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Navigation'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Organizations from './pages/Organizations'
import Events from './pages/Events'
import StudentForms from './pages/forms/StudentForms'
import './styles/App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar onLogout={handleLogout} />
        <main className="ml-64 flex-1 min-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/student_forms" element={<StudentForms />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
