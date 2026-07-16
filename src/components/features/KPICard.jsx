import styles from './KPICard.module.css'

export default function KPICard({ title, value, icon: Icon, color = 'primary', trend, trendLabel }) {
  const colorMap = {
    primary: { bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
    success: { bg: 'var(--color-success-light)', fg: 'var(--color-success)' },
    warning: { bg: 'var(--color-warning-light)', fg: 'var(--color-warning)' },
    error:   { bg: 'var(--color-error-light)',   fg: 'var(--color-error)' },
    info:    { bg: 'var(--color-info-light)',     fg: 'var(--color-info)' },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <div className={`card ${styles.kpi}`}>
      <div className={styles.top}>
        <div>
          <p className={styles.label}>{title}</p>
          <p className={styles.value}>{value ?? '—'}</p>
        </div>
        {Icon && (
          <div className={styles.iconBox} style={{ background: c.bg, color: c.fg }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <p className={styles.trend} style={{ color: trend >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'vs last month'}
        </p>
      )}
    </div>
  )
}
