import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check whether the existing token is still valid
  const getMe = async () => {
    const storedToken = localStorage.getItem("token");

    // No token → user is not logged in
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      // Axios interceptor automatically adds:
      // Authorization: Bearer <token>
      const { data } = await api.get("/auth/me");
      // console.log(data,"session data")
      setUser(data.user);
      setToken(storedToken);
    } catch (err) {
      console.error("Failed to get User:", err);

      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);
//Login
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };
//Signup
const signup = async (name,email, password) => {
    const { data } = await api.post("/auth/signup", {
      name,email,password
    });

    localStorage.setItem("token", data.token);

    //setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  const logout = async () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getMe,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}