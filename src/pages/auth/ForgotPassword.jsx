import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const [sent, setSent]       = useState(false)
  const [email, setEmail]     = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire to backend reset endpoint when available
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>We’ll send a reset link to your email.</p>
        {sent
          ? <div className="alert alert-success">Reset link sent! Check your inbox.</div>
          : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Reset Link</button>
            </form>
          )
        }
        <p className={styles.footer}><Link to="/login" className="text-link">← Back to sign in</Link></p>
      </div>
    </div>
  )
}
