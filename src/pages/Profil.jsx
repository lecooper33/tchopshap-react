import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {
  Box, Button, Checkbox, FormControlLabel, Link,
  TextField, Typography, Paper, Grid
} from "@mui/material";

export default function Profil() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const redirectAfterLogin = location.state?.redirectAfterLogin || "/Confirmation";

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = "L'adresse e-mail est obligatoire.";
    if (!password) newErrors.password = "Le mot de passe est obligatoire.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      localStorage.setItem("isConnected", "true");
      navigate(redirectAfterLogin);
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

          <form onSubmit={handleSubmit}>
            <Typography variant="body2" mb={0.5}>Adresse e-mail</Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="votre@email.com"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
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
              type="password"
              placeholder="Votre mot de passe"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />

            <FormControlLabel
              control={<Checkbox size="small" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />}
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
              <Link href="#" underline="hover" color="orange">
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
