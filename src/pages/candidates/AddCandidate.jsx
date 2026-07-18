// src/pages/candidates/AddCandidate.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Tag, CheckCircle2 } from 'lucide-react'
import { candidatesAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { CANDIDATE_STATUSES } from '@/lib/constants'
import styles from './AddCandidate.module.css'

const BLANK = { full_name: '', email: '', phone: '', location: '', experience: '', status: 'applied', skills: '' }

const AVATAR_COLORS = [
  ['#6366f1','#4f46e5'], ['#0891b2','#0e7490'], ['#16a34a','#15803d'],
  ['#d97706','#b45309'], ['#dc2626','#b91c1c'], ['#7c3aed','#6d28d9'],
]
function avatarGradient(name = '') {
  if (!name) return 'linear-gradient(135deg, #374151, #1f2937)'
  const i = name.charCodeAt(0) % AVATAR_COLORS.length
  return `linear-gradient(135deg, ${AVATAR_COLORS[i][0]}, ${AVATAR_COLORS[i][1]})`
}
function getInitials(name = '') {
  return name.trim()
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'
}

const STATUS_CONFIG = {
  applied:      { label: 'Applied',      color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  shortlisted:  { label: 'Shortlisted',  color: '#0891b2', bg: 'rgba(8,145,178,0.1)'   },
  interviewing: { label: 'Interviewing', color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  offered:      { label: 'Offered',      color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  rejected:     { label: 'Rejected',     color: '#dc2626', bg: 'rgba(220,38,38,0.1)'   },
}

export default function AddCandidate() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isEdit    = !!id
  const [form, setForm]         = useState(BLANK)
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    candidatesAPI.getById(id)
      .then(res => {
        const c = res.data
        setForm({ ...c, skills: (c.skills || []).join(', ') })
      })
      .catch(() => toast.error('Failed to load candidate'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      if (isEdit) {
        await candidatesAPI.update(id, payload)
        toast.success('Candidate updated')
        navigate(`/candidates/${id}`)
      } else {
        const res = await candidatesAPI.create(payload)
        toast.success('Candidate added!')
        navigate(`/candidates/${res.data.id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally { setLoading(false) }
  }

  // Live skill chips from the input
  const skillChips = form.skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const statusCfg = STATUS_CONFIG[form.status] || STATUS_CONFIG.applied

  if (fetching) return (
    <div className={styles.loadingWrap}><Spinner size={28} /></div>
  )

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={() => navigate('/candidates')}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className={styles.pageTitle}>{isEdit ? 'Edit Candidate' : 'Add Candidate'}</h1>
          <p className={styles.pageSubtitle}>
            {isEdit ? 'Update candidate information' : 'Fill in the details to add a new candidate to your pipeline'}
          </p>
        </div>
      </div>

      <div className={styles.layout}>

        {/* ── LEFT — form ── */}
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Section: Basic Info */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={14} />
              <span>Basic Information</span>
            </div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                <div className={styles.inputWrap}>
                  <User size={13} className={styles.inputIcon} />
                  <input
                    className={styles.input}
                    required
                    value={form.full_name}
                    onChange={set('full_name')}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                <div className={styles.inputWrap}>
                  <Mail size={13} className={styles.inputIcon} />
                  <input
                    className={styles.input}
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="john@email.com"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <div className={styles.inputWrap}>
                  <Phone size={13} className={styles.inputIcon} />
                  <input
                    className={styles.input}
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <div className={styles.inputWrap}>
                  <MapPin size={13} className={styles.inputIcon} />
                  <input
                    className={styles.input}
                    value={form.location}
                    onChange={set('location')}
                    placeholder="Mumbai, MH"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Role */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Briefcase size={14} />
              <span>Role &amp; Status</span>
            </div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Experience</label>
                <div className={styles.inputWrap}>
                  <Briefcase size={13} className={styles.inputIcon} />
                  <input
                    className={styles.input}
                    value={form.experience}
                    onChange={set('experience')}
                    placeholder="3 years"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} value={form.status} onChange={set('status')}>
                  {CANDIDATE_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Skills */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Tag size={14} />
              <span>Skills</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Skills
                <span className={styles.labelHint}>comma-separated</span>
              </label>
              <div className={styles.inputWrap}>
                <Tag size={13} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  value={form.skills}
                  onChange={set('skills')}
                  placeholder="React, Node.js, Python, TypeScript"
                />
              </div>
              {/* Live skill chips */}
              {skillChips.length > 0 && (
                <div className={styles.skillChips}>
                  {skillChips.map(s => (
                    <span key={s} className={styles.skillChip}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/candidates')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading
                ? <><Spinner size={13} /> Saving…</>
                : <><CheckCircle2 size={14} /> {isEdit ? 'Save Changes' : 'Add Candidate'}</>
              }
            </button>
          </div>
        </form>

        {/* ── RIGHT — live preview card ── */}
        <aside className={styles.preview}>
          <p className={styles.previewLabel}>Live Preview</p>

          <div className={styles.previewCard}>
            {/* Avatar + name */}
            <div className={styles.previewTop}>
              <div
                className={styles.previewAvatar}
                style={{ background: avatarGradient(form.full_name) }}
              >
                {getInitials(form.full_name)}
              </div>
              <div className={styles.previewNameWrap}>
                <span className={styles.previewName}>
                  {form.full_name || <span className={styles.previewPlaceholder}>Full Name</span>}
                </span>
                <span className={styles.previewEmail}>
                  {form.email || <span className={styles.previewPlaceholder}>email@domain.com</span>}
                </span>
              </div>
              <span
                className={styles.previewBadge}
                style={{ color: statusCfg.color, background: statusCfg.bg }}
              >
                {statusCfg.label}
              </span>
            </div>

            {/* Meta */}
            <div className={styles.previewMeta}>
              {form.location && (
                <span className={styles.previewMetaItem}><MapPin size={11} />{form.location}</span>
              )}
              {form.experience && (
                <span className={styles.previewMetaItem}><Briefcase size={11} />{form.experience}</span>
              )}
              {form.phone && (
                <span className={styles.previewMetaItem}><Phone size={11} />{form.phone}</span>
              )}
            </div>

            {/* Skills */}
            {skillChips.length > 0 && (
              <div className={styles.previewSkills}>
                {skillChips.slice(0, 6).map(s => (
                  <span key={s} className={styles.previewSkill}>{s}</span>
                ))}
              </div>
            )}
          </div>

          <p className={styles.previewHint}>Updates as you type</p>
        </aside>
      </div>
    </div>
  )
}
