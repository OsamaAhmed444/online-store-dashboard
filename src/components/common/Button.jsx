import React from 'react'

import Spinner from './Spinner'

const VARIANT_CLASSES = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  link: 'btn-link',
}

const SIZE_CLASSES = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={['btn', VARIANT_CLASSES[variant], SIZE_CLASSES[size], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
