// src/pages/campaigns/CreateCampaign.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Megaphone, Type, Hash, AlignLeft, Sparkles } from 'lucide-react'
import { campaignsAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './CreateCampaign.module.css'

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
  return 'Failed to create campaign'
}

// Highlight {{variable}} tokens
function TemplatePreview({ text }) {
  if (!text) return <span className={styles.tpEmpty}>Your message preview will appear here…</span>
  const parts = text.split(/(\{\{[^}]+\}\})/g)
  return (
    <span>
      {parts.map((p, i) =>
        /^\{\{/.test(p)
          ? <span key={i} className={styles.tpToken}>{p}</span>
          : <span key={i}>{p}</span>
      )}
    </span>
  )
}

export default function CreateCampaign() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ campaign_name: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await campaignsAPI.create(form)
      toast.success('Campaign created!')
      navigate('/campaigns')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={() => navigate('/campaigns')} type="button">
          <ArrowLeft size={16} />
        </button>
        <div className={styles.headerIcon}><Megaphone size={20}/></div>
        <div>
          <h1 className={styles.pageTitle}>Create Campaign</h1>
          <p className={styles.pageSubtitle}>Set up an outreach campaign for candidates</p>
        </div>
      </div>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.section}>
            <div className={styles.sectionHeader}><Hash size={13}/><span>Campaign Info</span></div>
            <div className={styles.field}>
              <label className={styles.label}>Campaign Name <span className={styles.req}>*</span></label>
              <div className={styles.inputWrap}>
                <Type size={13} className={styles.inputIcon}/>
                <input className={styles.input} required minLength={3} value={form.campaign_name} onChange={set('campaign_name')} placeholder="Summer 2026 Outreach" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Subject <span className={styles.req}>*</span></label>
              <div className={styles.inputWrap}>
                <Hash size={13} className={styles.inputIcon}/>
                <input className={styles.input} required minLength={5} value={form.subject} onChange={set('subject')} placeholder="Exciting opportunity for your profile" />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}><AlignLeft size={13}/><span>Message Template</span></div>
            <div className={styles.field}>
              <label className={styles.label}>
                Message <span className={styles.req}>*</span>
                <span className={styles.labelHint}>Use &#123;&#123;name&#125;&#125;, &#123;&#123;role&#125;&#125; as placeholders</span>
              </label>
              <textarea
                className={styles.textarea}
                rows={7}
                required
                value={form.message}
                onChange={set('message')}
                placeholder="Hello {{name}}, we found your profile interesting for the {{role}} position…"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/campaigns')}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <><Spinner size={13}/> Creating…</> : <><Sparkles size={14}/> Create Campaign</>}
            </button>
          </div>
        </form>

        {/* Preview panel */}
        <aside className={styles.preview}>
          <p className={styles.previewLabel}>Message Preview</p>
          <div className={styles.previewCard}>
            {form.subject && <p className={styles.previewSubject}>{form.subject}</p>}
            <div className={styles.previewBody}>
              <TemplatePreview text={form.message} />
            </div>
          </div>
          <p className={styles.previewHint}><span className={styles.tpToken} style={{padding:'1px 5px'}}>{'{{tokens}}'}</span> highlighted in purple</p>
        </aside>
      </div>
    </div>
  )
}
