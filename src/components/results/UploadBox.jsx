import { useRef, useState } from 'react'
import { formatFileSize } from '../../utils/formatters'

export default function UploadBox({ file, onFileSelect, disabled }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleFile = (nextFile) => {
    if (!nextFile) return
    if (nextFile.type !== 'application/pdf' && !nextFile.name.toLowerCase().endsWith('.pdf')) {
      setLocalError('Only PDF files are accepted.')
      onFileSelect(null)
      return
    }
    setLocalError('')
    onFileSelect(nextFile)
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          if (!disabled) handleFile(event.dataTransfer.files[0])
        }}
        className={`flex w-full flex-col items-center justify-center rounded-[1.05rem] border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${
          dragOver
            ? 'border-accent-500 bg-[#e8f3f4]'
            : 'border-line bg-[#f7f3ea] hover:border-accent-500 hover:bg-card'
        } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card text-accent-600 shadow-sm">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
            <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
          </svg>
        </div>
        <p className="text-sm font-medium text-ink">Drag & drop PDF</p>
        <p className="mt-1 text-sm text-muted">or</p>
        <span className="btn btn-primary mt-3">Choose PDF</span>
        <p className="mt-4 text-xs text-muted">Maximum file type: PDF</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {file ? (
        <div className="card mt-4 px-4 py-3">
          <p className="text-sm font-medium text-ink">{file.name}</p>
          <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
        </div>
      ) : null}

      {localError ? <p className="mt-3 text-sm text-rose-700">{localError}</p> : null}
    </div>
  )
}
