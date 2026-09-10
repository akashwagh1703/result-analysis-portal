import client, { unwrap } from './axiosClient'

export async function login(username, password) {
  const response = await client.post('/auth/login', { username, password })
  return unwrap(response)
}

export async function getMe() {
  const response = await client.get('/auth/me')
  return unwrap(response)
}
