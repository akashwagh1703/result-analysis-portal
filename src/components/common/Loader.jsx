export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e4ddd0] border-t-accent-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
