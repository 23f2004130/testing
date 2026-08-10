import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingAuth(false);
      return;
    }

    getCurrentUser()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  const login = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await loginUser(credentials);
      const accessToken = response.data?.access_token;
      if (!accessToken) {
        throw new Error("Missing access token in login response.");
      }

      localStorage.setItem("token", accessToken);
      const userResponse = await getCurrentUser();
      setUser(userResponse.data);
      return userResponse.data;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (data) => {
    setAuthLoading(true);
    try {
      await registerUser(data);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingAuth,
        authLoading,
        login,
        logout,
        register,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
