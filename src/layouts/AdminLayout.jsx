import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FileSpreadsheet, LayoutDashboard, LogOut, Menu, Upload, X } from 'lucide-react'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { useAuth } from '../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/results', label: 'Results', icon: FileSpreadsheet },
  { to: '/results/upload', label: 'Upload Result', icon: Upload },
]

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/results': 'Results',
  '/results/upload': 'Upload Result',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const title =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.includes('/students/') ? 'Student Details' : 'Result Details')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy-950 text-[#f4f1ea] transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Admin Portal</p>
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Result Analysis</h1>
            <button type="button" className="rounded-lg p-1 text-[#f4f1ea] lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/results'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[inset_3px_0_0_0_#b0893e]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate px-1 text-sm text-white">{user?.name || 'Administrator'}</p>
          <p className="truncate px-1 text-xs text-white/50">{user?.email || user?.username}</p>
          <button
            type="button"
            onClick={() => setConfirmLogout(true)}
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-card/90 px-4 py-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-line bg-white p-2 text-navy-800 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">HPT / RYK College</p>
              <h2 className="text-lg font-bold text-ink">{title}</h2>
            </div>
          </div>
          <div className="hidden rounded-full border border-line bg-white px-3 py-1.5 text-sm text-muted sm:block">
            {user?.name}
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Sign out"
        message="Are you sure you want to logout of the Result Analysis Portal?"
        confirmLabel="Logout"
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  )
}
