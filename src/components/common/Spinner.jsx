import React from 'react'

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

export function Spinner({ size = 'md', className = '', text = '', ...props }) {
  const spinnerClassName = ['spinner', SIZE_CLASSES[size] || SIZE_CLASSES.md, className]
    .filter(Boolean)
    .join(' ')

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center gap-2" {...props}>
        <span
          role="status"
          aria-label="Loading"
          className={spinnerClassName}
        />
        <p className="text-sm empty-state-message">{text}</p>
      </div>
    )
  }

  return (
    <span
      role="status"
      aria-label="Loading"
      className={spinnerClassName}
      {...props}
    />
  )
}

export function LoadingScreen({ text = 'Loading...' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <span className="spinner h-8 w-8" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export default Spinner
