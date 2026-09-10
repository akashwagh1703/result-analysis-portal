import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/results/UploadBox'
import ProcessingStatus from '../components/results/ProcessingStatus'
import ErrorAlert from '../components/common/ErrorAlert'
import { getProcessingStatus, uploadResult } from '../api/resultApi'
import { getFriendlyError } from '../utils/errorMessages'
import { DONE_STATUSES } from '../utils/constants'

export default function UploadResult() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const pollStatus = async (id) => {
    const maxAttempts = 12
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const response = await getProcessingStatus(id)
      setCurrentStep(response.step)
      setStatus(response.status)

      if (DONE_STATUSES.has(response.status) || response.step === 'completed') {
        navigate(`/results/${id}`)
        return
      }
      if (response.status === 'FAILED') {
        throw Object.assign(new Error('Processing failed'), {
          response: { data: { code: 'PROCESSING_FAILED' } },
        })
      }
    }
    throw Object.assign(new Error('Processing timeout'), {
      response: { data: { code: 'PROCESSING_FAILED' } },
    })
  }

  const handleUpload = async () => {
    setError('')
    if (!file) {
      setError('Please choose a PDF file before uploading.')
      return
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid PDF. Please upload a valid college result PDF.')
      return
    }

    setUploading(true)
    setProgress(0)
    setCurrentStep('uploading')
    setStatus('PROCESSING')

    try {
      const response = await uploadResult(file, setProgress)
      setCurrentStep(response.currentStep || 'uploaded')
      setStatus(response.status)
      if (DONE_STATUSES.has(response.status)) {
        navigate(`/results/${response.id}`)
        return
      }
      await pollStatus(response.id)
    } catch (err) {
      setError(getFriendlyError(err, 'Upload failed. Please try again.'))
      setStatus('FAILED')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="page-enter mx-auto max-w-2xl space-y-6">
      <section className="card p-6">
        <h1 className="text-lg font-bold text-ink">Upload Result PDF</h1>
        <p className="mt-1 text-sm text-muted">
          Accept only one college result PDF. The backend extracts student records for review.
        </p>

        <div className="mt-6">
          <UploadBox file={file} onFileSelect={setFile} disabled={uploading} />
        </div>

        {uploading && progress > 0 && progress < 100 ? (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>Uploading PDF...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#efe7d6]">
              <div
                className="h-full rounded-full bg-accent-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <ErrorAlert message={error} />
        </div>

        <button type="button" onClick={handleUpload} disabled={uploading} className="btn btn-primary mt-6 w-full">
          {uploading ? 'Upload in progress...' : 'Upload & Process'}
        </button>
      </section>

      {currentStep ? <ProcessingStatus currentStep={currentStep} status={status} /> : null}
    </div>
  )
}
