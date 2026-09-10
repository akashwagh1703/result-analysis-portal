export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]">
      <div className="card w-full max-w-md p-6" style={{ animation: 'dialog-in 0.28s ease both' }}>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn bg-rose-700 text-white hover:bg-rose-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
