import StatusBadge from '../common/StatusBadge'
import TableShell from '../common/TableShell'
import { displayValue } from '../../utils/formatters'

export default function SubjectTable({ subjects = [] }) {
  return (
    <section>
      <h2 className="mb-3 px-1 text-base font-semibold text-ink">Subject Details</h2>

      <div className="grid gap-3 md:hidden">
        {subjects.map((row, index) => (
          <article key={`${row.semester}-${row.code}-${index}`} className="mobile-card">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted">{row.code}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{row.name || '—'}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-muted">INT</dt>
                <dd className="font-mono">{displayValue(row.int)}</dd>
              </div>
              <div>
                <dt className="text-muted">EXT</dt>
                <dd className="font-mono">{displayValue(row.ext)}</dd>
              </div>
              <div>
                <dt className="text-muted">PR</dt>
                <dd className="font-mono">{displayValue(row.pr)}</dd>
              </div>
              <div>
                <dt className="text-muted">PJ</dt>
                <dd className="font-mono">{displayValue(row.pj)}</dd>
              </div>
              <div>
                <dt className="text-muted">Marks</dt>
                <dd className="font-mono">{displayValue(row.tot)}</dd>
              </div>
              <div>
                <dt className="text-muted">Grade</dt>
                <dd className="font-semibold">{displayValue(row.grade)}</dd>
              </div>
              <div>
                <dt className="text-muted">Credits</dt>
                <dd>
                  {displayValue(row.earnedCredits)} / {displayValue(row.credits)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">GP</dt>
                <dd>{displayValue(row.gradePoint)}</dd>
              </div>
              <div>
                <dt className="text-muted">CP</dt>
                <dd>{displayValue(row.creditPoint)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <TableShell minWidth="78rem">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky-start">Subject Code</th>
                <th>Subject</th>
                <th className="text-right">INT</th>
                <th className="text-right">EXT</th>
                <th className="text-right">PR</th>
                <th className="text-right">PJ</th>
                <th className="text-right">Marks</th>
                <th className="text-right">Course Credits</th>
                <th className="text-right">Earned Credits</th>
                <th>Grade</th>
                <th className="text-right">Grade Point</th>
                <th className="text-right">Credit Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((row, index) => (
                <tr key={`${row.semester}-${row.code}-${index}`}>
                  <td className="sticky-start font-mono text-xs">{row.code}</td>
                  <td>{row.name || '—'}</td>
                  <td className="text-right font-mono">{displayValue(row.int)}</td>
                  <td className="text-right font-mono">{displayValue(row.ext)}</td>
                  <td className="text-right font-mono">{displayValue(row.pr)}</td>
                  <td className="text-right font-mono">{displayValue(row.pj)}</td>
                  <td className="text-right font-mono">{displayValue(row.tot)}</td>
                  <td className="text-right">{displayValue(row.credits)}</td>
                  <td className="text-right">{displayValue(row.earnedCredits)}</td>
                  <td className="font-semibold">{displayValue(row.grade)}</td>
                  <td className="text-right">{displayValue(row.gradePoint)}</td>
                  <td className="text-right">{displayValue(row.creditPoint)}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </div>
    </section>
  )
}
