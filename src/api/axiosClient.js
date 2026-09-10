import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 180000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.config?.responseType === 'blob' && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text()
        error.response.data = JSON.parse(text)
      } catch {
        // keep blob error
      }
    }

    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export function unwrap(response) {
  const payload = response.data
  if (payload && payload.success === false) {
    const error = new Error(payload.message || 'Request failed')
    error.response = { data: payload, status: response.status }
    throw error
  }
  return payload?.data ?? payload
}

export default client
