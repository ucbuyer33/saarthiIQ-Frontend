// saarthiIQ-Frontend\src\pages\profile\Profile.jsx
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usersAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: 'var(--space-4)' }}>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>{value ?? '—'}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="card" style={{ padding: 'var(--space-5)' }}>
      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, value }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{value ?? '—'}</p>
    </div>
  )
}

export default function Profile() {
  const { user, setUser, role } = useAuth()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    language: '',
    theme: '',
    email_preferences: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        timezone: user.timezone || '',
        language: user.language || '',
        theme: user.theme || '',
        email_preferences: user.email_preferences || '',
      })
    }
  }, [user])

  const stats = useMemo(() => {
    const shared = [
      { label: 'Email', value: user?.email },
      { label: 'Phone', value: user?.phone },
      { label: 'Location', value: user?.location },
      { label: 'Joined', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
    ]

    const recruiter = [
      { label: 'Candidates Created', value: user?.candidates_created },
      { label: 'Interviews Scheduled', value: user?.interviews_scheduled },
      { label: 'Campaigns Created', value: user?.campaigns_created },
      { label: 'Tasks Completed', value: user?.tasks_completed },
      { label: 'Last Activity', value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '—' },
    ]

    const admin = [
      { label: 'Assigned Role', value: role || user?.role },
      { label: 'Permission Scope', value: user?.permission_scope },
      { label: 'Admin Privileges', value: user?.admin_privileges },
      { label: 'Users Managed', value: user?.users_managed },
      { label: 'Last Activity', value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '—' },
    ]

    return { shared, recruiter, admin }
  }, [user, role])

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
      const res = await usersAPI.update(payload)
      const nextUser = res.data?.data || res.data
      setUser(nextUser)
      toast.success('Profile updated')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = role === 'admin'

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <PageHeader title="Profile" subtitle="Manage your account details" />

      <section className="card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Avatar name={user?.full_name} size={72} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{user?.full_name || 'My Profile'}</h1>
            <div style={{ marginTop: 'var(--space-1)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{user?.email || '—'}</p>
              <Badge status={role || 'user'} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => document.getElementById('profile-edit-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Edit Profile
          </button>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {stats.shared.map((item) => <StatCard key={item.label} {...item} />)}
        {(isAdmin ? stats.admin : stats.recruiter).map((item) => <StatCard key={item.label} {...item} />)}
      </section>

      <Section title={isAdmin ? 'Access Summary' : 'Work Summary'}>
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {isAdmin ? (
            <>
              <Field label="Assigned Role" value={role || user?.role} />
              <Field label="Permission Scope" value={user?.permission_scope} />
              <Field label="Admin Privileges" value={user?.admin_privileges} />
              <Field label="Users Managed" value={user?.users_managed} />
            </>
          ) : (
            <>
              <Field label="Active Candidates" value={user?.active_candidates} />
              <Field label="Resumes Processed" value={user?.resumes_processed} />
              <Field label="Interviews" value={user?.interviews_scheduled} />
              <Field label="Campaigns Owned" value={user?.campaigns_owned} />
            </>
          )}
        </div>
      </Section>

      <Section title={isAdmin ? 'System Activity' : 'Recent Activity'}>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {isAdmin
            ? 'Show recent audit events, moderation actions, and account changes here.'
            : 'Show latest candidate updates, notes, task changes, and interview actions here.'}
        </p>
      </Section>

      <Section title="Preferences">
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <Field label="Timezone" value={user?.timezone || form.timezone} />
          <Field label="Notification Settings" value={user?.notification_settings} />
          <Field label="Language" value={user?.language || form.language} />
          <Field label="Theme" value={user?.theme || form.theme} />
          <Field label="Email Preferences" value={user?.email_preferences || form.email_preferences} />
        </div>
      </Section>

      <Section title="Security & Account Actions">
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <p>Password change, session info, logout everywhere, and safe account deletion should live here.</p>
        </div>
      </Section>

      <form id="profile-edit-form" onSubmit={handleSave} className="card" style={{ padding: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Edit Profile</h2>
        <div className="form-group">
          <label className="label">Full Name</label>
          <input className="input" value={form.full_name} onChange={handleChange('full_name')} required />
        </div>
        <div className="form-group">
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={handleChange('email')} required />
        </div>
        <div className="form-group">
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={handleChange('phone')} />
        </div>
        <div className="form-group">
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={handleChange('location')} />
        </div>
        <div className="form-group">
          <label className="label">Language</label>
          <input className="input" value={form.language} onChange={handleChange('language')} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Spinner size={14} /> : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}