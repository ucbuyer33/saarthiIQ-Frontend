import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import styles from './Auth.module.css'

const AVATARS = [
  { color: '#6366f1', letter: 'A' },
  { color: '#ef4444', letter: 'R' },
  { color: '#f59e0b', letter: 'F' },
  { color: '#eab308', letter: 'M' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.login({ username: form.username, password: form.password })
      const role = await login(res.data.access_token)
      if (role === 'admin') navigate('/admin/users')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.leftGlow1} aria-hidden="true" />
        <div className={styles.leftGlow2} aria-hidden="true" />
        <div className={styles.leftGlow3} aria-hidden="true" />

        <header className={styles.leftHeader}>
          <div className={styles.leftLogo}>
            <div className={styles.logoIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
                <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="10" r="2" fill="white"/>
                <line x1="11" y1="22" x2="21" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.logoMeta}>
              <span className={styles.leftLogoText}>SaarthiIQ</span>
              <span className={styles.leftLogoSub}>AI LEARNING PLATFORM</span>
            </div>
          </div>
        </header>

        <main className={styles.leftContent}>
          <p className={styles.leftTag}>INTELLIGENT LEARNING OS</p>
          <h1 className={styles.leftHeading}>
            Every question<br />
            you ask{' '}
            <em className={styles.leftHeadingAccent}>sharpens</em>{' '}
            your mind.
          </h1>
          <p className={styles.leftDesc}>
            SaarthiIQ adapts to how you learn — tracking mastery,
            surfacing gaps, and guiding you toward genuine understanding.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>94%</span>
              <span className={styles.statLabel}>Avg. score improvement</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.statValue}>2.4×</span>
              <span className={styles.statLabel}>Faster concept retention</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.statValue}>50K+</span>
              <span className={styles.statLabel}>Active learners</span>
            </div>
          </div>
        </main>

        <footer className={styles.avatarRow}>
          <div className={styles.avatarStack} aria-hidden="true">
            {AVATARS.map((av, i) => (
              <div
                key={i}
                className={styles.avatar}
                style={{ background: av.color, zIndex: AVATARS.length - i }}
              >
                {av.letter}
              </div>
            ))}
          </div>
          <span className={styles.avatarLabel}>Joined by 50,000+ students this year</span>
        </footer>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.subtitle}>Sign in to continue your learning journey</p>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="username">Email address</label>
              <input
                id="username"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  className={styles.input}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? <Spinner size={16} />
                : <><span>Sign in</span><ArrowRight size={15} className={styles.arrowIcon} /></>
              }
            </button>
          </form>

          <div className={styles.divider}><span>OR</span></div>

          <button type="button" className={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className={styles.footer}>
            New to SaarthiIQ?{' '}
            <Link to="/register" className={styles.createLink}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}