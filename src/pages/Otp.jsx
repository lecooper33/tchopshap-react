import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Snackbar, Alert, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = location.state?.email || '';
  const initialUserName = location.state?.nom || '';
  const initialUserId = location.state?.userId || ''; // Récupère l'ID passé depuis SignUp

  useEffect(() => {
    if (!email) {
      showSnackbar('Email non fourni. Veuillez vous inscrire ou vous connecter d\'abord.', 'info');
    }
  }, [email, navigate]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      showSnackbar('L\'email est requis pour la vérification OTP.', 'error');
      return;
    }
    if (!otp || otp.trim().length === 0) {
      showSnackbar('Veuillez entrer le code OTP.', 'error');
      return;
    }

    try {
      const response = await axios.post('https://tchopshap.onrender.com/verifier-otp', {
        email,
        otp: otp.trim()
      });

      const data = response.data;

      console.log("OTP: Réponse de l'API /verifier-otp:", data);

      if (response.status === 200) {
        showSnackbar(data.message || "OTP vérifié avec succès !", "success");

        // MODIFICATION CLÉ ICI :
        // On utilise 'data.IdUtilisateur' car c'est le nom de la propriété renvoyée par l'API
        const userData = {
          token: data.token,
          role: data.role,
          id: data.IdUtilisateur || initialUserId, // <-- Changé de data.userId à data.IdUtilisateur
          nom: data.nom || initialUserName, // Le nom est souvent déjà dans la réponse OTP, sinon on garde l'initial
          email: email
        };
        
        login(userData); // Connecte l'utilisateur via AuthContext

        setTimeout(() => {
          if (data.role === "administrateur") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        showSnackbar(data.message || 'Erreur lors de la vérification OTP.', "error");
      }
    } catch (error) {
      console.error("OTP: Erreur de vérification OTP ou réseau :", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Problème de connexion au serveur. Veuillez réessayer plus tard.';
      showSnackbar(errorMessage, 'error');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ p: 2, backgroundColor: '#f0f2f5' }}
    >
      <Paper elevation={6} sx={{ padding: 5, width: 400, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, color: '#333' }}>
          Vérification OTP
        </Typography>

        {email ? (
          <Typography variant="body1" align="center" sx={{ mb: 3, color: '#555' }}>
            Un code OTP a été envoyé à : <Typography component="span" fontWeight="bold">{email}</Typography>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Veuillez entrer l'email pour recevoir le code OTP.
          </Typography>
        )}

        <form onSubmit={handleVerifyOtp}>
          <TextField
            label="Code OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 4 }}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              backgroundColor: 'orange',
             
              borderRadius: 1,
            }}
          >
            Vérifier
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}