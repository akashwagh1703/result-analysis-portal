import client, { unwrap } from './axiosClient'

export async function getDashboard() {
  const response = await client.get('/dashboard')
  return unwrap(response)
}

export async function getResults(search = '') {
  const response = await client.get('/results', { params: { search } })
  return unwrap(response)
}

export async function getResult(id) {
  const response = await client.get(`/results/${id}`)
  return unwrap(response)
}

export async function uploadResult(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await client.post('/results/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 180000,
    onUploadProgress: (event) => {
      if (!event.total) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    },
  })
  return unwrap(response)
}

export async function getProcessingStatus(id) {
  const response = await client.get(`/results/${id}/status`)
  return unwrap(response)
}

export async function exportResultExcel(id) {
  const response = await client.get(`/results/${id}/export/excel`, {
    responseType: 'blob',
  })

  const contentType = response.headers['content-type'] || ''
  if (contentType.includes('application/json') && response.data instanceof Blob) {
    const payload = JSON.parse(await response.data.text())
    const error = new Error(payload.message || 'Excel export failed')
    error.response = { data: payload }
    throw error
  }

  const disposition = response.headers['content-disposition'] || ''
  const match = disposition.match(/filename="?([^"]+)"?/)
  const filename = match?.[1] || `result-${id}.xlsx`

  return { blob: response.data, filename }
}
