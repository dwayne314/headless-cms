import { createContext, useContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});

  async function register(userDetails) {
    let registrationStatus = {};

    try {
      await axios.post("/api/auth/register", userDetails);
      registrationStatus = { isValid: true };
    } catch (err) {
      registrationStatus = { isValid: false, errors: err.response.data };
    }

    return { ...registrationStatus };
  }

  async function login(userDetails) {
    let loginStatus = {};

    try {
      await axios.post("/api/auth/login", userDetails);
      loginStatus = { isValid: true };
      setUser(userDetails);
    } catch (err) {
      loginStatus = { isValid: false, errors: err.response.data };
    }

    return { ...loginStatus };
  }

  async function logout() {
    await axios.post("/api/auth/logout");
    const logoutStatus = { isValid: true };
    setUser({});

    return { ...logoutStatus };
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
