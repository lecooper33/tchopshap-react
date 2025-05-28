import { Box, TextField, Typography, Paper, Button, FormControlLabel, Checkbox } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const navigate = useNavigate();

  // This function would typically be provided by your authentication context
  // or a global state management system.
  // For this example, we'll just log the user object.
  const Login = (user) => {
    console.log("User logged in:", user);
    // In a real application, you would store user data in context/global state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "L'adresse e-mail est requise." }));
      return;
    }
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Le mot de passe est requis." }));
      return;
    }

    try {
      const response = await axios.post("https://tchopshap.onrender.com/connexion", {
        email: email.trim(),
        password: password.trim(),
      });
      console.log("Réponse serveur :", response.data);

      const { token, userId, role, verified } = response.data; // Destructure directly from response.data

      if (!token || !userId || !role) {
        setErrors((prev) => ({ ...prev, general: "Connexion échouée : données manquantes." }));
        console.error("Données manquantes dans la réponse :", response.data);
        return;
      }

      const user = { id: userId, role, verified };

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role); // Store role for persistence if needed
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role); // Store role for persistence if needed
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Login(user); // Call your Login function (e.g., to update authentication context)

      // --- Redirection Logic ---
      if (role === "administrateur") {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect to Home if not an administrator
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrors((prev) => ({ ...prev, general: "E-mail ou mot de passe incorrect." }));
        } else if (error.response.data?.message) {
          setErrors((prev) => ({ ...prev, general: error.response.data.message }));
        } else {
          setErrors((prev) => ({ ...prev, general: "Erreur serveur. Réessayez plus tard." }));
        }
      } else if (error.request) {
        setErrors((prev) => ({ ...prev, general: "Impossible de joindre le serveur." }));
      } else {
        setErrors((prev) => ({ ...prev, general: "Erreur inattendue." }));
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ width: 400, p: 4 }} elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Connexion Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ mb: 2 }}
            type="email"
            label="Email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            sx={{ mb: 2 }}
            type="password"
            label="Mot de passe"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Se souvenir de moi"
            sx={{ mb: 2 }}
          />
          {errors.general && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {errors.general}
            </Typography>
          )}
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" type="submit" sx={{ backgroundColor: "orange" }}>
              Se connecter
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}