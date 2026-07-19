import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, ShieldCheck, Sparkles, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 900))
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.left}>
        <div className={styles.leftGlow1} />
        <div className={styles.leftGlow2} />
        <div className={styles.leftGlow3} />

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

        <div className={styles.leftContent}>
          <div className={styles.leftTag}><ShieldCheck size={16} /> Account Recovery</div>
          <h1 className={styles.leftHeading}>
            Reset your <span className={styles.leftHeadingAccent}> password</span>.
          </h1>
          <p className={styles.leftDesc}>
            We’ll send a secure reset link to your inbox so you can get back to managing your work in a few taps.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureCheck}><CheckCircle2 size={12} /></span>
              Secure email-based recovery.
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureCheck}><CheckCircle2 size={12} /></span>
              Fast access back to your account.
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureCheck}><CheckCircle2 size={12} /></span>
              Clean, distraction-free reset flow.
            </div>
          </div>
        </div>

        <div className={styles.avatarRow}>
          <div className={styles.avatarStack}>
            <div className={styles.avatar} style={{ background: '#4f46e5' }}>AI</div>
            <div className={styles.avatar} style={{ background: '#0891b2' }}>HR</div>
            <div className={styles.avatar} style={{ background: '#16a34a' }}>PM</div>
          </div>
          <div className={styles.avatarLabel}>Trusted by modern hiring teams</div>
        </div>
      </aside>

      <main className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Reset password</h1>
            <p className={styles.subtitle}>We’ll send a reset link to your email.</p>
          </div>

          {sent ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}><CheckCircle2 size={18} /></div>
              <div>
                <h2 className={styles.successTitle}>Reset link sent</h2>
                <p className={styles.successText}>
                  Check your inbox for instructions to create a new password.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Email</label>
                </div>
                <div className={styles.inputWrap}>
                  <Mail size={14} className={styles.inputIcon} />
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
                <ArrowRight size={16} className={styles.arrowIcon} />
              </button>
            </form>
          )}

          <p className={styles.footer}>
            <Link to="/login" className={styles.createLink}>← Back to sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}