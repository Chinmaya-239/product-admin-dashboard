"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setReady(true);
  }, []);

  function loginSuccess(newToken) {
    localStorage.setItem("token", newToken);
    // Middleware only checks that this cookie exists to protect /products
    // routes at the server/edge level; the real auth header on API calls
    // still comes from localStorage via the axios interceptor.
    document.cookie = `token=${newToken}; path=/; max-age=1800; samesite=lax`;
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, ready, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
