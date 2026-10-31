import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ role, children }) {
  const { users } = useAuth();
  const user = users[role];
  const requiredUserRole = role === "govt" ? "government" : role;
  const userId = user?.id || user?._id;

  if (!userId || user?.role !== requiredUserRole) {
    return <Navigate to={`/${role === "govt" ? "government" : role}-login`} replace />;
  }

  return children;
}

export default ProtectedRoute;