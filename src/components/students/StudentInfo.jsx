import { displayValue } from '../../utils/formatters'

const FIELDS = [
  { key: 'prn', label: 'PRN' },
  { key: 'seatNo', label: 'Seat Number' },
  { key: 'name', label: 'Student Name' },
  { key: 'motherName', label: "Mother's Name" },
]

export default function StudentInfo({ student }) {
  if (!student) return null

  return (
    <section className="card p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">Student Information</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{field.label}</p>
            <p className="mt-1 font-medium text-ink">{displayValue(student[field.key])}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
