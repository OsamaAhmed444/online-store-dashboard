import React, { useEffect, useState } from 'react'
import { BarChart3, Clock3, DollarSign, ShoppingCart, Sparkles, Users } from 'lucide-react'
import { getOrders, getOrdersAdmin } from '../api/orders'
import { getProducts } from '../api/products'
import { getUsers } from '../api/users'
import StatCard from '../components/dashboard/StatCard'
import OrderStatus from '../components/dashboard/OrderStatus'
import TopProducts from '../components/dashboard/TopProducts'
import RecentOrders from '../components/dashboard/RecentOrders'
import { calculateProductSales, getOrdersFromResponse, getProductsFromResponse, getUsersFromResponse, normalizeOrder, normalizeProduct } from '../components/dashboard/dashboardData'

const emptyDashboard = { orders: [], products: [], users: [], topProducts: [] }

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const mergeOrders = (responses) => {
  const unique = new Map()
  responses.flatMap(getOrdersFromResponse).map(normalizeOrder).forEach((order) => {
    if (order.id) unique.set(order.id, order)
  })
  return [...unique.values()]
}

export default function DashboardHome() {
  const [dashboard, setDashboard] = useState(emptyDashboard)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([getOrders(), getOrdersAdmin(), getProducts(), getUsers()])
      .then(([dashboardResponse, ordersResponse, productsResponse, usersResponse]) => {
        if (!mounted) return
        const orders = mergeOrders([dashboardResponse, ordersResponse])
        const products = productsResponse.data ? getProductsFromResponse(productsResponse).map(normalizeProduct) : []
        setDashboard({ orders, products, users: getUsersFromResponse(usersResponse), topProducts: calculateProductSales(orders, products) })
      })
      .catch((requestError) => { if (mounted) setError(requestError.response?.data?.message || 'Unable to load dashboard data from the API.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const revenue = dashboard.orders.reduce((sum, order) => sum + order.total, 0)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = dashboard.orders.filter((order) => { const date = new Date(order.date); return date.getMonth() === currentMonth && date.getFullYear() === currentYear }).reduce((sum, order) => sum + order.total, 0)
  const topProduct = dashboard.topProducts[0]
  const stats = [
    { title: 'Total Orders', value: dashboard.orders.length, note: 'All orders to date', icon: ShoppingCart, tone: 'orange' }, { title: 'Pending Orders', value: dashboard.orders.filter((order) => order.status === 'pending').length, note: 'Awaiting action', icon: Clock3, tone: 'orange' }, { title: 'Revenue', value: formatCurrency(revenue), note: 'Total gross revenue', icon: DollarSign, tone: 'red' },
    { title: 'This Month', value: formatCurrency(monthlyRevenue), note: 'Monthly sales target', icon: BarChart3, tone: 'blue' }, { title: 'Top Product', value: topProduct?.name || '—', note: topProduct ? `${topProduct.quantity} sold` : 'No sales data', icon: Sparkles, tone: 'purple' }, { title: 'Users', value: dashboard.users.length, note: 'Registered customers', icon: Users, tone: 'slate' },
  ]

  return <div className="dashboard-page"><section className="hero-panel"><div className="hero-copy"><p className="eyebrow">ADMIN OVERVIEW</p><h1>Real-time commerce health</h1><p>Monitor your store performance with real-time data and insights.</p></div><div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" /></section>{loading ? <div className="dashboard-loading">Loading dashboard data from API...</div> : error ? <div className="dashboard-error">{error}</div> : <><section className="stats-grid" aria-label="Store statistics">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</section><div className="dashboard-two-column"><OrderStatus orders={dashboard.orders} /><TopProducts products={dashboard.topProducts} /></div><RecentOrders orders={dashboard.orders} /></>}</div>
}
