// src/pages/profile/Profile.jsx
import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  User, Mail, Phone, MapPin, Calendar, CheckSquare,
  CalendarClock, Megaphone, Users, Activity, Settings,
  Shield, Edit3, Save, Globe, Bell, Palette, AtSign,
  ChevronRight, Lock, Monitor, LogOut, Trash2, Eye, EyeOff,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { usersAPI, auditAPI } from '@/lib/api'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import styles from './Profile.module.css'

// ─── Stat meta ───────────────────────────────────────────────────────────────
const STAT_META = {
  Email:                 { icon: Mail,          gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  Phone:                 { icon: Phone,         gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  Location:              { icon: MapPin,        gradient: 'linear-gradient(135deg,#16a34a,#15803d)' },
  Joined:                { icon: Calendar,      gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Candidates Created':  { icon: Users,         gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'Interviews Scheduled':{ icon: CalendarClock, gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  'Campaigns Created':   { icon: Megaphone,     gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Tasks Completed':     { icon: CheckSquare,   gradient: 'linear-gradient(135deg,#16a34a,#15803d)' },
  'Last Activity':       { icon: Activity,      gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
  'Assigned Role':       { icon: Shield,        gradient: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
  'Permission Scope':    { icon: Shield,        gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'Admin Privileges':    { icon: Shield,        gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Users Managed':       { icon: Users,         gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
}

function StatCard({ label, value }) {
  const meta = STAT_META[label] || { icon: Activity, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' }
  const Icon = meta.icon
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: meta.gradient }}><Icon size={15} /></div>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value ?? '\u2014'}</p>
      </div>
    </div>
  )
}

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

function Field({ label, value, icon: Icon }) {
  return (
    <div className={styles.field}>
      {Icon && <div className={styles.fieldIcon}><Icon size={13} /></div>}
      <div>
        <p className={styles.fieldLabel}>{label}</p>
        <p className={styles.fieldValue}>{value ?? '\u2014'}</p>
      </div>
    </div>
  )
}

// ─── Password field with show/hide ───────────────────────────────────────────
function PwdInput({ label, name, value, onChange, required, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className={styles.editField}>
      <label className={styles.editLabel}>{label}{required && <span className={styles.req}> *</span>}</label>
      <div className={styles.editInputWrap}>
        <Lock size={13} className={styles.editInputIcon} />
        <input
          className={styles.editInput}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder || label}
          autoComplete="new-password"
        />
        <button type="button" className={styles.pwdToggle} onClick={() => setShow(s => !s)} tabIndex={-1}>
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  )
}

// ─── Activity row ─────────────────────────────────────────────────────────────
function ActivityRow({ event }) {
  const ts = event.created_at || event.timestamp
  return (
    <div className={styles.activityRow}>
      <div className={styles.activityDot} />
      <div className={styles.activityContent}>
        <p className={styles.activityAction}>{event.action || event.event_type || 'Event'}</p>
        {event.detail && <p className={styles.activityDetail}>{event.detail}</p>}
      </div>
      <span className={styles.activityTime}>
        {ts ? new Date(ts).toLocaleString(undefined, { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '\u2014'}
      </span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser, role, logout } = useAuth()

  // ── Edit profile state
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', location:'', timezone:'', language:'', theme:'', email_preferences:'' })
  const [saving, setSaving]     = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // ── Change password state
  const [pwdOpen, setPwdOpen]   = useState(false)
  const [pwdForm, setPwdForm]   = useState({ current_password:'', new_password:'', confirm_password:'' })
  const [pwdSaving, setPwdSaving] = useState(false)

  // ── Security actions
  const [logoutLoading, setLogoutLoading]   = useState(false)
  const [deleteOpen, setDeleteOpen]         = useState(false)
  const [deleteLoading, setDeleteLoading]   = useState(false)

  // ── Activity feed
  const [activity, setActivity]   = useState([])
  const [actLoading, setActLoading] = useState(false)

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        full_name:         user.full_name         || '',
        email:             user.email             || '',
        phone:             user.phone             || '',
        location:          user.location          || '',
        timezone:          user.timezone          || '',
        language:          user.language          || '',
        theme:             user.theme             || '',
        email_preferences: user.email_preferences || '',
      })
    }
  }, [user])

  // Load activity feed
  const loadActivity = useCallback(async () => {
    setActLoading(true)
    try {
      const res = await auditAPI.getAll({ limit: 10 })
      const rows = res.data?.results || res.data || []
      setActivity(rows)
    } catch {
      setActivity([])
    } finally {
      setActLoading(false)
    }
  }, [])

  useEffect(() => { loadActivity() }, [loadActivity])

  // ── Stats
  const stats = useMemo(() => {
    const shared = [
      { label: 'Email',    value: user?.email },
      { label: 'Phone',    value: user?.phone },
      { label: 'Location', value: user?.location },
      { label: 'Joined',   value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '\u2014' },
    ]
    const recruiter = [
      { label: 'Candidates Created',    value: user?.candidates_created },
      { label: 'Interviews Scheduled',  value: user?.interviews_scheduled },
      { label: 'Campaigns Created',     value: user?.campaigns_created },
      { label: 'Tasks Completed',       value: user?.tasks_completed },
      { label: 'Last Activity',         value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '\u2014' },
    ]
    const admin = [
      { label: 'Assigned Role',     value: role || user?.role },
      { label: 'Permission Scope',  value: user?.permission_scope },
      { label: 'Admin Privileges',  value: user?.admin_privileges },
      { label: 'Users Managed',     value: user?.users_managed },
      { label: 'Last Activity',     value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '\u2014' },
    ]
    return { shared, recruiter, admin }
  }, [user, role])

  const isAdmin = role === 'admin'

  // ── Handlers
  const handleChange    = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const handlePwdChange = e => setPwdForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
      const res = await usersAPI.update(payload)
      setUser(res.data?.data || res.data)
      toast.success('Profile updated')
      setEditOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile')
    } finally { setSaving(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      toast.error('New passwords do not match')
      return
    }
    if (pwdForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setPwdSaving(true)
    try {
      await usersAPI.changePassword({
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      })
      toast.success('Password changed successfully')
      setPwdOpen(false)
      setPwdForm({ current_password:'', new_password:'', confirm_password:'' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password')
    } finally { setPwdSaving(false) }
  }

  const handleLogoutEverywhere = async () => {
    setLogoutLoading(true)
    try {
      await usersAPI.logoutEverywhere()
      toast.success('Logged out from all devices')
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to logout everywhere')
      setLogoutLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await usersAPI.deleteMe()
      toast.success('Account deleted')
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete account')
      setDeleteLoading(false)
    }
  }

  const scrollToEdit = () => {
    setEditOpen(true)
    setTimeout(() => document.getElementById('profile-edit-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const securityActions = [
    {
      key: 'change-password',
      label: 'Change Password',
      sub: 'Update your login password',
      icon: Lock,
      onClick: () => { setPwdOpen(o => !o); setPwdForm({ current_password:'', new_password:'', confirm_password:'' }) },
    },
    {
      key: 'active-sessions',
      label: 'Active Sessions',
      sub: 'Manage where you are logged in',
      icon: Monitor,
      onClick: () => toast('Session management coming soon', { icon: '\uD83D\uDCBB' }),
    },
    {
      key: 'logout-everywhere',
      label: 'Logout Everywhere',
      sub: 'Sign out from all devices',
      icon: LogOut,
      onClick: handleLogoutEverywhere,
      loading: logoutLoading,
    },
    {
      key: 'delete-account',
      label: 'Delete Account',
      sub: 'Permanently remove your account',
      icon: Trash2,
      danger: true,
      onClick: () => setDeleteOpen(true),
    },
  ]

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
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
              <span className={styles.roleBadge} data-role={role}>{role || 'user'}</span>
            </div>
            <p className={styles.heroEmail}><Mail size={12} /> {user?.email || '\u2014'}</p>
          </div>
          <button className={styles.editBtn} onClick={scrollToEdit}>
            <Edit3 size={13} /> Edit Profile
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
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
              <Field label="Assigned Role"    value={role || user?.role}       icon={Shield}        />
              <Field label="Permission Scope" value={user?.permission_scope}   icon={Shield}        />
              <Field label="Admin Privileges" value={user?.admin_privileges}   icon={Shield}        />
              <Field label="Users Managed"    value={user?.users_managed}      icon={Users}         />
            </>
          ) : (
            <>
              <Field label="Active Candidates"  value={user?.active_candidates}    icon={Users}         />
              <Field label="Resumes Processed"  value={user?.resumes_processed}    icon={CheckSquare}   />
              <Field label="Interviews"         value={user?.interviews_scheduled} icon={CalendarClock} />
              <Field label="Campaigns Owned"    value={user?.campaigns_owned}      icon={Megaphone}     />
            </>
          )}
        </div>
      </Section>

      {/* ── Activity ── */}
      <Section title={isAdmin ? 'System Activity' : 'Recent Activity'} icon={Activity}>
        {actLoading ? (
          <div className={styles.placeholderBox}><Spinner size={18} /></div>
        ) : activity.length === 0 ? (
          <div className={styles.placeholderBox}>
            <Activity size={18} className={styles.placeholderIcon} />
            <p className={styles.placeholderText}>
              {isAdmin ? 'Recent audit events will appear here.' : 'Latest candidate updates and task changes will appear here.'}
            </p>
          </div>
        ) : (
          <div className={styles.activityList}>
            {activity.map((ev, i) => <ActivityRow key={ev.id || i} event={ev} />)}
          </div>
        )}
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences" icon={Settings}>
        <div className={styles.fieldGrid}>
          <Field label="Timezone"              value={user?.timezone            || form.timezone}            icon={Globe}   />
          <Field label="Notification Settings" value={user?.notification_settings}                          icon={Bell}    />
          <Field label="Language"              value={user?.language            || form.language}            icon={Globe}   />
          <Field label="Theme"                 value={user?.theme               || form.theme}               icon={Palette} />
          <Field label="Email Preferences"     value={user?.email_preferences   || form.email_preferences}  icon={AtSign}  />
        </div>
      </Section>

      {/* ── Security ── */}
      <Section title="Security & Account" icon={Shield}>
        <div className={styles.securityList}>
          {securityActions.map(item => (
            <button
              key={item.key}
              type="button"
              className={`${styles.securityRow} ${item.danger ? styles.securityRowDanger : ''}`}
              onClick={item.onClick}
              disabled={item.loading}
            >
              <div className={styles.securityLeft}>
                {item.icon && <item.icon size={15} className={styles.securityIcon} />}
                <div>
                  <p className={styles.securityLabel}>{item.label}</p>
                  <p className={styles.securitySub}>{item.sub}</p>
                </div>
              </div>
              {item.loading ? <Spinner size={14} /> : <ChevronRight size={15} className={styles.securityChevron} />}
            </button>
          ))}
        </div>

        {/* Change Password inline form */}
        {pwdOpen && (
          <form onSubmit={handleChangePassword} className={styles.pwdForm}>
            <PwdInput label="Current Password" name="current_password" value={pwdForm.current_password} onChange={handlePwdChange} required />
            <PwdInput label="New Password"     name="new_password"     value={pwdForm.new_password}     onChange={handlePwdChange} required placeholder="Min 6 characters" />
            <PwdInput label="Confirm Password" name="confirm_password" value={pwdForm.confirm_password} onChange={handlePwdChange} required />
            <div className={styles.editActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setPwdOpen(false)}>Cancel</button>
              <button type="submit" className={styles.saveBtn} disabled={pwdSaving}>
                {pwdSaving ? <><Spinner size={13}/> Saving\u2026</> : <><Lock size={13}/> Update Password</>}
              </button>
            </div>
          </form>
        )}
      </Section>

      {/* ── Edit Profile form ── */}
      {editOpen && (
        <form id="profile-edit-form" onSubmit={handleSave} className={styles.editForm}>
          <div className={styles.editFormHeader}>
            <div className={styles.editFormIcon}><Edit3 size={16} /></div>
            <div>
              <h2 className={styles.editFormTitle}>Edit Profile</h2>
              <p className={styles.editFormSub}>Update your personal information</p>
            </div>
          </div>
          <div className={styles.editGrid}>
            {[
              { key:'full_name', label:'Full Name', icon:User,   type:'text',  required:true  },
              { key:'email',     label:'Email',     icon:Mail,   type:'email', required:true  },
              { key:'phone',     label:'Phone',     icon:Phone,  type:'tel'                   },
              { key:'location',  label:'Location',  icon:MapPin, type:'text'                  },
              { key:'language',  label:'Language',  icon:Globe,  type:'text'                  },
              { key:'timezone',  label:'Timezone',  icon:Globe,  type:'text'                  },
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
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? <><Spinner size={13}/> Saving\u2026</> : <><Save size={13}/> Save Changes</>}
            </button>
          </div>
        </form>
      )}

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        message="This will permanently delete your account and all associated data. This cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        confirmTone="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteAccount}
        onClose={() => { if (!deleteLoading) setDeleteOpen(false) }}
      />
    </div>
  )
}
