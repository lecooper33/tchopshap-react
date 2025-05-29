import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
function SignUp() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://tchopshap.onrender.com/inscription', {
        nom,
        email,
        password,
        role,
      });

      const data = response.data;
      setSnack({ open: true, message: data.message, severity: 'success' });

      if (data.requiresOtpVerification) {
        setTimeout(() => {
          navigate('/otp', { state: { email, role } });
        }, 2000);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Erreur lors de l'inscription.";
      setSnack({ open: true, message: errMsg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  return (
    <div>
      <Header/>
  
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Créez votre compte
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            select
            label="Rôle"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="administrateur">Administrateur</MenuItem>
          </TextField>

          <Button 
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, py: 1.5, backgroundColor:"orange" }}
          >
            {loading ? <CircularProgress size={24} color="orange" /> : "S'inscrire"}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
    <Footer/>
      </div>
  );
}

export default SignUp;

