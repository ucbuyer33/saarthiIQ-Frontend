import React from 'react'

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmTone = 'danger',
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null

  const confirmStyle =
    confirmTone === 'danger'
      ? {
          background: 'var(--color-error)',
          color: 'white',
          border: '1px solid var(--color-error)',
        }
      : {
          background: 'var(--color-primary)',
          color: 'white',
          border: '1px solid var(--color-primary)',
        }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-5)',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="btn"
            onClick={onConfirm}
            disabled={loading}
            style={confirmStyle}
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}