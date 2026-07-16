import { useEffect, useState } from 'react'
import { Users, FileText, Calendar, TrendingUp, Brain, CheckSquare, Briefcase } from 'lucide-react'
import { dashboardAPI } from '@/lib/api'
import KPICard from '@/components/features/KPICard'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getSummary()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const kpis = [
    { title: 'Total Candidates',  value: stats?.total_candidates,  icon: Users,       color: 'primary' },
    { title: 'Open Positions',    value: stats?.open_positions,    icon: Briefcase,   color: 'info' },
    { title: 'Interviews Today',  value: stats?.interviews_today,  icon: Calendar,    color: 'warning' },
    { title: 'Resumes Parsed',    value: stats?.resumes_parsed,    icon: FileText,    color: 'success' },
    { title: 'AI Reports',        value: stats?.ai_reports,        icon: Brain,       color: 'primary' },
    { title: 'Pending Tasks',     value: stats?.pending_tasks,     icon: CheckSquare, color: 'error' },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Here's what's happening in your pipeline today."
      />

      {loading ? (
        <div className={styles.kpiGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card skeleton" style={{ height: 100 }} />
          ))}
        </div>
      ) : (
        <div className={styles.kpiGrid}>
          {kpis.map(kpi => <KPICard key={kpi.title} {...kpi} />)}
        </div>
      )}

      <div className={styles.grid2}>
        <div className="card">
          <h2 className="section-title">Recent Candidates</h2>
          <p className="text-muted text-sm">Connect candidates module to populate this panel.</p>
        </div>
        <div className="card">
          <h2 className="section-title">Upcoming Interviews</h2>
          <p className="text-muted text-sm">Connect interviews module to populate this panel.</p>
        </div>
      </div>
    </div>
  )
}
