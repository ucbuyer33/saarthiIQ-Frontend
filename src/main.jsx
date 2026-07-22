// saarthiIQ-Frontend\src\main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './styles/base.css'
import './styles/components.css'

<<<<<<< HEAD
const media = window.matchMedia('(prefers-color-scheme: dark)')
document.documentElement.dataset.theme = media.matches ? 'dark' : 'light'

const handleThemeChange = (e) => {
  document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'
}
=======
// NOTE: Theme initialisation is handled in two places only:
//   1. index.html inline <script> — sets data-theme before first paint (no flicker)
//   2. ThemeContext.jsx — owns theme state, persists to localStorage, reacts to toggle
// Do NOT add any document.documentElement.dataset.theme assignments here —
// they bypass localStorage and override the user's saved preference.
>>>>>>> 25581a99414c680a51dde4b30c4a080b9f04bd3b

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
