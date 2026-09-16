import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRegistration from './Components/Registration/AdminRegistration.jsx'
import GovtRegistration from './Components/Registration/GovtRegistration.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin-register" replace />} />
      <Route path="/admin-register" element={<AdminRegistration />} />
      <Route path="/govt-register" element={<GovtRegistration />} />
      <Route path="*" element={<Navigate to="/admin-register" replace />} />
    </Routes>
  )
}

export default App
