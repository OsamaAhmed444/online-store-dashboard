import React from 'react'
import { Bell, LogOut, Menu, Sun } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const { user, logout } = useAuth()
  return (
    <header className="topbar">
      <button className="mobile-menu" type="button" aria-label="Open navigation" onClick={() => document.body.classList.add('nav-open')}><Menu size={22} /></button>
      <div className="topbar-actions"><button className="icon-button notification-button" type="button" aria-label="Notifications"><Bell size={20} /><span /></button><button className="icon-button" type="button" aria-label="Toggle theme"><Sun size={20} /></button><div className="account-chip"><div className="avatar">AA</div><div className="account-copy"><strong>ADMIN ACCOUNT</strong><span>{user?.username || 'Admin'}</span></div><div className="account-checks"><b>✓</b><b>✓</b></div></div><button className="logout-button" type="button" onClick={logout}><LogOut size={18} /><span>Logout</span></button></div>
    </header>
  )
}
