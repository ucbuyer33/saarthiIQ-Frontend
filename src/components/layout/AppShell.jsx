import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import styles from './AppShell.module.css'

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={styles.shell} data-collapsed={collapsed}>
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(c => !c)} />
      <div className={styles.main}>
        <Topbar collapsed={collapsed} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
