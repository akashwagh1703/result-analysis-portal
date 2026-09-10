import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, GraduationCap, Upload, Users, XCircle } from 'lucide-react'
import { getDashboard } from '../api/resultApi'
import { getFriendlyError } from '../utils/errorMessages'
import { formatDate } from '../utils/formatters'
import Loader from '../components/common/Loader'
import ErrorAlert from '../components/common/ErrorAlert'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'

const CARD_META = [
  { key: 'totalResultFiles', label: 'Total Result Files', icon: FileText },
  { key: 'totalStudents', label: 'Total Students', icon: Users },
  { key: 'passedStudents', label: 'Passed Students', icon: GraduationCap },
  { key: 'atktFailedStudents', label: 'ATKT / Failed Students', icon: XCircle },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getDashboard()
      .then((response) => {
        if (active) setData(response)
      })
      .catch((err) => {
        if (active) setError(getFriendlyError(err, 'Unable to load dashboard.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loader label="Loading dashboard..." />

  return (
    <div className="page-enter space-y-6">
      <ErrorAlert message={error} />

      <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARD_META.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.key} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{data?.[card.key] ?? 0}</p>
                </div>
                <span className="rounded-xl bg-[#efe7d6] p-2.5 text-navy-800">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-ink">Latest uploaded result</h3>
          {data?.latestResult ? (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{data.latestResult.fileName}</p>
                  <p className="text-sm text-muted">{data.latestResult.course}</p>
                </div>
                <StatusBadge status={data.latestResult.status} />
              </div>
              <p className="text-sm text-slate-600">{data.latestResult.college}</p>
              <p className="text-sm text-muted">Uploaded {formatDate(data.latestResult.uploadedAt)}</p>
              <p className="text-sm text-slate-600">
                Processing status: <span className="font-medium">{data.latestResult.status}</span>
              </p>
              <Link to={`/results/${data.latestResult.id}`} className="btn btn-primary">
                Open result
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="No results uploaded yet" description="Upload a result PDF to get started." />
            </div>
          )}
        </section>

        <section className="card p-6">
          <h3 className="text-base font-semibold text-ink">Quick action</h3>
          <p className="mt-2 text-sm text-muted">
            Upload a college result PDF to extract student records and review official scores.
          </p>
          <Link to="/results/upload" className="btn btn-accent mt-6 w-full">
            <Upload className="h-4 w-4" />
            Upload Result PDF
          </Link>
        </section>
      </div>
    </div>
  )
}
