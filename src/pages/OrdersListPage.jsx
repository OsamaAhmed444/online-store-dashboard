import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ClipboardList, Clock3, Search, Truck } from 'lucide-react'
import { getOrdersAdmin } from '../api/orders'
import { getProducts } from '../api/products'
import { OrdersTable } from '../components/orders/OrdersTable'
import { filterTeamOrders, getOrdersFromResponse, getProductsFromResponse, normalizeOrder } from '../components/dashboard/dashboardData'

const PAGE_SIZE = 8
const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')

export function OrdersListPage() {
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const [ordersResponse, productsResponse] = await Promise.all([getOrdersAdmin(), getProducts()])
      const rawProducts = getProductsFromResponse(productsResponse)
      const teamOrders = filterTeamOrders(getOrdersFromResponse(ordersResponse), rawProducts)
        .map(normalizeOrder)
        .filter((order) => order.id)
      setOrders(teamOrders)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load orders.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [query, statusFilter, dateFrom, dateTo])

  const filteredOrders = useMemo(() => orders.filter((order) => {
    if (query) {
      const searchable = `${order.customer} ${order.id}`.toLowerCase()
      if (!searchable.includes(query.trim().toLowerCase())) return false
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (dateFrom && new Date(order.date) < new Date(dateFrom)) return false
    if (dateTo && new Date(order.date) > new Date(`${dateTo}T23:59:59`)) return false
    return true
  }), [orders, query, statusFilter, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ClipboardList, tone: '#f47716' },
    { label: 'Pending', value: orders.filter((order) => order.status === 'pending').length, icon: Clock3, tone: '#e0a01e' },
    { label: 'Shipped', value: orders.filter((order) => order.status === 'shipped').length, icon: Truck, tone: '#8f30f3' },
    { label: 'Delivered', value: orders.filter((order) => order.status === 'delivered').length, icon: CheckCircle2, tone: '#20c96b' },
  ]

  const resetFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const hasFilters = query || statusFilter !== 'all' || dateFrom || dateTo

  return (
    <div className="orders-page">
      <section className="orders-header">
        <div>
          <p className="eyebrow">ORDER MANAGEMENT</p>
          <h1>Manage Orders</h1>
        </div>
      </section>

      {loading ? (
        <div className="orders-state">Loading orders...</div>
      ) : error ? (
        <div className="orders-state orders-error">
          <p>{error}</p>
          <button type="button" onClick={fetchOrders}>Try Again</button>
        </div>
      ) : (
        <>
          <section className="order-stats-grid" aria-label="Order statistics">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <article className="order-stat-card" key={label}>
                <span style={{ background: tone }}><Icon size={22} /></span>
                <div>
                  <p>{label}</p>
                  <strong>{value}</strong>
                </div>
              </article>
            ))}
          </section>

          <section className="orders-filters-panel">
            <label className="orders-search">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by customer or order ID..."
                aria-label="Search orders"
              />
            </label>

            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              From
              <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            </label>

            <label>
              To
              <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
            </label>

            {hasFilters && (
              <button type="button" className="orders-filters-reset" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </section>

          {visibleOrders.length ? (
            <>
              <OrdersTable orders={visibleOrders} />
              <div className="orders-pagination">
                <span>Page {page} of {totalPages}</span>
                <div>
                  <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
                  <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</button>
                </div>
              </div>
            </>
          ) : (
            <div className="orders-state orders-empty">
              {hasFilters ? 'No orders match your search or filters.' : 'No orders found for this team yet.'}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OrdersListPage
