import React from 'react'
import { Link } from 'react-router-dom'
import OrderStatusBadge from './OrderStatusBadge'

export function OrdersTable({ orders }) {
  return (
    <table className="w-full bordered rounded-md overflow-hidden">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Order</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="px-6 py-4 font-medium">
              <Link to={`/dashboard/orders/${order.id}`} className="underline underline-offset-2 hover:text-primary">
                #{order.id}
              </Link>
            </td>
            <td className="px-6 py-4">
              {order.customerName}
            </td>
            <td className="px-6 py-4">
              {order.date}
            </td>
            <td className="px-6 py-4">
              {order.total}
            </td>
            <td className="px-6 py-4">
              <OrderStatusBadge status={order.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}