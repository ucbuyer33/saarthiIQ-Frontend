// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Users, FileText, Calendar, Brain, CheckSquare, Briefcase, ArrowRight } from 'lucide-react'
import { dashboardAPI } from '@/lib/api'
import KPICard from '@/components/features/KPICard'
import { useAuth } from '@/context/AuthContext'
import styles from './Dashboard.module.css'

const KPI_CONFIG = [
  { key: 'total_candidates', title: 'Total Candidates', icon: Users,       color: 'primary' },
  { key: 'open_positions',   title: 'Open Positions',   icon: Briefcase,   color: 'info'    },
  { key: 'interviews_today', title: 'Interviews Today', icon: Calendar,    color: 'warning' },
  { key: 'resumes_parsed',   title: 'Resumes Parsed',   icon: FileText,    color: 'success' },
  { key: 'ai_reports',       title: 'AI Reports',       icon: Brain,       color: 'primary' },
  { key: 'pending_tasks',    title: 'Pending Tasks',    icon: CheckSquare, color: 'error'   },
]

const EMPTY_PANELS = [
  {
    icon: Users,
    title: 'Recent Candidates',
    desc: 'Your latest applicants will appear here once the candidates module is connected.',
    action: 'Go to Candidates',
    href: '/candidates',
  },
  {
    icon: Calendar,
    title: 'Upcoming Interviews',
    desc: 'Scheduled interviews will surface here once the interviews module is connected.',
    action: 'Go to Interviews',
    href: '/interviews',
  },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getSummary()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'there'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroGreeting}>
            {greeting()}, {firstName}
          </h1>
          <p className={styles.heroSub}>{today} &mdash; Here&apos;s your pipeline at a glance.</p>
        </div>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Live
        </div>
      </div>

      {/* ── KPI Grid ── */}
      {loading ? (
        <div className={styles.kpiGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : (
        <div className={styles.kpiGrid}>
          {KPI_CONFIG.map(k => (
            <KPICard
              key={k.key}
              title={k.title}
              value={stats?.[k.key]}
              icon={k.icon}
              color={k.color}
            />
          ))}
        </div>
      )}

      {/* ── Bottom panels ── */}
      <div className={styles.grid2}>
        {EMPTY_PANELS.map(panel => {
          const Icon = panel.icon
          return (
            <div key={panel.title} className={styles.emptyPanel}>
              <div className={styles.emptyIconWrap}>
                <Icon size={16} />
              </div>
              <h2 className={styles.emptyTitle}>{panel.title}</h2>
              <p className={styles.emptyDesc}>{panel.desc}</p>
              <button
                className={styles.emptyAction}
                onClick={() => window.location.href = panel.href}
              >
                {panel.action} <ArrowRight size={12} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
