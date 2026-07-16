import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usersAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, setUser, role } = useAuth()
  const [form, setForm]         = useState({ full_name: '', email: '' })
  const [loading, setLoading]   = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || '', email: user.email || '' })
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await usersAPI.update(form)
      setUser(res.data)
      toast.success('Profile updated')
    } catch { toast.error('Failed to update profile') } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <PageHeader title="Profile" subtitle="Manage your account details" />
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <Avatar name={user?.full_name} size={64} />
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{user?.full_name}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{user?.email}</p>
            <Badge status={role} />
          </div>
        </div>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className="input" value={form.full_name} onChange={set('full_name')} required />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={set('email')} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size={14} /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
