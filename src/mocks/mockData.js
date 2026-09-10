const SEM1_SUBJECTS = [
  { code: 'CS-111-T', name: 'Problem Solving using Computers', credits: 3 },
  { code: 'CS-112-T', name: 'Database Management Systems', credits: 3 },
  { code: 'CS-113-T', name: 'Mathematical Foundation', credits: 3 },
  { code: 'CS-114-P', name: 'Computer Science Practical', credits: 2 },
  { code: 'AEC-111', name: 'English Communication', credits: 2 },
  { code: 'VEC-111', name: 'Environmental Studies', credits: 2 },
  { code: 'IKS-111', name: 'Indian Knowledge System', credits: 2 },
  { code: 'SEC-111', name: 'IT Skills', credits: 3 },
  { code: 'CC-111', name: 'Co-curricular Course', credits: 2 },
]

const SEM2_SUBJECTS = [
  { code: 'CS-121-T', name: 'Advanced C Programming', credits: 3 },
  { code: 'CS-122-T', name: 'Relational Database Systems', credits: 3 },
  { code: 'CS-123-T', name: 'Graph Theory', credits: 3 },
  { code: 'CS-124-P', name: 'Computer Science Practical', credits: 2 },
  { code: 'AEC-121', name: 'Professional Communication', credits: 2 },
  { code: 'VEC-121', name: 'Constitution of India', credits: 2 },
  { code: 'OE-121', name: 'Open Elective', credits: 2 },
  { code: 'SEC-121', name: 'Web Technology', credits: 3 },
  { code: 'CC-121', name: 'Co-curricular Course', credits: 2 },
]

const GRADE_MAP = {
  'O': { point: 10, min: 90 },
  'A+': { point: 9, min: 80 },
  'A': { point: 8, min: 70 },
  'B+': { point: 7, min: 60 },
  'B': { point: 6, min: 55 },
  'C': { point: 5, min: 50 },
  'D': { point: 4, min: 40 },
  'F': { point: 0, min: 0 },
}

function marksFromGrade(grade) {
  const tot = GRADE_MAP[grade]?.min ?? 0
  if (grade === 'F') return { int: 8, ext: 12, tot: 20 }
  const ext = Math.min(70, Math.round(tot * 0.7))
  const intern = tot - ext
  return { int: intern, ext, tot }
}

function buildSubjects(catalog, grades) {
  return catalog.map((subject, index) => {
    const grade = grades[index] || 'A'
    const marks = marksFromGrade(grade)
    const failed = grade === 'F' || grade === 'NA'
    const status = grade === 'NA' ? 'MARKS_NOT_AVAILABLE' : failed ? 'FAIL' : 'PASS'
    const earned = failed || grade === 'NA' ? 0 : subject.credits
    const gradePoint = grade === 'NA' ? null : GRADE_MAP[grade]?.point ?? null
    const creditPoint = gradePoint == null ? null : gradePoint * subject.credits

    return {
      code: subject.code,
      name: subject.name,
      semester: catalog === SEM1_SUBJECTS ? 1 : 2,
      int: grade === 'NA' ? '—' : marks.int,
      ext: grade === 'NA' ? '—' : marks.ext,
      tot: grade === 'NA' ? '—' : marks.tot,
      credits: subject.credits,
      earnedCredits: earned,
      grade: grade === 'NA' ? '—' : grade,
      gradePoint: gradePoint == null ? '—' : gradePoint,
      creditPoint: creditPoint == null ? '—' : creditPoint,
      status,
    }
  })
}

function semesterFromSubjects(semester, subjects, result, displaySGPA, officialSGPA) {
  const credits = subjects.reduce((sum, row) => sum + row.credits, 0)
  const earnedCredits = subjects.reduce((sum, row) => sum + (Number(row.earnedCredits) || 0), 0)
  const creditPoints = subjects.reduce((sum, row) => {
    const value = Number(row.creditPoint)
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)

  return {
    semester,
    officialSGPA,
    displaySGPA,
    credits,
    earnedCredits,
    creditPoints: result === 'PASS' || result === 'ATKT' ? creditPoints : creditPoints,
    result,
  }
}

function createStudent(config) {
  const sem1Subjects = buildSubjects(SEM1_SUBJECTS, config.sem1Grades)
  const sem2Subjects = buildSubjects(SEM2_SUBJECTS, config.sem2Grades)

  return {
    id: config.id,
    prn: config.prn,
    seatNo: config.seatNo,
    name: config.name,
    motherName: config.motherName,
    resultStatus: config.resultStatus,
    totalCredits: 44,
    earnedCredits: config.earnedCredits,
    semesters: [
      semesterFromSubjects(1, sem1Subjects, config.sem1Result, config.sem1Display, config.sem1Official),
      semesterFromSubjects(2, sem2Subjects, config.sem2Result, config.sem2Display, config.sem2Official),
    ],
    subjects: [...sem1Subjects, ...sem2Subjects],
  }
}

const passGradesHigh = ['O', 'A+', 'A+', 'A+', 'A', 'A+', 'O', 'A', 'A']
const passGradesMid = ['A', 'A+', 'B+', 'A', 'A', 'B+', 'A', 'A+', 'B+']
const passGradesLow = ['B+', 'A', 'B', 'B+', 'A', 'B', 'B+', 'A', 'B']
const atktGrades = ['A', 'F', 'B+', 'A', 'A', 'B+', 'A', 'A', 'B+']
const failGrades = ['F', 'F', 'C', 'B', 'C', 'D', 'B', 'C', 'D']
const reservedGrades = ['A', 'A', 'B+', 'A', 'A', 'A', 'B+', 'A', 'A']
const mnaGrades = ['A', 'NA', 'B+', 'A', 'A', 'B+', 'A', 'A', 'B+']

export const MOCK_STUDENTS = [
  createStudent({
    id: 'st-01',
    prn: '101234567890',
    seatNo: 'S26001',
    name: 'PATIL AKASH RAJENDRA',
    motherName: 'SUNITA',
    resultStatus: 'PASS',
    earnedCredits: 44,
    sem1Grades: passGradesHigh,
    sem2Grades: passGradesMid,
    sem1Result: 'PASS',
    sem2Result: 'PASS',
    sem1Display: '8.64',
    sem2Display: '8.36',
    sem1Official: 8.64,
    sem2Official: 8.36,
  }),
  createStudent({
    id: 'st-02',
    prn: '101234567891',
    seatNo: 'S26002',
    name: 'SHARMA PRIYA ANIL',
    motherName: 'KAVITA',
    resultStatus: 'PASS',
    earnedCredits: 44,
    sem1Grades: passGradesMid,
    sem2Grades: passGradesHigh,
    sem1Result: 'PASS',
    sem2Result: 'PASS',
    sem1Display: '8.12',
    sem2Display: '8.71',
    sem1Official: 8.12,
    sem2Official: 8.71,
  }),
  createStudent({
    id: 'st-03',
    prn: '101234567892',
    seatNo: 'S26003',
    name: 'JOSHI ROHAN SANJAY',
    motherName: 'MEENA',
    resultStatus: 'ATKT',
    earnedCredits: 41,
    sem1Grades: atktGrades,
    sem2Grades: passGradesLow,
    sem1Result: 'ATKT',
    sem2Result: 'PASS',
    sem1Display: '-----',
    sem2Display: '7.18',
    sem1Official: null,
    sem2Official: 7.18,
  }),
  createStudent({
    id: 'st-04',
    prn: '101234567893',
    seatNo: 'S26004',
    name: 'DESHMUKH SNEHA VIKAS',
    motherName: 'ANITA',
    resultStatus: 'PASS',
    earnedCredits: 44,
    sem1Grades: passGradesLow,
    sem2Grades: passGradesMid,
    sem1Result: 'PASS',
    sem2Result: 'PASS',
    sem1Display: '7.45',
    sem2Display: '8.05',
    sem1Official: 7.45,
    sem2Official: 8.05,
  }),
  createStudent({
    id: 'st-05',
    prn: '101234567894',
    seatNo: 'S26005',
    name: 'KULKARNI AMIT DATTATRAY',
    motherName: 'REKHA',
    resultStatus: 'FAIL',
    earnedCredits: 28,
    sem1Grades: failGrades,
    sem2Grades: atktGrades,
    sem1Result: 'FAIL',
    sem2Result: 'ATKT',
    sem1Display: '-----',
    sem2Display: '-----',
    sem1Official: null,
    sem2Official: null,
  }),
  createStudent({
    id: 'st-06',
    prn: '101234567895',
    seatNo: 'S26006',
    name: 'GAIKWAD NEHA MAHESH',
    motherName: 'SANGITA',
    resultStatus: 'RESERVED',
    earnedCredits: 44,
    sem1Grades: reservedGrades,
    sem2Grades: passGradesMid,
    sem1Result: 'RESERVED',
    sem2Result: 'RESERVED',
    sem1Display: '8.09',
    sem2Display: '8.14',
    sem1Official: 8.09,
    sem2Official: 8.14,
  }),
  createStudent({
    id: 'st-07',
    prn: '101234567896',
    seatNo: 'S26007',
    name: 'PAWAR SAHIL BALASAHEB',
    motherName: 'LATA',
    resultStatus: 'MARKS_NOT_AVAILABLE',
    earnedCredits: 41,
    sem1Grades: mnaGrades,
    sem2Grades: passGradesLow,
    sem1Result: 'MARKS_NOT_AVAILABLE',
    sem2Result: 'PASS',
    sem1Display: '-----',
    sem2Display: '7.22',
    sem1Official: null,
    sem2Official: 7.22,
  }),
  createStudent({
    id: 'st-08',
    prn: '101234567897',
    seatNo: 'S26008',
    name: 'BHOIR ANANYA NITIN',
    motherName: 'POOJA',
    resultStatus: 'PASS',
    earnedCredits: 44,
    sem1Grades: passGradesHigh,
    sem2Grades: passGradesHigh,
    sem1Result: 'PASS',
    sem2Result: 'PASS',
    sem1Display: '9.05',
    sem2Display: '8.91',
    sem1Official: 9.05,
    sem2Official: 8.91,
  }),
]

function cloneStudents(prefix = '') {
  return MOCK_STUDENTS.map((student, index) => ({
    ...student,
    id: prefix ? `${prefix}-${student.id}` : student.id,
    prn: prefix ? String(Number(student.prn) + index + 10) : student.prn,
  }))
}

function summarize(students) {
  const passed = students.filter((row) => row.resultStatus === 'PASS').length
  const failAtkt = students.filter((row) => row.resultStatus === 'FAIL' || row.resultStatus === 'ATKT').length
  const reservedOther = students.filter(
    (row) => row.resultStatus === 'RESERVED' || row.resultStatus === 'MARKS_NOT_AVAILABLE',
  ).length

  const numeric = students.flatMap((row) =>
    row.semesters.map((sem) => sem.officialSGPA).filter((value) => typeof value === 'number'),
  )
  const averageSGPA = numeric.length
    ? (numeric.reduce((sum, value) => sum + value, 0) / numeric.length).toFixed(2)
    : '—'

  return {
    totalStudents: students.length,
    passed,
    failAtkt,
    reservedOther,
    averageSGPA,
  }
}

const summerStudents = cloneStudents()
const winterStudents = cloneStudents('win').slice(0, 6)

export const MOCK_USER = {
  id: 'u-1',
  name: 'Admin User',
  username: 'admin',
  email: 'admin@college.edu',
}

export const INITIAL_RESULTS = [
  {
    id: 'res-1001',
    fileName: 'SPPU_BSc_CS_Summer_2026.pdf',
    college: 'H.P.T. Arts and R.Y.K. Science College, Nashik',
    course: 'B.Sc. Computer Science',
    examSession: 'Summer Session 2026',
    pattern: '2025 Pattern (NEP 2020)',
    studentCount: summerStudents.length,
    status: 'COMPLETED',
    uploadedAt: '2026-06-18T10:24:00.000Z',
    summary: summarize(summerStudents),
    students: summerStudents,
  },
  {
    id: 'res-1000',
    fileName: 'SPPU_BSc_CS_Winter_2025.pdf',
    college: 'H.P.T. Arts and R.Y.K. Science College, Nashik',
    course: 'B.Sc. Computer Science',
    examSession: 'Winter Session 2025',
    pattern: '2025 Pattern (NEP 2020)',
    studentCount: winterStudents.length,
    status: 'COMPLETED',
    uploadedAt: '2025-12-12T14:05:00.000Z',
    summary: summarize(winterStudents),
    students: winterStudents,
  },
]

export { summarize }
