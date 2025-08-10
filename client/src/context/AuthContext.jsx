import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({ email: decodedUser.email, role: decodedUser.role });
        } else {
          localStorage.removeItem("token"); // Clean up expired token
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    setUser({ email: decodedUser.email, role: decodedUser.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
