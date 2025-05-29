import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';

function Otp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [chargement, setChargement] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const role = location.state?.role || 'client';

  useEffect(() => {
    if (!email) {
      setMessage("Email non fourni. Veuillez vous inscrire d'abord.");
      setTimeout(() => {
        navigate('/signup');
      }, 2000);
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setChargement(true);

    if (!email) {
      setError("L'email est requis pour la vérification OTP.");
      setChargement(false);
      return;
    }

    try {
      const response = await axios.post('https://tchopshap.onrender.com/verifier-otp', {
        email,
        otp,
      });
      console.log('Réponse API verifier-otp:', response.data);
      setMessage(`Compte vérifié. Redirection vers ${role === 'administrateur' ? 'le tableau de bord admin' : 'l’accueil'}...`);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);

      // 
      setTimeout(() => {
        navigate(role === 'administrateur' ? '/admin' : '/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la vérification OTP.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Entrez votre code OTP pour vérification
        </Typography>

        {email && (
          <Typography variant="body1" gutterBottom>
            Un code OTP a été envoyé à : <strong>{email}</strong>
          </Typography>
        )}

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Typography>Code OTP</Typography>
          <TextField
            placeholder='Code OTP à 4 chiffres'
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 4 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, bgcolor: 'orange' }}
            disabled={chargement}
          >
            {chargement ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : ("Vérifier")}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Otp;
