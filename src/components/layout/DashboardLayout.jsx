import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Topbar />
      <main className="dashboard-scroll-area"><Outlet /></main>
    </div>
  )
}
