import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { exportResultExcel, getResult } from '../api/resultApi'
import { getFriendlyError } from '../utils/errorMessages'
import { downloadBlob } from '../utils/formatters'
import { RESULT_STATUSES } from '../utils/constants'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import ErrorAlert from '../components/common/ErrorAlert'
import ResultSummary from '../components/results/ResultSummary'
import StudentTable from '../components/students/StudentTable'

const GRADE_OPTIONS = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F']

export default function ResultDetails() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exportError, setExportError] = useState('')
  const [search, setSearch] = useState('')
  const [semester, setSemester] = useState('')
  const [status, setStatus] = useState('')
  const [grade, setGrade] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getResult(id)
      .then((response) => {
        if (active) setResult(response)
      })
      .catch((err) => {
        if (active) setError(getFriendlyError(err, 'Unable to load result details.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const students = useMemo(() => {
    const rows = result?.students || []
    const query = search.trim().toLowerCase()

    return rows.filter((student) => {
      const matchesSearch =
        !query ||
        student.prn.toLowerCase().includes(query) ||
        student.seatNo.toLowerCase().includes(query) ||
        student.name.toLowerCase().includes(query)

      const matchesStatus = !status || student.resultStatus === status
      const subjectPool = semester
        ? student.subjects.filter((subject) => String(subject.semester) === semester)
        : student.subjects
      const matchesGrade = !grade || subjectPool.some((subject) => subject.grade === grade)

      return matchesSearch && matchesStatus && matchesGrade
    })
  }, [result, search, semester, status, grade])

  const handleExport = async () => {
    setExportError('')
    try {
      const { blob, filename } = await exportResultExcel(id)
      downloadBlob(blob, filename)
    } catch (err) {
      setExportError(getFriendlyError(err, 'Excel export failed. Please try again.'))
    }
  }

  if (loading) return <Loader label="Loading result details..." />

  if (error) {
    return <ErrorAlert message={error} />
  }

  if (!result) {
    return <EmptyState title="Result not found" description="This result batch is unavailable." />
  }

  return (
    <div className="page-enter space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{result.course}</h1>
            <p className="mt-1 text-slate-600">{result.pattern}</p>
            <p className="text-slate-600">{result.examSession}</p>
            <p className="mt-3 text-sm text-muted">College</p>
            <p className="font-medium text-ink">{result.college}</p>
          </div>
          <button type="button" onClick={handleExport} className="btn btn-accent">
            Export Excel
          </button>
        </div>
      </section>

      <ResultSummary summary={result.summary} />
      <ErrorAlert message={exportError} />

      <section className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search PRN, seat no, or name"
            className="field"
          />
          <select
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
            className="field"
          >
            <option value="">All semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="field"
          >
            <option value="">All result statuses</option>
            {RESULT_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            className="field"
          >
            <option value="">All grades</option>
            {GRADE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {students.length === 0 ? (
          <EmptyState title="No students found" description="Try a different search or filter." />
        ) : (
          <StudentTable students={students} resultId={result.id} />
        )}
      </section>
    </div>
  )
}
