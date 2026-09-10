export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const RESULT_STATUSES = [
  { value: 'PASS', label: 'PASS' },
  { value: 'FAIL', label: 'FAIL' },
  { value: 'ATKT', label: 'ATKT' },
  { value: 'RESERVED', label: 'RESERVED' },
  { value: 'MARKS_NOT_AVAILABLE', label: 'Marks not available' },
]

export const PROCESSING_STEPS = [
  { key: 'uploading', label: 'Uploading PDF...' },
  { key: 'uploaded', label: 'PDF uploaded' },
  { key: 'extracting', label: 'Extracting data...' },
  { key: 'parsing', label: 'Parsing students...' },
  { key: 'validating', label: 'Validating data...' },
  { key: 'completed', label: 'Completed' },
]

export const BATCH_STATUS = {
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_WARNINGS: 'COMPLETED_WITH_WARNINGS',
  FAILED: 'FAILED',
}

export const DONE_STATUSES = new Set(['COMPLETED', 'COMPLETED_WITH_WARNINGS'])
