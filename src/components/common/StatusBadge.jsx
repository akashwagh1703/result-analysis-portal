const STYLES = {
  PASS: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  COMPLETED_WITH_WARNINGS: 'bg-amber-50 text-amber-800 ring-amber-200',
  UPLOADED: 'bg-[#efe7d6] text-navy-800 ring-[#e4ddd0]',
  FAIL: 'bg-rose-50 text-rose-800 ring-rose-200',
  FAILED: 'bg-rose-50 text-rose-800 ring-rose-200',
  ATKT: 'bg-amber-50 text-amber-800 ring-amber-200',
  PROCESSING: 'bg-sky-50 text-sky-800 ring-sky-200',
  RESERVED: 'bg-[#efe7d6] text-navy-800 ring-[#e4ddd0]',
  MARKS_NOT_AVAILABLE: 'bg-violet-50 text-violet-800 ring-violet-200',
}

const LABELS = {
  MARKS_NOT_AVAILABLE: 'Marks N/A',
  COMPLETED_WITH_WARNINGS: 'Completed with warnings',
}

export default function StatusBadge({ status }) {
  const value = status || '—'
  const style = STYLES[value] || 'bg-[#efe7d6] text-navy-800 ring-[#e4ddd0]'

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {LABELS[value] || value}
    </span>
  )
}
