import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import TableShell from '../common/TableShell'
import { formatDate } from '../../utils/formatters'

export default function ResultTable({ results, onExport }) {
  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {results.map((row, index) => (
          <article key={row.id} className="mobile-card" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{row.fileName}</p>
                <p className="mt-1 text-sm text-muted">{row.course}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <p className="text-sm text-slate-600">{row.college}</p>
            <p className="mt-1 text-xs text-muted">
              {row.examSession} · {row.studentCount} students
            </p>
            <p className="mt-1 text-xs text-muted">{formatDate(row.uploadedAt)}</p>
            <div className="mt-4 flex gap-2">
              <Link to={`/results/${row.id}`} className="btn btn-primary flex-1 text-xs">
                View
              </Link>
              <button type="button" onClick={() => onExport(row)} className="btn btn-ghost flex-1 text-xs">
                Export Excel
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden lg:block">
        <TableShell minWidth="86rem">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky-start">File Name</th>
                <th>College</th>
                <th>Course</th>
                <th>Exam Session</th>
                <th>Pattern</th>
                <th>Students</th>
                <th>Status</th>
                <th>Uploaded Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id}>
                  <td className="sticky-start font-semibold text-ink">{row.fileName}</td>
                  <td className="max-w-[240px] text-slate-600">{row.college}</td>
                  <td>{row.course}</td>
                  <td>{row.examSession}</td>
                  <td>{row.pattern}</td>
                  <td>{row.studentCount}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="whitespace-nowrap text-muted">{formatDate(row.uploadedAt)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/results/${row.id}`} className="btn btn-primary px-3 py-1.5 text-xs">
                        View
                      </Link>
                      <button type="button" onClick={() => onExport(row)} className="btn btn-ghost px-3 py-1.5 text-xs">
                        Export Excel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </div>
    </>
  )
}
