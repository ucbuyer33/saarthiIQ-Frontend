// saarthiIQ-Frontend\src\pages\auth\Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Check, ArrowRight } from 'lucide-react'
import { authAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import styles from './Auth.module.css'
import toast from 'react-hot-toast'

const AVATARS = [
  { color: '#6366f1', letter: 'A' },
  { color: '#ef4444', letter: 'R' },
  { color: '#f59e0b', letter: 'F' },
  { color: '#eab308', letter: 'M' },
]

const PW_RULES = [
  { key: 'len',     label: 'At least 8 characters',    test: p => p.length >= 8 },
  { key: 'upper',   label: 'Contains uppercase letter', test: p => /[A-Z]/.test(p) },
  { key: 'lower',   label: 'Contains lowercase letter', test: p => /[a-z]/.test(p) },
  { key: 'number',  label: 'Contains number',           test: p => /[0-9]/.test(p) },
  { key: 'special', label: 'Contains special character',test: p => /[^A-Za-z0-9]/.test(p) },
]

const STRENGTH_META = [
  { label: 'Very Weak', color: '#ef4444', pct: '20%'  },
  { label: 'Weak',      color: '#ef4444', pct: '20%'  },
  { label: 'Fair',      color: '#f59e0b', pct: '50%'  },
  { label: 'Good',      color: '#4db6bc', pct: '75%'  },
  { label: 'Strong',    color: '#4ade80', pct: '100%' },
]

function getStrength(pw) {
  if (!pw) return -1
  return PW_RULES.filter(r => r.test(pw)).length - 1  // 0–4 index
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm: '', role: 'user',
  })
  const [showPw, setShowPw]           = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [pwFocused, setPwFocused]     = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const strengthIdx = getStrength(form.password)
  const pwsMatch    = form.confirm && form.password === form.confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      await authAPI.register({
        full_name: form.full_name,
        email:     form.email,
        password:  form.password,
        role:      form.role,
      })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
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
              <svg viewBox="0 0 32 32" fill="none" width="18" height="18">
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
          <p className={styles.leftTag}>START YOUR JOURNEY</p>
          <h1 className={styles.leftHeading}>
            Build knowledge<br />
            that actually{' '}
            <em className={styles.leftHeadingAccent}>sticks.</em>
          </h1>
          <p className={styles.leftDesc}>
            Create your free account and join 50,000+ learners who use
            SaarthiIQ to track mastery, close skill gaps, and grow faster.
          </p>

          <div className={styles.featureList}>
            {[
              'Personalised learning path from day one',
              'AI-powered gap analysis after every session',
              'Track progress across topics and skills',
            ].map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureCheck} aria-hidden="true">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>{f}</span>
              </div>
            ))}
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
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.subtitle}>Join your team on SaarthiIQ.</p>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Full Name */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                className={styles.input}
                type="text"
                placeholder="John Doe"
                value={form.full_name}
                onChange={set('full_name')}
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Email address</label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  className={styles.input}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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

              {/* Strength UI — shows when typing */}
              {(form.password || pwFocused) && (
                <div className={styles.strengthPanel}>
                  {/* Bar */}
                  <div className={styles.strengthBarTrack}>
                    <div
                      className={styles.strengthBarFill}
                      style={{
                        width: strengthIdx >= 0 ? STRENGTH_META[strengthIdx].pct : '0%',
                        background: strengthIdx >= 0 ? STRENGTH_META[strengthIdx].color : '#ef4444',
                      }}
                    />
                  </div>

                  {/* Label */}
                  {strengthIdx >= 0 && (
                    <p className={styles.strengthText}>
                      Password strength:{' '}
                      <strong style={{ color: STRENGTH_META[strengthIdx].color }}>
                        {STRENGTH_META[strengthIdx].label}
                      </strong>
                    </p>
                  )}

                  {/* Checklist */}
                  <ul className={styles.pwRuleList} aria-label="Password requirements">
                    {PW_RULES.map(rule => {
                      const passed = form.password && rule.test(form.password)
                      return (
                        <li
                          key={rule.key}
                          className={`${styles.pwRule} ${passed ? styles.pwRulePassed : ''}`}
                        >
                          <span className={styles.pwRuleIcon} aria-hidden="true">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {rule.label}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="confirm">Confirm Password</label>
                {pwsMatch && (
                  <span className={styles.matchBadge}>
                    <Check size={11} strokeWidth={3} /> Passwords match
                  </span>
                )}
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id="confirm"
                  className={styles.input}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(p => !p)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Account Type */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="role">Account Type</label>
              <div className={styles.selectWrap}>
                <select
                  id="role"
                  className={styles.select}
                  value={form.role}
                  onChange={set('role')}
                >
                  <option value="user">Recruitee — I'm looking for opportunities</option>
                  <option value="recruiter">Recruiter — I'm hiring talent</option>
                </select>
                <svg
                  className={styles.selectChevron}
                  viewBox="0 0 16 16"
                  fill="none"
                  width="14"
                  height="14"
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              style={{ marginTop: 'var(--space-2)' }}
            >
              {loading
                ? <Spinner size={16} />
                : <><span>Create account</span><ArrowRight size={15} className={styles.arrowIcon} /></>
              }
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" className={styles.createLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}