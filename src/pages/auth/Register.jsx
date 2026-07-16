import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import styles from './Auth.module.css'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      await authAPI.register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <svg viewBox="0 0 32 32" fill="none" width="40" height="40"><rect width="32" height="32" rx="8" fill="var(--color-primary)" /><path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="10" r="2" fill="white" /><line x1="11" y1="22" x2="21" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
          <span className={styles.logoText}>SaarthiIQ</span>
        </div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join your team on SaarthiIQ</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className="input" type="text" placeholder="Shajaf Khan" value={form.full_name} onChange={set('full_name')} required />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
          </div>
          <div className="form-group">
            <label className="label">Confirm Password</label>
            <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
          </div>
          <div className="form-group">
            <label className="label">Account Type</label>
            <select
              className="input"
              value={form.role || 'user'}
              onChange={set('role')}
            >
              <option value="user">Recrutee</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <Spinner size={16} /> : 'Create Account'}
          </button>
        </form>
        <p className={styles.footer}>Already have an account? <Link to="/login" className="text-link">Sign in</Link></p>
      </div>
    </div>
  )
}
