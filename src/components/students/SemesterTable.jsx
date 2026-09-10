import StatusBadge from '../common/StatusBadge'
import TableShell from '../common/TableShell'
import { displayValue } from '../../utils/formatters'

export default function SemesterTable({ semesters = [] }) {
  return (
    <section>
      <h2 className="mb-3 px-1 text-base font-semibold text-ink">Semester Summary</h2>

      <div className="grid gap-3 sm:hidden">
        {semesters.map((row) => (
          <article key={row.semester} className="mobile-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-ink">Semester {row.semester}</h3>
              <StatusBadge status={row.result} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">SGPA</dt>
                <dd className="font-mono">{displayValue(row.displaySGPA)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Credits</dt>
                <dd>
                  {displayValue(row.earnedCredits)} / {displayValue(row.credits)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Credit Points</dt>
                <dd>{displayValue(row.creditPoints)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden sm:block">
        <TableShell minWidth="42rem">
          <table className="data-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th className="text-right">SGPA</th>
                <th className="text-right">Credits</th>
                <th className="text-right">Earned Credits</th>
                <th className="text-right">Credit Points</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((row) => (
                <tr key={row.semester}>
                  <td className="font-semibold text-ink">Semester {row.semester}</td>
                  <td className="text-right font-mono">{displayValue(row.displaySGPA)}</td>
                  <td className="text-right">{displayValue(row.credits)}</td>
                  <td className="text-right">{displayValue(row.earnedCredits)}</td>
                  <td className="text-right">{displayValue(row.creditPoints)}</td>
                  <td>
                    <StatusBadge status={row.result} />
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
