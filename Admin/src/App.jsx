import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard.jsx'
import AdminRegistration from './Components/Registration/AdminRegistration.jsx'
import GovtRegistration from './Components/Registration/GovtRegistration.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin-register" element={<AdminRegistration />} />
      <Route path="/govt-register" element={<GovtRegistration />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
