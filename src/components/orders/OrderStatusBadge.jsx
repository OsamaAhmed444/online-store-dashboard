import React from 'react'

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success'
}

export default function OrderStatusBadge({ status }) {
  const colorClass = statusColors[status] || 'info'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-${colorClass}-100 text-${colorClass}-800`}
    >
      {status}
    </span>
  )
}