// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, TrendingUp, Brain,
  Calendar, Megaphone, CheckSquare, BarChart2,
  UserCog, Shield, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { NAV_ITEMS } from '@/lib/constants'
import styles from './Sidebar.module.css'

const ICONS = {
  LayoutDashboard, Users, FileText, TrendingUp, Brain,
  Calendar, Megaphone, CheckSquare, BarChart2,
  UserCog, Shield, Settings,
}

export default function Sidebar({ collapsed, mobileOpen, onCollapse, onCloseMobile }) {
  const { role } = useAuth()
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role))

  const handleLogoClick = () => {
    if (window.innerWidth > 768) onCollapse?.()
  }

  const handleNavClick = () => {
    if (window.innerWidth <= 768) onCloseMobile?.()
  }

  return (
    <aside
      className={styles.sidebar}
      data-collapsed={collapsed}
      data-mobile-open={mobileOpen}
      onClick={onCloseMobile}
    >
      <div className={styles.inner} onClick={e => e.stopPropagation()}>
        <button className={styles.logo} onClick={handleLogoClick} aria-label="Toggle sidebar">
          <svg viewBox="0 0 32 32" fill="none" className={styles.logoIcon}>
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="10" r="2" fill="white" />
            <line x1="11" y1="22" x2="21" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          {!collapsed && <span className={styles.logoText}>SaarthiIQ</span>}
        </button>

        <nav className={styles.nav}>
          {visibleItems.map(item => {
            const Icon = ICONS[item.icon]
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {Icon && <Icon size={18} />}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <button className={styles.collapseBtn} onClick={onCollapse} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  )
}