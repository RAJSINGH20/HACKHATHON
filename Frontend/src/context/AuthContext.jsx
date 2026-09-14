import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState({});

  const setAuthenticatedUser = (role, user) => {
    setUsers((current) => ({ ...current, [role]: user }));
  };

  const updateAuthenticatedUser = (role, user) => {
    setUsers((current) => ({ ...current, [role]: { ...current[role], ...user } }));
  };

  return (
    <AuthContext.Provider
      value={{ users, setAuthenticatedUser, updateAuthenticatedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};