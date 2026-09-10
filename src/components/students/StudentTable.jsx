import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import TableShell from '../common/TableShell'
import { displayValue } from '../../utils/formatters'

export default function StudentTable({ students, resultId }) {
  return (
    <>
      <div className="grid gap-3 md:hidden">
        {students.map((student, index) => (
          <article key={student.id} className="mobile-card" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted">#{index + 1}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{student.name}</h3>
                <p className="mt-1 font-mono text-xs text-muted">
                  {student.prn} · {student.seatNo}
                </p>
              </div>
              <StatusBadge status={student.resultStatus} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Sem 1 SGPA</dt>
                <dd className="font-mono">{displayValue(student.semesters?.find((row) => row.semester === 1)?.displaySGPA)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Sem 2 SGPA</dt>
                <dd className="font-mono">{displayValue(student.semesters?.find((row) => row.semester === 2)?.displaySGPA)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Credits</dt>
                <dd>
                  {displayValue(student.earnedCredits)} / {displayValue(student.totalCredits)}
                </dd>
              </div>
            </dl>
            <Link
              to={`/results/${resultId}/students/${student.id}`}
              className="btn btn-primary mt-4 w-full text-xs"
            >
              View Details
            </Link>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <TableShell minWidth="68rem">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>PRN</th>
                <th>Seat No.</th>
                <th className="sticky-start">Student Name</th>
                <th>Sem 1 SGPA</th>
                <th>Sem 2 SGPA</th>
                <th>Total Credits</th>
                <th>Earned Credits</th>
                <th>Result</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td className="text-muted">{index + 1}</td>
                  <td className="font-mono text-xs">{student.prn}</td>
                  <td className="font-mono text-xs">{student.seatNo}</td>
                  <td className="sticky-start font-semibold text-ink">{student.name}</td>
                  <td className="font-mono">
                    {displayValue(student.semesters?.find((row) => row.semester === 1)?.displaySGPA)}
                  </td>
                  <td className="font-mono">
                    {displayValue(student.semesters?.find((row) => row.semester === 2)?.displaySGPA)}
                  </td>
                  <td>{displayValue(student.totalCredits)}</td>
                  <td>{displayValue(student.earnedCredits)}</td>
                  <td>
                    <StatusBadge status={student.resultStatus} />
                  </td>
                  <td>
                    <Link to={`/results/${resultId}/students/${student.id}`} className="btn btn-primary px-3 py-1.5 text-xs">
                      View Details
                    </Link>
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
