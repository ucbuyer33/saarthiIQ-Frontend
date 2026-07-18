// src/components/layout/AppShell.jsx
import { useEffect, useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import styles from './AppShell.module.css'

export default function AppShell() {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close sidebar on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen(o => !o), [])
  const toggleCollapsed = useCallback(() => setCollapsed(c => !c), [])

  return (
    <div
      className={styles.shell}
      data-collapsed={collapsed}
      data-mobile-open={mobileOpen}
    >
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={toggleCollapsed}
        onCloseMobile={closeMobile}
      />

      {/* Mobile overlay — clicking it closes sidebar */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div className={styles.main}>
        <Topbar onToggleSidebarMobile={toggleMobile} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
