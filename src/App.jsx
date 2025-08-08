import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import LandingPage from './components/LandingPage'
import './App.css'

function App() {
  return (
    <>
      <LandingPage />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
    </>
  )
}

export default App
