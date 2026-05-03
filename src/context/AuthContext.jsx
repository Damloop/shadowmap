// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, me as meService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await meService(token);
        setUser(data);
      } catch (error) {
        console.error("Error en checkAuth:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginService({ email, password });
    // asumiendo que el backend devuelve { token, user }
    const receivedToken = data.token;
    const receivedUser = data.user || null;

    setToken(receivedToken);
    localStorage.setItem("token", receivedToken);
    setUser(receivedUser);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}