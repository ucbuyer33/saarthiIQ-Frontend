// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, TrendingUp, Brain,
  Calendar, Megaphone, CheckSquare, BarChart2,
  UserCog, Shield, Settings,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { NAV_ITEMS } from '@/lib/constants'
import styles from './Sidebar.module.css'

const ICONS = {
  LayoutDashboard, Users, FileText, TrendingUp, Brain,
  Calendar, Megaphone, CheckSquare, BarChart2,
  UserCog, Shield, Settings,
}

const SECTION_ORDER = ['Main', 'Recruitment', 'Tools', 'Admin']

function groupItems(items) {
  const groups = {}
  items.forEach(item => {
    const sec = item.section || 'Main'
    if (!groups[sec]) groups[sec] = []
    groups[sec].push(item)
  })
  return SECTION_ORDER.filter(s => groups[s]).map(s => ({ label: s, items: groups[s] }))
}

export default function Sidebar({ collapsed, mobileOpen, onCollapse, onCloseMobile }) {
  const { role } = useAuth()
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role))
  const groups = groupItems(visibleItems)

  // Only close mobile sidebar when a nav link is actually clicked
  const handleNavClick = () => {
    if (window.innerWidth <= 768) onCloseMobile?.()
  }

  return (
    <aside
      className={styles.sidebar}
      data-collapsed={collapsed}
      data-mobile-open={mobileOpen}
      aria-label="Sidebar navigation"
    >
      {/* NO onClick on <aside> — overlay in AppShell handles outside-tap */}
      <div className={styles.inner}>

        {/* Brand */}
        <button
          className={styles.logo}
          onClick={() => window.innerWidth > 768 && onCollapse?.()}
          aria-label="Toggle sidebar"
        >
          <div className={styles.logoIconWrap}>
            <svg viewBox="0 0 32 32" fill="none" width="18" height="18">
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="10" r="2" fill="white" />
              <line x1="11" y1="22" x2="21" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          {!collapsed && (
            <div className={styles.logoMeta}>
              <span className={styles.logoText}>SaarthiIQ</span>
              <span className={styles.logoBadge}>AI Platform</span>
            </div>
          )}
        </button>

        {/* Nav */}
        <nav className={styles.nav}>
          {groups.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <p className={styles.navSection}>{group.label}</p>
              )}
              {group.items.map(item => {
                const Icon = ICONS[item.icon]
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.active : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    {Icon && <Icon size={16} />}
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <button
          className={styles.collapseBtn}
          onClick={onCollapse}
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <PanelLeftOpen size={15} />
            : <><PanelLeftClose size={15} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
