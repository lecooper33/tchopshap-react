import React, { useState } from "react";
import {
  Box, Button, Paper, TextField, Typography,
  Radio, RadioGroup, FormControlLabel, FormLabel,
  Snackbar, Alert, IconButton, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nom, email, password, role } = formData;

    if (!nom || !email || !password || !role) {
      return setSnackbar({ open: true, message: "❌ Tous les champs sont obligatoires.", severity: "error" });
    }

    if (password.length < 6) {
      return setSnackbar({ open: true, message: "❌ Le mot de passe doit contenir au moins 6 caractères.", severity: "error" });
    }

    setLoading(true);

    try {
      const res = await axios.post("https://tchopshap.onrender.com/inscription", {
        nom,
        email: email.trim(),
        password: password.trim(),
        role
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      // ✅ Toujours enregistrer l’email de l’utilisateur
      localStorage.setItem("emailUtilisateur", email.trim());
      console.log("Email enregistré dans localStorage :", email.trim());

      setSnackbar({
        open: true,
        message: "✅ Inscription réussie ! Un code OTP a été envoyé à votre e-mail.",
        severity: "success"
      });

      setFormData({ nom: "", email: "", password: "", role: "" });

      setTimeout(() => {
        navigate("/otp", { state: { email } });
      }, 2000);

    } catch (err) {
      const message = err?.response?.data?.message || "❌ Une erreur est survenue lors de l'inscription.";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Inscription
        </Typography>
        <form  required  onSubmit={handleSubmit}>
          <TextField name="nom" label="Nom" fullWidth sx={{ mb: 2 }} value={formData.nom} onChange={handleChange} required />
          <TextField name="email" label="E-mail" type="email" fullWidth sx={{ mb: 2 }} value={formData.email} onChange={handleChange} required />
          <TextField
            name="password"
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            fullWidth sx={{ mb: 2 }}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <FormLabel component="legend" sx={{ mt: 2 }}>Quel est votre rôle ?</FormLabel>
          <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
            <FormControlLabel value="client" control={<Radio />} label="Client" />
            <FormControlLabel value="administrateur"  control={<Radio />} label="Administrateur" />
          </RadioGroup>

          <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "orange" }} disabled={loading}>
              {loading ? "En cours..." : "Créer un compte"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignUp;



