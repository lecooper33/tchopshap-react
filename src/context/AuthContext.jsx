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
        // Assurer la cohérence de l'ID utilisateur
        if (parsedUser.userId && !parsedUser.id) {
          parsedUser.id = parsedUser.userId;
        } else if (parsedUser.idUtilisateur && !parsedUser.id) {
          parsedUser.id = parsedUser.idUtilisateur;
        }
        console.log("AuthContext: Utilisateur récupéré de localStorage:", parsedUser);
        setUser(parsedUser);
      } else {
        console.log("AuthContext: Pas d'utilisateur dans localStorage ou 'undefined'.");
      }
    } catch (error) {
      console.error("AuthContext: Erreur lors du parsing de l'utilisateur depuis localStorage:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    // Assurer la cohérence de l'ID utilisateur avant de stocker
    const userToStore = {
      ...userData,
      id: userData.userId || userData.idUtilisateur || userData.id
    };
    console.log("AuthContext: Stockage de l'utilisateur avec ID unifié:", userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
    localStorage.setItem("token", userToStore.token);
    setUser(userToStore);
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

