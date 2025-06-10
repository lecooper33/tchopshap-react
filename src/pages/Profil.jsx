import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Typography, Alert,
  FormControlLabel, Checkbox,
  InputAdornment, // Ajouté
  IconButton,     // Ajouté
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Ajouté
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext"; // ✅

function Profil() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nouvel état
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅
  const location = useLocation();

  const handleClickShowPassword = () => setShowPassword((show) => !show); // Nouvelle fonction

  const handleMouseDownPassword = (event) => { // Nouvelle fonction
    event.preventDefault();
  };

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

      // Récupérer les détails de l'utilisateur avec son l'ID
      const userResponse = await axios.get(`https://tchopshap.onrender.com/utilisateurs`);
      const users = userResponse.data;

      const user = users.find(u => u.idUtilisateur === data.userId);

      if (user) {
        const userData = {
          token: data.token,
          userId: data.userId,
          role: data.role,
          nom: user.nom,
          email: user.email,
        };

        login(userData); //  Stocker dans le contexte
        setMessage(data.message);

        const redirectPath = location.state?.from || (userData.role === "administrateur" ? "/admin" : "/")
        navigate(redirectPath);
      } else {
        throw new Error("Utilisateur non trouvé.");
      }

    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || 'Problème de connexion au serveur.');
    }
  };

  return (
    <div>
      <Header />
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
          Connexion
        </Typography>
        <Typography align="center" color="text.secondary">
          Connectez-vous pour accéder à votre compte
        </Typography>

        <Box sx={{ bgcolor: '#e6f0ff', p: 2, borderRadius: 1, fontSize: '14px', color: '#333' }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Info démo :
          </Typography>
          <Typography>
            Utilisez email : <b>user@example.com</b>, mot de passe : <b>password</b>
          </Typography>
        </Box>

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

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold" sx={{ fontSize: '14px' }}>
            Mot de passe
          </Typography>
          <Link
            to="#"
            style={{ textDecoration: 'none', color: 'orange' }}
          >
            Mot de passe oublié ?
          </Link>
        </Box>

        {/* Champ mot de passe avec l'œil */}
        <TextField
          placeholder='Votre mot de passe'
          type={showPassword ? 'text' : 'password'} // Type dynamique
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{ // Ajouté InputProps
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={<Checkbox size="small" />}
          label="Se souvenir de moi"
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: '#f97316', '&:hover': { bgcolor: '#fb923c' }, mt: 1 }}
        >
          Se connecter
        </Button>

        {message && (
          <Alert severity={error ? 'error' : 'success'}>
            {message}
          </Alert>
        )}

        <Typography align="center" fontSize={14}>
          Vous n’avez pas de compte ?{' '}
          <Link to="/signup" style={{ color: 'orange', textDecoration: 'none' }}>
            S’inscrire
          </Link>
        </Typography>
      </Box>
      <Footer />
    </div>
  );
}

export default Profil;








