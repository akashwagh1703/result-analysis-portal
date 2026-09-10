import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import UploadResult from '../pages/UploadResult'
import Results from '../pages/Results'
import ResultDetails from '../pages/ResultDetails'
import StudentDetails from '../pages/StudentDetails'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/upload" element={<UploadResult />} />
          <Route path="/results/:id" element={<ResultDetails />} />
          <Route path="/results/:resultId/students/:studentId" element={<StudentDetails />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
