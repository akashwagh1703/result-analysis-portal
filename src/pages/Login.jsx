import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getFriendlyError } from '../utils/errorMessages'
import ErrorAlert from '../components/common/ErrorAlert'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getFriendlyError(err, 'Invalid username or password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-navy-950 px-12 py-16 text-[#f4f1ea] lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,107,115,0.35),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(176,137,62,0.18),transparent_28%)]" />
        <div className="relative page-enter">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">College Admin Utility</p>
          <h1 className="mt-5 max-w-lg text-5xl font-bold leading-tight">Result Analysis Portal</h1>
          <p className="mt-5 max-w-md text-base text-white/70">
            Upload SPPU result PDFs, review extracted student records, and export official result data
            to Excel.
          </p>
        </div>
        <div className="relative grid max-w-md gap-4 text-sm text-white/75">
          <p>1. Upload one college result PDF</p>
          <p>2. Review extracted student data</p>
          <p>3. Export the result to Excel</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="card page-enter w-full max-w-md p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold lg:hidden">Result Analysis</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Use your admin credentials to continue.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-800">Username / email</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-800">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="field"
              />
            </label>
          </div>

          <div className="mt-4">
            <ErrorAlert message={error} />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full">
            {submitting ? 'Signing in...' : 'Login'}
          </button>

          <p className="mt-4 text-center text-xs text-muted">
            Admin login: <span className="font-medium text-ink">admin</span> /{' '}
            <span className="font-medium text-ink">admin123</span>
          </p>
        </form>
      </section>
    </div>
  )
}
