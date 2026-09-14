import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ role, children }) {
  const { users } = useAuth();

  if (!users[role]) {
    return <Navigate to={`/${role === "govt" ? "government" : role}-login`} replace />;
  }

  return children;
}

export default ProtectedRoute;