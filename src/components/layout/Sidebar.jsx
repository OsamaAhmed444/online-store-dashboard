import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Activity, Box, FileText, Home, Plus, Settings, ShoppingCart, Users, X } from 'lucide-react'

const navigation = [
  { label: 'Dashboard', icon: Home, to: '/dashboard' }, { label: 'Users', icon: Users, to: '/dashboard/users' },
  { label: 'Products', icon: Box, to: '/dashboard/products' }, { label: 'Add Product', icon: Plus, to: '/dashboard/products/add' },
  { label: 'Orders', icon: FileText, to: '/dashboard/orders' }, { label: 'Carts', icon: ShoppingCart, to: '/dashboard/carts' }, { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div><p className="brand-kicker">ECOMMERCE</p><p className="brand-name">Nexora</p><p className="brand-description">E-Commerce Admin Panel</p></div>
        <button className="mobile-close" onClick={() => document.body.classList.remove('nav-open')} aria-label="Close navigation"><X size={19} /></button>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon, to }) => <NavLink className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} key={label} to={to} end onClick={() => document.body.classList.remove('nav-open')}><Icon size={21} strokeWidth={1.9} /><span>{label}</span></NavLink>)}
      </nav>
      <div className="api-status-card"><span className="status-pulse"><Activity size={14} /></span><div><strong>LIVE API</strong><span>Connected &amp; syncing</span></div><i aria-hidden="true" /></div>
    </aside>
  )
}
