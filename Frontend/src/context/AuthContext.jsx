import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "fasal-setu-auth-users";
const AUTH_ROLES = ["farmer", "govt", "admin"];

const restoreAuthenticatedUsers = () => {
  try {
    const savedUsers = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!savedUsers) return {};

    const parsedUsers = JSON.parse(savedUsers);
    if (!parsedUsers || typeof parsedUsers !== "object") return {};

    return Object.fromEntries(
      AUTH_ROLES.flatMap((role) => {
        const user = parsedUsers[role];
        const id = user?.id || user?._id;
        if (!id) return [];

        return [
          [
            role,
            {
              id: String(id),
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              role: user.role,
            },
          ],
        ];
      })
    );
  } catch (error) {
    console.error("Failed to restore the current session:", error);
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(restoreAuthenticatedUsers);

  useEffect(() => {
    const persistedUsers = Object.fromEntries(
      AUTH_ROLES.flatMap((role) => {
        const user = users[role];
        if (!user) return [];

        return [
          [
            role,
            {
              id: user.id || user._id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              role: user.role,
            },
          ],
        ];
      })
    );

    try {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(persistedUsers)
      );
    } catch (error) {
      console.error("Failed to save the current session:", error);
    }
  }, [users]);

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