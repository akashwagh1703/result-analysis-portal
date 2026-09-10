import { PROCESSING_STEPS } from '../utils/constants'
import { INITIAL_RESULTS, MOCK_USER, summarize, MOCK_STUDENTS } from './mockData'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const store = {
  results: structuredClone(INITIAL_RESULTS),
  jobs: {},
}

function toListItem(result) {
  return {
    id: result.id,
    fileName: result.fileName,
    college: result.college,
    course: result.course,
    examSession: result.examSession,
    pattern: result.pattern,
    studentCount: result.studentCount,
    status: result.status,
    uploadedAt: result.uploadedAt,
  }
}

export const mockApi = {
  async login(username, password) {
    await delay(450)
    const validUser = username === MOCK_USER.username || username === MOCK_USER.email
    if (!validUser || password !== 'admin123') {
      const error = new Error('Invalid credentials')
      error.response = { status: 401, data: { code: 'INVALID_CREDENTIALS' } }
      throw error
    }
    return {
      token: 'mock-jwt-token',
      user: MOCK_USER,
    }
  },

  async getDashboard() {
    await delay(250)
    const completed = store.results.filter((row) => row.status === 'COMPLETED')
    const students = completed.flatMap((row) => row.students || [])
    const latest = [...store.results].sort(
      (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
    )[0]

    return {
      totalResultFiles: store.results.length,
      totalStudents: students.length,
      passedStudents: students.filter((row) => row.resultStatus === 'PASS').length,
      atktFailedStudents: students.filter(
        (row) => row.resultStatus === 'FAIL' || row.resultStatus === 'ATKT',
      ).length,
      latestResult: latest ? toListItem(latest) : null,
    }
  },

  async getResults(search = '') {
    await delay(250)
    const query = search.trim().toLowerCase()
    const rows = store.results.map(toListItem)
    if (!query) return { results: rows }
    return {
      results: rows.filter(
        (row) =>
          row.fileName.toLowerCase().includes(query) ||
          row.college.toLowerCase().includes(query) ||
          row.course.toLowerCase().includes(query),
      ),
    }
  },

  async getResult(id) {
    await delay(250)
    const result = store.results.find((row) => row.id === id)
    if (!result) {
      const error = new Error('Not found')
      error.response = { status: 404 }
      throw error
    }
    return structuredClone(result)
  },

  async getStudent(resultId, studentId) {
    await delay(250)
    const result = store.results.find((row) => row.id === resultId)
    const student = result?.students?.find((row) => row.id === studentId)
    if (!student) {
      const error = new Error('Not found')
      error.response = { status: 404 }
      throw error
    }
    return {
      result: {
        id: result.id,
        course: result.course,
        pattern: result.pattern,
        examSession: result.examSession,
        college: result.college,
      },
      student: structuredClone(student),
    }
  },

  async uploadResult(file, onProgress) {
    if (!file || file.type !== 'application/pdf') {
      const error = new Error('Invalid PDF')
      error.response = { status: 415, data: { code: 'INVALID_PDF' } }
      throw error
    }

    for (let value = 12; value <= 100; value += 22) {
      await delay(180)
      onProgress?.(Math.min(value, 100))
    }

    const id = `res-${Date.now()}`
    const job = {
      id,
      stepIndex: 1,
      status: 'PROCESSING',
    }
    store.jobs[id] = job

    const students = structuredClone(MOCK_STUDENTS).map((student) => ({
      ...student,
      id: `${id}-${student.id}`,
    }))

    store.results.unshift({
      id,
      fileName: file.name,
      college: 'H.P.T. Arts and R.Y.K. Science College, Nashik',
      course: 'B.Sc. Computer Science',
      examSession: 'Summer Session 2026',
      pattern: '2025 Pattern (NEP 2020)',
      studentCount: students.length,
      status: 'PROCESSING',
      uploadedAt: new Date().toISOString(),
      summary: summarize(students),
      students,
    })

    return { id, status: 'PROCESSING' }
  },

  async getProcessingStatus(id) {
    await delay(400)
    const job = store.jobs[id]
    const result = store.results.find((row) => row.id === id)

    if (!result) {
      const error = new Error('Not found')
      error.response = { status: 404 }
      throw error
    }

    if (!job || result.status === 'COMPLETED') {
      return {
        status: result.status,
        step: 'completed',
        stepIndex: PROCESSING_STEPS.length - 1,
        steps: PROCESSING_STEPS,
      }
    }

    job.stepIndex = Math.min(job.stepIndex + 1, PROCESSING_STEPS.length - 1)
    const step = PROCESSING_STEPS[job.stepIndex]
    if (step.key === 'completed') {
      result.status = 'COMPLETED'
      job.status = 'COMPLETED'
    }

    return {
      status: result.status,
      step: step.key,
      stepIndex: job.stepIndex,
      steps: PROCESSING_STEPS,
    }
  },

  async exportExcel(id) {
    await delay(400)
    const result = store.results.find((row) => row.id === id)
    if (!result) {
      const error = new Error('Export failed')
      error.response = { status: 500, data: { code: 'EXPORT_FAILED' } }
      throw error
    }

    const header = ['PRN', 'Seat No', 'Name', 'Mother Name', 'Sem 1 SGPA', 'Sem 2 SGPA', 'Result']
    const lines = [
      header.join(','),
      ...result.students.map((student) =>
        [
          student.prn,
          student.seatNo,
          `"${student.name}"`,
          `"${student.motherName}"`,
          student.semesters[0]?.displaySGPA ?? '',
          student.semesters[1]?.displaySGPA ?? '',
          student.resultStatus,
        ].join(','),
      ),
    ]
    return {
      blob: new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' }),
      filename: `${result.fileName.replace(/\.pdf$/i, '')}.csv`,
    }
  },
}
