import React, { useState } from "react";
import {
  Box, Button, Checkbox, FormControlLabel, Link,
  TextField, Typography, Paper, Grid, IconButton, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Profil() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectAfterLogin = location.state?.redirectAfterLogin || "/";
  const { login } = useAuth();

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

      console.log(" Réponse serveur :", response.data);

      const { token, userId, role, verified } = response.data;

      if (!token || !userId || !role) {
        setErrors((prev) => ({ ...prev, general: "Connexion échouée : données manquantes." }));
        console.error(" Données manquantes dans la réponse :", response.data);
        return;
      }

      const user = { id: userId, role, verified };

     if (rememberMe){
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
     } else {
      sessionStorage.setItem("token", token)
     }

     axios.defaults.headers.common["Authorization"]= `Bearer ${token}`;
     login(user);

      if (role === "administrateur") {
        navigate("/admin");
      } else {
        navigate(redirectAfterLogin);
      }
    } catch (error) {
      console.error(" Erreur lors de la connexion :", error);

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
    <div>
      <Header />
      <Box
        sx={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Connexion
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary" mb={2}>
            Connectez-vous pour accéder à votre compte
          </Typography>

          {errors.general && (
            <Typography variant="body2" textAlign="center" color="error" mb={2}>
              {errors.general}
            </Typography>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" mb={0.5}>
              Adresse e-mail
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="votre@email.com"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              required
            />

            <Grid container justifyContent="space-between" alignItems="center" mt={2} mb={0.5}>
              <Grid item>
                <Typography variant="body2">Mot de passe</Typography>
              </Grid>
              <Grid item>
                <Link href="#" fontSize={13} underline="hover">
                  Mot de passe oublié ?
                </Link>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Afficher ou masquer le mot de passe"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: showPassword ? "#ff6600" : "inherit",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              }
              label="Se souvenir de moi"
              sx={{ mt: 1 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#ff6600",
                ":hover": { backgroundColor: "#e65c00" },
                fontWeight: "bold",
                textTransform: "none",
              }}
              type="submit"
            >
              Se connecter
            </Button>

            <Typography variant="body2" textAlign="center" mt={2}>
              Vous n’avez pas de compte ?{" "}
              <Link href="/inscription" underline="hover" color="orange">
                S’inscrire
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
      <Footer />
    </div>
  );
}






