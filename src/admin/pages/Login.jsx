import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';


function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);

    try {
      const response = await axios.post('https://tchopshap.onrender.com/connexion', {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userRole', data.role);

      setMessage(data.message);

      if (data.role === 'administrateur') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || 'Problème de connexion au serveur.');
    }
  };

  return (
    <div>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 5,
          p: 4,
          borderRadius: 2,
          bgcolor: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center">
          Connexion Administrateur
        </Typography>
        <Typography align="center" color="text.secondary">
          Connectez-vous pour accéder à votre compte
        </Typography>


        {/* Champ Email */}
          <Typography fontWeight="bold" sx={{ fontSize: '14px' }}>
            Adresse e-mail
          </Typography>
        <TextField
          placeholder='votre@email.com'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Mot de passe + lien */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold" sx={{ fontSize: '14px' }}>
            Mot de passe
          </Typography>
          
        </Box>

        {/* Champ mot de passe */}
        <TextField
          placeholder='Votre mot de passe'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Checkbox se souvenir */}
        <FormControlLabel
          control={<Checkbox size="small" />}
          label="Se souvenir de moi"
        />

        {/* Bouton se connecter */}
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: '#f97316', '&:hover': { bgcolor: '#fb923c' }, mt: 1 }}
        >
          Se connecter
        </Button>

        {/* Message d'erreur ou succès */}
        {message && (
          <Alert severity={error ? 'error' : 'success'}>
            {message}
          </Alert>
        )}

        {/* Lien d'inscription */}
        <Typography align="center" fontSize={14}>
          Vous n’avez pas de compte ?{' '}
          <Link to="/signup" style={{ color: 'orange', textDecoration: 'none' }}>
            S’inscrire
          </Link>
        </Typography>
      </Box>
 
    </div>
  );
}

export default LoginAdmin;