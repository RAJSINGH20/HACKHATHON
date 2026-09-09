import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {
  const storedUser = localStorage.getItem(`${role}User`);

  if (!storedUser) {
    return <Navigate to={`/${role === "govt" ? "government" : role}-login`} replace />;
  }

  return children;
}

export default ProtectedRoute;