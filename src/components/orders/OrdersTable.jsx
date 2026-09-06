import React from 'react'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { OrderStatusBadge } from './OrderStatusBadge'

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

export function OrdersTable({ orders }) {
  const navigate = useNavigate()

  return (
    <div className="orders-table-panel">
      <div className="orders-table-scroll">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id-cell">#{String(order.id).slice(-8).toUpperCase()}</td>
                <td className="order-customer-cell">
                  <strong>{order.customer}</strong>
                </td>
                <td>{formatDate(order.date)}</td>
                <td>{order.items.length}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td>
                  <button
                    type="button"
                    className="order-view-action"
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                    aria-label={`View order ${order.id}`}
                  >
                    <Eye size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable
