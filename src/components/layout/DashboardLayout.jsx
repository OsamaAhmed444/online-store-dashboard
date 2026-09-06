import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  const location = useLocation()
  return (
    <div className="app-shell">
      <Sidebar />
      <Topbar />
      <main className="dashboard-scroll-area">
        <div className="route-transition" key={location.pathname}><Outlet /></div>
      </main>
    </div>
  )
}
