const STATUS_MESSAGES = {
  400: 'The request could not be processed. Please check the file and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested record was not found.',
  409: 'This result file has already been uploaded.',
  413: 'The selected file is too large to upload.',
  415: 'Only PDF files are accepted.',
  422: 'The PDF could not be processed. Please upload a valid result PDF.',
  500: 'Something went wrong while processing your request.',
  502: 'The server is currently unavailable. Please try again later.',
  503: 'The server is currently unavailable. Please try again later.',
}

const CODE_MESSAGES = {
  INVALID_PDF: 'Invalid PDF. Please upload a valid college result PDF.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  PROCESSING_FAILED: 'PDF processing failed. Please try again with a valid result PDF.',
  NO_STUDENTS: 'No students were found in this result file.',
  API_UNAVAILABLE: 'The server is currently unavailable. Please try again later.',
  EXPORT_FAILED: 'Excel export failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
}

export function getFriendlyError(error, fallback = 'Something went wrong. Please try again.') {
  const payload = error?.response?.data
  const code = payload?.code || error?.code
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code]
  if (code && payload?.message) return payload.message

  const status = error?.response?.status
  if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]

  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return CODE_MESSAGES.API_UNAVAILABLE
  }

  return fallback
}
