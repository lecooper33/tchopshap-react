// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

// Crée le contexte
const AuthContext = createContext();

// Crée le provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = { token, userId, nom, role, ... }

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  try {
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  } catch (error) {
    console.error("Erreur lors du parsing du user localStorage:", error);
    localStorage.removeItem("user"); // Nettoyage en cas de donnée corrompue
  }
}, []);


  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte
export const useAuth = () => useContext(AuthContext);

