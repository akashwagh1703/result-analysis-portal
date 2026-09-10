import client, { unwrap } from './axiosClient'

export async function getStudentDetails(resultId, studentId) {
  const response = await client.get(`/results/${resultId}/students/${studentId}`)
  return unwrap(response)
}
