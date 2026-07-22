// saarthiIQ-Frontend\src\pages\auth\Register.jsx
import { useState, useEffect } from 'react'
import BrandLogo from '@/components/BrandLogo';
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ArrowRight,
  Users,
  FileText,
  BarChart3,
  ShieldCheck,
  UserRoundCheck,
  FileCheck,
} from 'lucide-react'
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
  { key: 'len', label: 'At least 8 characters', test: p => p.length >= 8 },
  { key: 'upper', label: 'Contains uppercase letter', test: p => /[A-Z]/.test(p) },
  { key: 'lower', label: 'Contains lowercase letter', test: p => /[a-z]/.test(p) },
  { key: 'number', label: 'Contains number', test: p => /[0-9]/.test(p) },
  { key: 'special', label: 'Contains special character', test: p => /[^A-Za-z0-9]/.test(p) },
]

const STRENGTH_META = [
  { label: 'Very Weak', color: '#ef4444', pct: '20%' },
  { label: 'Weak', color: '#ef4444', pct: '20%' },
  { label: 'Fair', color: '#f59e0b', pct: '50%' },
  { label: 'Good', color: '#4db6bc', pct: '75%' },
  { label: 'Strong', color: '#4ade80', pct: '100%' },
]

function getStrength(pw) {
  if (!pw) return -1
  return PW_RULES.filter(r => r.test(pw)).length - 1  // 0–4 index
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pwFocused, setPwFocused] = useState(false)
  const [showStrength, setShowStrength] = useState(false)

  // Show when focused or has text
  useEffect(() => {
    if (pwFocused || form.password.length > 0) {
      setShowStrength(true)
    } else {
      setShowStrength(false)
    }
  }, [pwFocused, form.password])

  // Auto-collapse after 0.1s when all rules pass
  useEffect(() => {
    const allPassed = PW_RULES.every(r => r.test(form.password))
    if (allPassed && form.password.length > 0 && !pwFocused) {
      const t = setTimeout(() => setShowStrength(false), 100)
      return () => clearTimeout(t)
    }
  }, [form.password, pwFocused])
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const strengthIdx = getStrength(form.password)
  const pwsMatch = form.confirm && form.password === form.confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      })

      const userId = res.data?.user_id

      if (userId) {
        toast.success(`Account created! Your ID: ${userId}`)
        // Wait a bit before navigating so user sees the toast
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        toast.success('Account created! Please sign in.')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }
  const FEATURES = [
    {
      id: 'matching',
      icon: <Users size={20} strokeWidth={2} />,
      title: 'Smart candidate matching',
      sub: 'Find the right fit faster with AI',
    },
    {
      id: 'resume',
      icon: <FileText size={20} strokeWidth={2} />,
      title: 'Resume intelligence',
      sub: 'AI-powered analysis & skill extraction',
    },
    {
      id: 'hiring',
      icon: <BarChart3 size={20} strokeWidth={2} />,
      title: 'Data-driven hiring',
      sub: 'Analytics and insights to hire with confidence',
    },
  ]

  const STATS = [
    {
      id: 'candidates',
      icon: <UserRoundCheck size={18} strokeWidth={2.2} />,
      value: '50K+',
      label: 'Candidate Profiles',
    },
    {
      id: 'resumes',
      icon: <FileCheck size={18} strokeWidth={2.2} />,
      value: '1M+',
      label: 'Resumes Processed',
    },
    {
      id: 'accuracy',
      icon: <BarChart3 size={18} strokeWidth={2.2} />,
      value: '95%',
      label: 'Match Accuracy',
    },
  ]

  return (
    <div className={styles.page}>

      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.leftGlow1} aria-hidden="true" />
        <div className={styles.leftGlow2} aria-hidden="true" />
        <div className={styles.leftGlow3} aria-hidden="true" />

        <header className={styles.leftHeader}>
          <div className={styles.leftLogo}>
            <BrandLogo className={styles.leftLogoImage} // add this class in Auth.module.css
            />
          </div>
        </header>

        <main className={styles.leftContent}>
          <p className={styles.leftTag}>START YOUR RECRUITMENT JOURNEY</p>
          <h1 className={styles.leftHeading}>
            Hire the right talent.<br />
            Build
            <em className={styles.leftHeadingAccent}> winning teams.</em>
          </h1>
          <p className={styles.leftDesc}>
            Create your free SaarthiHire account and join thousands of
            recruiters who simplify hiring with AI-powered insights,
            smart matching, and end-to-end recruiting.
          </p>

          {/* ── Feature Cards (icon + title + subtitle) ── */}
          <div className={styles.featureList}>
            {FEATURES.map((f) => (
              <div key={f.id} className={styles.featureItem}>
                <span className={styles.featureIconWrap} aria-hidden="true">
                  {f.icon}
                </span>
                <span className={styles.featureText}>
                  <strong className={styles.featureTitle}>{f.title}</strong>
                  <span className={styles.featureSub}>{f.sub}</span>
                </span>
              </div>
            ))}
          </div>

          {/* ── Stats Bar ── */}
          <div className={styles.statsBar}>
            {STATS.map((s) => (
              <div key={s.id} className={styles.statItem}>
                <span className={styles.statIconWrap} aria-hidden="true">
                  {s.icon}
                </span>
                <div>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className={styles.trustRow}>
          <span className={styles.trustIcon} aria-hidden="true">
            <ShieldCheck size={16} strokeWidth={2} />
          </span>
          <span className={styles.trustLabel}>
            Secure. Reliable. Trusted by recruitment professionals.
          </span>
        </footer>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Create your Recruiter account</h2>
            <p className={styles.subtitle}>Join 80,000+ recruiters using SaarthiHire</p>
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
              <div className={`${styles.strengthWrap} ${showStrength ? styles.strengthOpen : styles.strengthClosed}`}>
                <div className={styles.strengthPanel}>
                  <div className={styles.strengthBarTrack}>
                    <div
                      className={styles.strengthBarFill}
                      style={{
                        width: strengthIdx >= 0 ? STRENGTH_META[strengthIdx].pct : '0%',
                        background: strengthIdx >= 0 ? STRENGTH_META[strengthIdx].color : '#ef4444',
                      }}
                    />
                  </div>

                  {strengthIdx >= 0 && (
                    <p className={styles.strengthText}>
                      Password strength:{' '}
                      <strong style={{ color: STRENGTH_META[strengthIdx].color }}>
                        {STRENGTH_META[strengthIdx].label}
                      </strong>
                    </p>
                  )}

                  <ul className={styles.pwRuleList} aria-label="Password requirements">
                    {PW_RULES.map(rule => {
                      const passed = form.password && rule.test(form.password)
                      return (
                        <li key={rule.key} className={`${styles.pwRule} ${passed ? styles.pwRulePassed : ''}`}>
                          <span className={styles.pwRuleIcon} aria-hidden="true">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {rule.label}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

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
