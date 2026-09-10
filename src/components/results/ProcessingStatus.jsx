import { PROCESSING_STEPS } from '../../utils/constants'

export default function ProcessingStatus({ currentStep = 'uploading', status }) {
  const activeIndex = Math.max(
    0,
    PROCESSING_STEPS.findIndex((step) => step.key === currentStep),
  )
  const done = status === 'COMPLETED' || status === 'COMPLETED_WITH_WARNINGS'

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink">Processing status</h3>
      <ol className="space-y-3">
        {PROCESSING_STEPS.map((step, index) => {
          const complete = index < activeIndex || done
          const current = index === activeIndex && !done && status !== 'FAILED'
          return (
            <li key={step.key} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                  complete
                    ? 'bg-accent-600 text-white'
                    : current
                      ? 'bg-[#e8f3f4] text-accent-700'
                      : 'bg-[#efe7d6] text-muted'
                }`}
              >
                {complete ? '✓' : index + 1}
              </span>
              <span className={`text-sm ${current ? 'font-medium text-ink' : 'text-muted'}`}>{step.label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
