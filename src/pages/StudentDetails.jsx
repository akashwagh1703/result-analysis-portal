import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStudentDetails } from '../api/studentApi'
import { getFriendlyError } from '../utils/errorMessages'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import ErrorAlert from '../components/common/ErrorAlert'
import StudentInfo from '../components/students/StudentInfo'
import SemesterTable from '../components/students/SemesterTable'
import SubjectTable from '../components/students/SubjectTable'
import StatusBadge from '../components/common/StatusBadge'

export default function StudentDetails() {
  const { resultId, studentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [semester, setSemester] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getStudentDetails(resultId, studentId)
      .then((response) => {
        if (active) setData(response)
      })
      .catch((err) => {
        if (active) setError(getFriendlyError(err, 'Unable to load student details.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [resultId, studentId])

  const subjects = useMemo(() => {
    const rows = data?.student?.subjects || []
    if (!semester) return rows
    return rows.filter((row) => String(row.semester) === semester)
  }, [data, semester])

  if (loading) return <Loader label="Loading student details..." />
  if (error) return <ErrorAlert message={error} />
  if (!data?.student) {
    return <EmptyState title="Student not found" description="This student record is unavailable." />
  }

  const { student, result } = data

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link to={`/results/${resultId}`} className="text-sm font-medium text-accent-700 hover:underline">
            Back to result
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{student.name}</h1>
          <p className="text-slate-600">{result.course}</p>
          <p className="text-sm text-muted">
            {result.pattern} · {result.examSession}
          </p>
        </div>
        <StatusBadge status={student.resultStatus} />
      </div>

      <StudentInfo student={student} />
      <SemesterTable semesters={student.semesters} />

      <div className="flex justify-end">
        <select
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
          className="field max-w-xs"
        >
          <option value="">All subjects</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>

      <SubjectTable subjects={subjects} />
    </div>
  )
}
