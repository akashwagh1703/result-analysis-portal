import { useEffect, useState } from 'react'
import { getResults, exportResultExcel } from '../api/resultApi'
import { getFriendlyError } from '../utils/errorMessages'
import { downloadBlob } from '../utils/formatters'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import ErrorAlert from '../components/common/ErrorAlert'
import ResultTable from '../components/results/ResultTable'

export default function Results() {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exportError, setExportError] = useState('')

  const loadResults = (query = '') => {
    setLoading(true)
    setError('')
    getResults(query)
      .then((response) => setResults(response.results || []))
      .catch((err) => setError(getFriendlyError(err, 'Unable to load results.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadResults()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    loadResults(search)
  }

  const handleExport = async (row) => {
    setExportError('')
    try {
      const { blob, filename } = await exportResultExcel(row.id)
      downloadBlob(blob, filename)
    } catch (err) {
      setExportError(getFriendlyError(err, 'Excel export failed. Please try again.'))
    }
  }

  return (
    <div className="page-enter space-y-5">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by file name, college, or course"
          className="field"
        />
        <button type="submit" className="btn btn-primary sm:w-auto">
          Search
        </button>
      </form>

      <ErrorAlert message={error || exportError} />

      {loading ? (
        <Loader label="Loading results..." />
      ) : error ? null : results.length === 0 ? (
        <EmptyState
          title="No results found"
          description="No result batches match the current search."
        />
      ) : (
        <ResultTable results={results} onExport={handleExport} />
      )}
    </div>
  )
}
