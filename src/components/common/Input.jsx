import React, { useId } from 'react'

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const descriptionId = error || helperText ? `${inputId}-description` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={['input', error ? 'input-error' : '', className].filter(Boolean).join(' ')}
        aria-invalid={!!error}
        aria-describedby={descriptionId}
        {...props}
      />

      {(error || helperText) && (
        <p id={descriptionId} className={error ? 'error-text' : 'helper-text'}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
