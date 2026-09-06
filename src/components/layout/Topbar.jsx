import React, { useEffect, useState } from 'react'
import { Bell, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getOrdersFromResponse, normalizeOrder } from '../dashboard/dashboardData'
import { getOrdersAdmin } from '../../api/orders'

export default function Topbar() {
  const { user, logout } = useAuth()
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || user?.name || user?.email || 'Admin'
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'A'
  const role = user?.role ? String(user.role).toUpperCase() : 'ADMIN'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    let active = true
    getOrdersAdmin()
      .then((response) => {
        if (!active) return
        const pending = getOrdersFromResponse(response).map(normalizeOrder).filter((order) => order.status === 'pending').length
        setPendingOrders(pending)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <header className="topbar">
      <button className="mobile-menu" type="button" aria-label="Open navigation" onClick={() => document.body.classList.add('nav-open')}><Menu size={22} /></button>
      <div className="topbar-actions"><div className="notification-wrap"><button className="icon-button notification-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)}><Bell size={20} />{pendingOrders > 0 && <span />}</button>{notificationsOpen && <div className="notification-panel"><div className="notification-heading"><strong>Notifications</strong><button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}><X size={16} /></button></div>{pendingOrders > 0 ? <p>{pendingOrders} pending order{pendingOrders === 1 ? '' : 's'} need attention.</p> : <p>No new notifications.</p>}</div>}</div><button className="icon-button" type="button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button><div className="account-chip"><div className="avatar">{initials}</div><div className="account-copy"><strong>{displayName}</strong><span>{role}</span></div><div className="account-checks"><b>✓</b><b>✓</b></div></div><button className="logout-button" type="button" onClick={logout}><LogOut size={18} /><span>Logout</span></button></div>
    </header>
  )
}
