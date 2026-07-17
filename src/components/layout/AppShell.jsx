// src/components/layout/AppShell.jsx
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import styles from './AppShell.module.css'

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className={styles.shell} data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed(c => !c)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className={styles.main}>
        <Topbar onToggleSidebarMobile={() => setMobileOpen(o => !o)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}