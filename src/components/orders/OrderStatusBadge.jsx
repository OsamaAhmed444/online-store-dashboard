import React from 'react'

export function OrderStatusBadge({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'

  return (
    <span className={`status-badge ${String(status || 'pending').toLowerCase()}`}>
      {label}
    </span>
  )
}

export default OrderStatusBadge
