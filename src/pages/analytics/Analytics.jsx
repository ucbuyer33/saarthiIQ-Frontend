// src/pages/analytics/Analytics.jsx
import { useEffect, useState } from 'react'
import { BarChart2, Users, CalendarClock, CheckSquare, Megaphone, UserCheck, TrendingUp } from 'lucide-react'
import { dashboardAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import styles from './Analytics.module.css'

const STAT_ICONS = {
  total_candidates: Users,
  total_users: UserCheck,
  total_interviews: CalendarClock,
  total_tasks: CheckSquare,
  total_campaigns: Megaphone,
}

const STAT_GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#4f46e5)',
  'linear-gradient(135deg,#0891b2,#0e7490)',
  'linear-gradient(135deg,#16a34a,#15803d)',
  'linear-gradient(135deg,#d97706,#b45309)',
  'linear-gradient(135deg,#7c3aed,#6d28d9)',
]

const STATUS_COLORS = {
  applied:      { color:'#6366f1', bg:'rgba(99,102,241,0.12)' },
  interviewing: { color:'#d97706', bg:'rgba(217,119,6,0.12)'  },
  shortlisted:  { color:'#0891b2', bg:'rgba(8,145,178,0.12)'  },
  rejected:     { color:'#dc2626', bg:'rgba(220,38,38,0.12)'  },
  offered:      { color:'#16a34a', bg:'rgba(22,163,74,0.12)'  },
}

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Analytics() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getAnalytics()
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={styles.loadingWrap}><Spinner size={28} /></div>

  // Split numeric stats from nested objects
  const statEntries    = data ? Object.entries(data).filter(([, v]) => typeof v === 'number') : []
  const breakdownEntries = data ? Object.entries(data).filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v)) : []

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}><BarChart2 size={20}/></div>
        <div>
          <h1 className={styles.pageTitle}>Analytics</h1>
          <p className={styles.pageSubtitle}>Hiring pipeline trends and performance metrics</p>
        </div>
      </div>

      {!data ? (
        <div className={styles.emptyMsg}>No analytics data available yet.</div>
      ) : (
        <>
          {/* Stat cards */}
          {statEntries.length > 0 && (
            <div className={styles.statGrid}>
              {statEntries.map(([key, value], i) => {
                const Icon = STAT_ICONS[key] || TrendingUp
                const gradient = STAT_GRADIENTS[i % STAT_GRADIENTS.length]
                return (
                  <div key={key} className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: gradient }}><Icon size={16}/></div>
                    <div>
                      <p className={styles.statLabel}>{formatLabel(key)}</p>
                      <p className={styles.statValue}>{value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Breakdown sections */}
          {breakdownEntries.map(([key, obj]) => (
            <div key={key} className={styles.breakdown}>
              <div className={styles.breakdownHeader}>
                <TrendingUp size={14}/>
                <span>{formatLabel(key)}</span>
              </div>
              <div className={styles.breakdownRows}>
                {Object.entries(obj).map(([k, v]) => {
                  const cfg = STATUS_COLORS[k.toLowerCase()] || { color:'var(--color-text-muted)', bg:'var(--color-surface-offset)' }
                  const total = Object.values(obj).reduce((a, b) => a + Number(b), 0)
                  const pct   = total > 0 ? Math.round((Number(v) / total) * 100) : 0
                  return (
                    <div key={k} className={styles.breakdownRow}>
                      <span className={styles.breakdownKey} style={{ color: cfg.color }}>{formatLabel(k)}</span>
                      <div className={styles.breakdownBarWrap}>
                        <div className={styles.breakdownBar} style={{ width: `${pct}%`, background: cfg.color }} />
                      </div>
                      <span className={styles.breakdownVal}>{v}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
