import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.logo}>
        <svg viewBox="0 0 32 32" fill="none" width="48" height="48">
          <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
          <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="16" cy="10" r="2" fill="white"/>
          <line x1="11" y1="22" x2="21" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <span className={styles.name}>SaarthiIQ</span>
      </div>
      <div className={styles.spinner} />
    </div>
  )
}
