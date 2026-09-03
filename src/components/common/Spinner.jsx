import React from 'react'

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={['spinner', SIZE_CLASSES[size], className].filter(Boolean).join(' ')}
    />
  )
}
