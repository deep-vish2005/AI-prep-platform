import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("devprep-token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        localStorage.removeItem("devprep-token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function register(formData) {
    const response = await api.post("/auth/register", formData);

    localStorage.setItem("devprep-token", response.data.token);
    setUser(response.data.user);

    return response.data;
  }

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);

    localStorage.setItem("devprep-token", response.data.token);
    setUser(response.data.user);

    return response.data;
  }

  function logout() {
    localStorage.removeItem("devprep-token");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
