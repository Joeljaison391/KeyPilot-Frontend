import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ConsentProvider } from './context/ConsentContext'
import { TourProvider } from './context/TourContext'
import WelcomePage from './pages/WelcomePage'
import ConsentProtectedRoute from './components/ConsentProtectedRoute'
import LandingPage from './components/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Playground from './pages/Playground'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Inner App component that has access to consent context
function AppContent() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route 
              path="/login" 
              element={
                <ConsentProtectedRoute>
                  <LoginPage />
                </ConsentProtectedRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/playground" 
              element={
                <ProtectedRoute>
                  <Playground />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f9fafb',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f9fafb',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

// Main App component with providers
function App() {
  return (
    <ConsentProvider>
      <TourProvider>
        <AppContent />
      </TourProvider>
    </ConsentProvider>
  )
}

export default App
