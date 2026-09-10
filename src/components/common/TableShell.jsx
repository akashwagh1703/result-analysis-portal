export default function TableShell({ children, minWidth = '72rem' }) {
  return (
    <div className="table-shell">
      <div className="table-shell__scroll">
        <div style={{ minWidth }}>{children}</div>
      </div>
    </div>
  )
}
