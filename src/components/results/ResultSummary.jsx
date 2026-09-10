const CARDS = [
  { key: 'totalStudents', label: 'Total Students' },
  { key: 'passed', label: 'Passed' },
  { key: 'failAtkt', label: 'Fail / ATKT' },
  { key: 'reservedOther', label: 'Reserved / Other' },
  { key: 'averageSGPA', label: 'Average SGPA' },
]

export default function ResultSummary({ summary }) {
  if (!summary) return null

  return (
    <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map((card) => (
        <div key={card.key} className="card card-hover p-4">
          <p className="text-sm text-muted">{card.label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{summary[card.key] ?? '—'}</p>
        </div>
      ))}
    </div>
  )
}
