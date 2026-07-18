// src/pages/profile/Profile.jsx
import { useEffect, useMemo, useState } from 'react'
import {
  User, Mail, Phone, MapPin, Calendar, CheckSquare,
  CalendarClock, Megaphone, Users, Activity, Settings,
  Shield, Edit3, Save, Globe, Bell, Palette, AtSign,
  ChevronRight, LogOut
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { usersAPI } from '@/lib/api'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './Profile.module.css'

// ─── Stat card ────────────────────────────────────────────────────────────────
const STAT_META = {
  Email:                { icon: Mail,          gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  Phone:                { icon: Phone,         gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  Location:             { icon: MapPin,         gradient: 'linear-gradient(135deg,#16a34a,#15803d)' },
  Joined:               { icon: Calendar,      gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Candidates Created': { icon: Users,         gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'Interviews Scheduled':{ icon: CalendarClock,gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  'Campaigns Created':  { icon: Megaphone,     gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Tasks Completed':    { icon: CheckSquare,   gradient: 'linear-gradient(135deg,#16a34a,#15803d)' },
  'Last Activity':      { icon: Activity,      gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
  'Assigned Role':      { icon: Shield,        gradient: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
  'Permission Scope':   { icon: Shield,        gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'Admin Privileges':   { icon: Shield,        gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Users Managed':      { icon: Users,         gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
}

function StatCard({ label, value }) {
  const meta = STAT_META[label] || { icon: Activity, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' }
  const Icon = meta.icon
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: meta.gradient }}>
        <Icon size={15} />
      </div>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value ?? '—'}</p>
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        {Icon && <Icon size={15} />}
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ─── Inline field row ─────────────────────────────────────────────────────────
function Field({ label, value, icon: Icon }) {
  return (
    <div className={styles.field}>
      {Icon && <div className={styles.fieldIcon}><Icon size={13} /></div>}
      <div>
        <p className={styles.fieldLabel}>{label}</p>
        <p className={styles.fieldValue}>{value ?? '—'}</p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Profile() {
  const { user, setUser, role } = useAuth()
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    location: '', timezone: '', language: '',
    theme: '', email_preferences: '',
  })
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

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
      { label: 'Email',    value: user?.email },
      { label: 'Phone',    value: user?.phone },
      { label: 'Location', value: user?.location },
      { label: 'Joined',   value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
    ]
    const recruiter = [
      { label: 'Candidates Created',   value: user?.candidates_created },
      { label: 'Interviews Scheduled', value: user?.interviews_scheduled },
      { label: 'Campaigns Created',    value: user?.campaigns_created },
      { label: 'Tasks Completed',      value: user?.tasks_completed },
      { label: 'Last Activity',        value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '—' },
    ]
    const admin = [
      { label: 'Assigned Role',      value: role || user?.role },
      { label: 'Permission Scope',   value: user?.permission_scope },
      { label: 'Admin Privileges',   value: user?.admin_privileges },
      { label: 'Users Managed',      value: user?.users_managed },
      { label: 'Last Activity',      value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '—' },
    ]
    return { shared, recruiter, admin }
  }, [user, role])

  const handleChange = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
      const res = await usersAPI.update(payload)
      setUser(res.data?.data || res.data)
      toast.success('Profile updated')
      setEditOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile')
    } finally { setLoading(false) }
  }

  const isAdmin = role === 'admin'
  const initials = (user?.full_name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className={styles.page}>

      {/* ── Hero card ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroBanner} />
        <div className={styles.heroBody}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              <Avatar name={user?.full_name} size={72} />
            </div>
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroNameRow}>
              <h1 className={styles.heroName}>{user?.full_name || 'My Profile'}</h1>
              <span className={styles.roleBadge} data-role={role}>
                {role || 'user'}
              </span>
            </div>
            <p className={styles.heroEmail}>
              <Mail size={12} /> {user?.email || '—'}
            </p>
          </div>
          <button
            className={styles.editBtn}
            onClick={() => { setEditOpen(o => !o); setTimeout(() => document.getElementById('profile-edit-form')?.scrollIntoView({ behavior: 'smooth' }), 50) }}
          >
            <Edit3 size={13} /> {editOpen ? 'Close Editor' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* ── Stat grid ── */}
      <div className={styles.statGrid}>
        {[...stats.shared, ...(isAdmin ? stats.admin : stats.recruiter)].map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Work / Access Summary ── */}
      <Section title={isAdmin ? 'Access Summary' : 'Work Summary'} icon={isAdmin ? Shield : Activity}>
        <div className={styles.fieldGrid}>
          {isAdmin ? (
            <>
              <Field label="Assigned Role"     value={role || user?.role}            icon={Shield}   />
              <Field label="Permission Scope"  value={user?.permission_scope}         icon={Shield}   />
              <Field label="Admin Privileges"  value={user?.admin_privileges}         icon={Shield}   />
              <Field label="Users Managed"     value={user?.users_managed}            icon={Users}    />
            </>
          ) : (
            <>
              <Field label="Active Candidates"  value={user?.active_candidates}       icon={Users}         />
              <Field label="Resumes Processed"  value={user?.resumes_processed}       icon={CheckSquare}   />
              <Field label="Interviews"         value={user?.interviews_scheduled}    icon={CalendarClock} />
              <Field label="Campaigns Owned"    value={user?.campaigns_owned}         icon={Megaphone}     />
            </>
          )}
        </div>
      </Section>

      {/* ── Recent Activity ── */}
      <Section title={isAdmin ? 'System Activity' : 'Recent Activity'} icon={Activity}>
        <div className={styles.placeholderBox}>
          <Activity size={18} className={styles.placeholderIcon} />
          <p className={styles.placeholderText}>
            {isAdmin
              ? 'Recent audit events, moderation actions, and account changes will appear here.'
              : 'Latest candidate updates, notes, task changes, and interview actions will appear here.'}
          </p>
        </div>
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences" icon={Settings}>
        <div className={styles.fieldGrid}>
          <Field label="Timezone"             value={user?.timezone || form.timezone}                           icon={Globe}   />
          <Field label="Notification Settings" value={user?.notification_settings}                              icon={Bell}    />
          <Field label="Language"             value={user?.language || form.language}                           icon={Globe}   />
          <Field label="Theme"                value={user?.theme || form.theme}                                 icon={Palette} />
          <Field label="Email Preferences"    value={user?.email_preferences || form.email_preferences}        icon={AtSign}  />
        </div>
      </Section>

      {/* ── Security ── */}
      <Section title="Security & Account" icon={Shield}>
        <div className={styles.securityList}>
          {[
            { label: 'Change Password',        sub: 'Update your login password' },
            { label: 'Active Sessions',         sub: 'Manage where you are logged in' },
            { label: 'Logout Everywhere',       sub: 'Sign out from all devices' },
            { label: 'Delete Account',          sub: 'Permanently remove your account', danger: true },
          ].map(item => (
            <div key={item.label} className={`${styles.securityRow} ${item.danger ? styles.securityRowDanger : ''}`}>
              <div>
                <p className={styles.securityLabel}>{item.label}</p>
                <p className={styles.securitySub}>{item.sub}</p>
              </div>
              <ChevronRight size={15} className={styles.securityChevron} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Edit form ── */}
      {editOpen && (
        <form id="profile-edit-form" onSubmit={handleSave} className={styles.editForm}>
          <div className={styles.editFormHeader}>
            <div className={styles.editFormIcon}><Edit3 size={16}/></div>
            <div>
              <h2 className={styles.editFormTitle}>Edit Profile</h2>
              <p className={styles.editFormSub}>Update your personal information</p>
            </div>
          </div>

          <div className={styles.editGrid}>
            {[
              { key: 'full_name', label: 'Full Name',  icon: User,  type: 'text',  required: true },
              { key: 'email',     label: 'Email',       icon: Mail,  type: 'email', required: true },
              { key: 'phone',     label: 'Phone',       icon: Phone, type: 'tel' },
              { key: 'location',  label: 'Location',    icon: MapPin,type: 'text' },
              { key: 'language',  label: 'Language',    icon: Globe, type: 'text' },
            ].map(({ key, label, icon: Icon, type, required }) => (
              <div key={key} className={styles.editField}>
                <label className={styles.editLabel}>{label}{required && <span className={styles.req}> *</span>}</label>
                <div className={styles.editInputWrap}>
                  <Icon size={13} className={styles.editInputIcon} />
                  <input
                    className={styles.editInput}
                    type={type}
                    value={form[key]}
                    onChange={handleChange(key)}
                    required={required}
                    placeholder={label}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.editActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setEditOpen(false)}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? <><Spinner size={13}/> Saving…</> : <><Save size={13}/> Save Changes</>}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
