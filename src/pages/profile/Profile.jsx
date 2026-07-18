// src/pages/profile/Profile.jsx
import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  User, Mail, Phone, MapPin, Calendar, CheckSquare,
  CalendarClock, Megaphone, Users, Activity, Settings,
  Shield, Edit3, Save, Globe, Bell, Palette, AtSign,
  ChevronRight, ChevronDown, ChevronUp, Lock, Monitor, LogOut, Trash2, Eye, EyeOff,
  Laptop, Smartphone, Check, X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { usersAPI, auditAPI, sessionsAPI } from '@/lib/api'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import styles from './Profile.module.css'

// ─── Password strength ────────────────────────────────────────────────────────
const PW_RULES = [
  { key: 'len', label: 'At least 8 characters', test: p => p.length >= 8 },
  { key: 'upper', label: 'Contains uppercase letter', test: p => /[A-Z]/.test(p) },
  { key: 'lower', label: 'Contains lowercase letter', test: p => /[a-z]/.test(p) },
  { key: 'number', label: 'Contains a number', test: p => /[0-9]/.test(p) },
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
  return PW_RULES.filter(r => r.test(pw)).length - 1
}
function allRulesPassed(pw) {
  return pw && PW_RULES.every(r => r.test(pw))
}

// ─── Stat meta ────────────────────────────────────────────────────────────────
const STAT_META = {
  Email: { icon: Mail, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  Phone: { icon: Phone, gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  Location: { icon: MapPin, gradient: 'linear-gradient(135deg,#16a34a,#15803d)' },
  Joined: { icon: Calendar, gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Candidates Created': { icon: Users, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'Interviews Scheduled': { icon: CalendarClock, gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  'Campaigns Created': { icon: Megaphone, gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Tasks Completed': { icon: CheckSquare, gradient: 'linear-gradient(135deg,#16a34a,#15803d)' },
  'Last Activity': { icon: Activity, gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
  'Assigned Role': { icon: Shield, gradient: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
  'Permission Scope': { icon: Shield, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'Admin Privileges': { icon: Shield, gradient: 'linear-gradient(135deg,#d97706,#b45309)' },
  'Users Managed': { icon: Users, gradient: 'linear-gradient(135deg,#0891b2,#0e7490)' },
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

// ─── Simple password input ─────────────────────────────────────────────────────────
function PwdInput({ label, name, value, onChange, required, placeholder, onFocus, onBlur }) {
  const [show, setShow] = useState(false)
  return (
    <div className={styles.editField}>
      <label className={styles.editLabel}>
        {label}{required && <span className={styles.req}> *</span>}
      </label>
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
          onFocus={onFocus}
          onBlur={onBlur}
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
        {ts
          ? new Date(ts).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          : '\u2014'}
      </span>
    </div>
  )
}

// ─── Session row ──────────────────────────────────────────────────────────────
function SessionRow({ session, onRevoke, revoking }) {
  const isMobile = /mobile|android|iphone|ipad/i.test(session.user_agent || '')
  const DeviceIcon = isMobile ? Smartphone : Laptop
  const ts = session.created_at || session.last_active
  const isCurrent = session.is_current
  return (
    <div className={`${styles.sessionRow} ${isCurrent ? styles.sessionRowCurrent : ''}`}>
      <div className={styles.sessionLeft}>
        <div className={styles.sessionDeviceIcon}><DeviceIcon size={16} /></div>
        <div>
          <p className={styles.sessionDevice}>
            {session.device_name || (isMobile ? 'Mobile Device' : 'Desktop Browser')}
            {isCurrent && <span className={styles.sessionCurrentBadge}>Current</span>}
          </p>
          <p className={styles.sessionMeta}>
            {session.ip_address && <span>{session.ip_address}</span>}
            {session.location && <span> &middot; {session.location}</span>}
            {ts && <span> &middot; {new Date(ts).toLocaleDateString()}</span>}
          </p>
          {session.user_agent && (
            <p className={styles.sessionUA}>
              {session.user_agent.slice(0, 80)}{session.user_agent.length > 80 ? '\u2026' : ''}
            </p>
          )}
        </div>
      </div>
      {!isCurrent && (
        <button
          type="button"
          className={styles.sessionRevokeBtn}
          onClick={() => onRevoke(session.id)}
          disabled={revoking === session.id}
          title="Revoke session"
        >
          {revoking === session.id ? <Spinner size={12} /> : <X size={14} />}
        </button>
      )}
    </div>
  )
}

// ─── Sessions panel ───────────────────────────────────────────────────────────
function SessionsPanel() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await sessionsAPI.getAll()
      setSessions(res.data?.data || res.data || [])
    } catch { setSessions([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleRevoke = async (id) => {
    setRevoking(id)
    try {
      await sessionsAPI.revoke(id)
      toast.success('Session revoked')
      setSessions(s => s.filter(x => x.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to revoke session')
    } finally { setRevoking(null) }
  }

  const handleRevokeAll = async () => {
    try {
      await sessionsAPI.revokeAll()
      toast.success('Logged out from all devices')
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to logout everywhere')
    }
  }

  return (
    <div className={styles.sessionsPanel}>
      <div className={styles.sessionsPanelHeader}>
        <p className={styles.sessionsPanelTitle}><Monitor size={13} /> Active Sessions</p>
        <button type="button" className={styles.revokeAllBtn} onClick={handleRevokeAll}>
          <LogOut size={12} /> Logout All
        </button>
      </div>
      {loading ? (
        <div className={styles.sessionsLoading}><Spinner size={16} /></div>
      ) : sessions.length === 0 ? (
        <div className={styles.sessionsEmpty}>
          <Monitor size={20} className={styles.sessionsEmptyIcon} />
          <p>No active sessions found.</p>
          <p className={styles.sessionsEmptyNote}>Session data may not be available on this server.</p>
        </div>
      ) : (
        <div className={styles.sessionsList}>
          {sessions.map((s, i) => (
            <SessionRow key={s.id || i} session={s} onRevoke={handleRevoke} revoking={revoking} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser, role, logout } = useAuth()

  const [form, setForm] = useState({ full_name: '', email: '', phone: '', location: '', timezone: '', language: '', theme: '', email_preferences: '' })
  const [saving, setSaving] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [pwdOpen, setPwdOpen] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [pwdSaving, setPwdSaving] = useState(false)
  // Controls visibility of requirements panel:
  // shown when new_password has content AND (field is focused OR not all rules passed yet)
  const [newPwdFocused, setNewPwdFocused] = useState(false)

  const [sessionsOpen, setSessionsOpen] = useState(false)

  const [logoutLoading, setLogoutLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [activity, setActivity] = useState([])
  const [actLoading, setActLoading] = useState(false)

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

  const loadActivity = useCallback(async () => {
    setActLoading(true)
    try {
      const res = await auditAPI.getAll({ limit: 10 })
      setActivity(res.data?.results || res.data || [])
    } catch { setActivity([]) }
    finally { setActLoading(false) }
  }, [])

  useEffect(() => { loadActivity() }, [loadActivity])

  const stats = useMemo(() => {
    const shared = [
      { label: 'Email', value: user?.email },
      { label: 'Phone', value: user?.phone },
      { label: 'Location', value: user?.location },
      { label: 'Joined', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '\u2014' },
    ]
    const recruiter = [
      { label: 'Candidates Created', value: user?.candidates_created },
      { label: 'Interviews Scheduled', value: user?.interviews_scheduled },
      { label: 'Campaigns Created', value: user?.campaigns_created },
      { label: 'Tasks Completed', value: user?.tasks_completed },
      { label: 'Last Activity', value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '\u2014' },
    ]
    const admin = [
      { label: 'Assigned Role', value: role || user?.role },
      { label: 'Permission Scope', value: user?.permission_scope },
      { label: 'Admin Privileges', value: user?.admin_privileges },
      { label: 'Users Managed', value: user?.users_managed },
      { label: 'Last Activity', value: user?.last_activity ? new Date(user.last_activity).toLocaleString() : '\u2014' },
    ]
    return { shared, recruiter, admin }
  }, [user, role])

  const isAdmin = role === 'admin'

  const handleChange = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
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
    if (pwdForm.new_password !== pwdForm.confirm_password) { toast.error('Passwords do not match'); return }
    if (getStrength(pwdForm.new_password) < 1) { toast.error('Password is too weak.'); return }
    setPwdSaving(true)
    try {
      await usersAPI.changePassword({ current_password: pwdForm.current_password, new_password: pwdForm.new_password })
      toast.success('Password changed successfully')
      setPwdOpen(false)
      setPwdForm({ current_password: '', new_password: '', confirm_password: '' })
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

  const togglePwd = () => {
    const opening = !pwdOpen
    setPwdOpen(opening)
    setSessionsOpen(false)
    if (!opening) {
      setPwdForm({ current_password: '', new_password: '', confirm_password: '' })
      setNewPwdFocused(false)
    }
  }
  const toggleSessions = () => {
    setSessionsOpen(o => !o)
    setPwdOpen(false)
  }

  // Derived strength state
  const strengthIdx = getStrength(pwdForm.new_password)
  const sm = strengthIdx >= 0 ? STRENGTH_META[strengthIdx] : null

  // Requirements panel: show when field has content AND (focused OR not all passed)
  const showRequirements = !!pwdForm.new_password && (newPwdFocused || !allRulesPassed(pwdForm.new_password))

  return (
    <div className={styles.page}>

      {/* Hero */}
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

      {/* Stats */}
      <div className={styles.statGrid}>
        {[...stats.shared, ...(isAdmin ? stats.admin : stats.recruiter)].map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Activity */}
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

      {/* Security */}
      <Section title="Security & Account" icon={Shield}>

        {/* ── Change Password row */}
        <button
          type="button"
          className={`${styles.securityRow} ${pwdOpen ? styles.securityRowActive : ''}`}
          onClick={togglePwd}
        >
          <div className={styles.securityLeft}>
            <Lock size={15} className={styles.securityIcon} />
            <div>
              <p className={styles.securityLabel}>Change Password</p>
              <p className={styles.securitySub}>Update your login password</p>
            </div>
          </div>
          {pwdOpen ? <ChevronUp size={15} className={styles.securityChevron} /> : <ChevronDown size={15} className={styles.securityChevron} />}
        </button>

        {/* ── Change-password form — slides in/out between the two rows */}
        <div className={`${styles.pwdFormWrap} ${pwdOpen ? styles.pwdFormWrapOpen : ''}`}>
          <form onSubmit={handleChangePassword} className={styles.pwdForm}>

            {/* LEFT — 3 stacked inputs */}
            <div className={styles.pwdLeft}>
              <PwdInput
                label="Current Password"
                name="current_password"
                value={pwdForm.current_password}
                onChange={handlePwdChange}
                required
              />

              {/* New Password + strength bar below it */}
              <div>
                <PwdInput
                  label="New Password"
                  name="new_password"
                  value={pwdForm.new_password}
                  onChange={handlePwdChange}
                  required
                  placeholder="Min 8 characters"
                  onFocus={() => setNewPwdFocused(true)}
                  onBlur={() => setNewPwdFocused(false)}
                />
                {/* Strength bar — only shown when there is a value */}
                {pwdForm.new_password && (
                  <>
                    <div className={styles.strengthBarTrack} style={{ marginTop: 6 }}>
                      <div
                        className={styles.strengthBarFill}
                        style={{ width: sm ? sm.pct : '0%', background: sm ? sm.color : '#ef4444' }}
                      />
                    </div>
                    {sm && (
                      <p className={styles.strengthText} style={{ marginTop: 4 }}>
                        Password strength: <strong style={{ color: sm.color }}>{sm.label}</strong>
                      </p>
                    )}
                  </>
                )}
              </div>

              <PwdInput
                label="Confirm Password"
                name="confirm_password"
                value={pwdForm.confirm_password}
                onChange={handlePwdChange}
                required
                placeholder="Repeat new password"
              />
            </div>

            {/* RIGHT — requirements panel, smart show/hide */}
            <div className={`${styles.pwdRight} ${showRequirements ? styles.pwdRightVisible : ''}`}>
              <p className={styles.pwdRightTitle}>Password requirements</p>
              <ul className={styles.pwRuleList}>
                {PW_RULES.map(rule => {
                  const passed = pwdForm.new_password && rule.test(pwdForm.new_password)
                  return (
                    <li key={rule.key} className={`${styles.pwRule} ${passed ? styles.pwRulePassed : ''}`}>
                      <span className={styles.pwRuleIcon}><Check size={10} strokeWidth={3} /></span>
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* ACTIONS */}
            <div className={styles.pwdActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => { setPwdOpen(false); setPwdForm({ current_password: '', new_password: '', confirm_password: '' }); setNewPwdFocused(false) }}>Cancel</button>
              <button type="submit" className={styles.saveBtn} disabled={pwdSaving}>
                {pwdSaving ? <><Spinner size={13} /> Saving\u2026</> : <><Lock size={13} /> Update Password</>}
              </button>
            </div>
          </form>
        </div>

        {/* ── Active Sessions row */}
        <button
          type="button"
          className={`${styles.securityRow} ${sessionsOpen ? styles.securityRowActive : ''}`}
          onClick={toggleSessions}
        >
          <div className={styles.securityLeft}>
            <Monitor size={15} className={styles.securityIcon} />
            <div>
              <p className={styles.securityLabel}>Active Sessions</p>
              <p className={styles.securitySub}>Manage where you are logged in</p>
            </div>
          </div>
          <ChevronRight size={15} className={`${styles.securityChevron} ${sessionsOpen ? styles.securityChevronOpen : ''}`} />
        </button>

        {/* Sessions panel */}
        {sessionsOpen && <SessionsPanel />}

        {/* ── Logout Everywhere row */}
        <button
          type="button"
          className={styles.securityRow}
          onClick={handleLogoutEverywhere}
          disabled={logoutLoading}
        >
          <div className={styles.securityLeft}>
            <LogOut size={15} className={styles.securityIcon} />
            <div>
              <p className={styles.securityLabel}>Logout Everywhere</p>
              <p className={styles.securitySub}>Sign out from all devices</p>
            </div>
          </div>
          {logoutLoading ? <Spinner size={14} /> : <ChevronRight size={15} className={styles.securityChevron} />}
        </button>

        {/* ── Delete Account row */}
        <button
          type="button"
          className={`${styles.securityRow} ${styles.securityRowDanger}`}
          onClick={() => setDeleteOpen(true)}
        >
          <div className={styles.securityLeft}>
            <Trash2 size={15} className={styles.securityIcon} />
            <div>
              <p className={styles.securityLabel}>Delete Account</p>
              <p className={styles.securitySub}>Permanently remove your account</p>
            </div>
          </div>
          <ChevronRight size={15} className={styles.securityChevron} />
        </button>

      </Section>

      {/* Edit Profile form */}
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
              { key: 'full_name', label: 'Full Name', icon: User, type: 'text', required: true },
              { key: 'email', label: 'Email', icon: Mail, type: 'email', required: true },
              { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
              { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
              { key: 'language', label: 'Language', icon: Globe, type: 'text' },
              { key: 'timezone', label: 'Timezone', icon: Globe, type: 'text' },
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
              {saving ? <><Spinner size={13} /> Saving\u2026</> : <><Save size={13} /> Save Changes</>}
            </button>
          </div>
        </form>
      )}

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
