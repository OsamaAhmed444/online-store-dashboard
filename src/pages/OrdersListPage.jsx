import React, { useState, useEffect } from 'react'
import { Spinner } from '../components/common/Spinner'
import { EmptyState } from '../components/common/EmptyState'
import { Pagination } from '../components/common/Pagination'
import { OrdersTable } from '../components/orders/OrdersTable'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered']

export function OrdersListPage() {
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [orders, setOrders] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    setPage(1)
    fetchOrders()
  }, [statusFilter, dateFrom, dateTo])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (dateFrom) params.append('from', dateFrom)
      if (dateTo) params.append('to', dateTo)
      params.append('page', String(page))
      params.append('perPage', String(perPage))

      const response = await axios.get('/api/orders', {
        params,
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      })
      setOrders(response.data.orders)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders')
      setOrders([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found"
        message="There are currently no orders matching your filters."
      />
    )
  }

  return (
    <>
      {/* status + date-range filter controls */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mr-2 rounded border px-3 py-2"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From"
          className="mr-2 rounded border px-3 py-2"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To"
          className="rounded border px-3 py-2"
        />
      </div>

      {!loading && orders.length > 0 && (
        <>
          <OrdersTable orders={orders} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  )
}