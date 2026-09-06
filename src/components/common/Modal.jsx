import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className={['modal-panel', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="modal-heading">
            {title && <h2>{title}</h2>}
            {onClose && (
              <button type="button" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        {children}
      </section>
    </div>
  )
}
