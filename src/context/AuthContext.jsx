// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        console.log("AuthContext: Utilisateur récupéré de localStorage:", parsedUser);
        setUser(parsedUser);
      } else {
        console.log("AuthContext: Pas d'utilisateur dans localStorage ou 'undefined'.");
      }
    } catch (error) {
      console.error("AuthContext: Erreur lors du parsing de l'utilisateur depuis localStorage:", error);
      localStorage.removeItem("user"); // Supprime les données corrompues
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    // userData doit contenir { id, nom, email, role, token }
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token); // Stocker le token séparément pour faciliter l'accès
    console.log("AuthContext: Utilisateur connecté et stocké:", userData);
    setUser(userData);
  };

  const logout = () => {
    console.log("AuthContext: Déconnexion de l'utilisateur.");
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

export const useAuth = () => useContext(AuthContext);

