import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginApi,
  logout as logoutApi,
  getMe,
} from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    try {
      const response = await loginApi({
        email,
        password,
      });

      const data = response.data;

      sessionStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      sessionStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = sessionStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();

        setToken(savedToken);
        setUser(response.data.user);
      } catch (error) {
        sessionStorage.removeItem("token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
