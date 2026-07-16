import Modal from './Modal'
import Spinner from './Spinner'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || 'Confirm Action'}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner size={14} /> : 'Confirm'}
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        {message || 'Are you sure? This action cannot be undone.'}
      </p>
    </Modal>
  )
}
