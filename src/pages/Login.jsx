import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Avatar,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom'; // 👉 à ajouter
import Header from '../components/Header';
import Footer from '../components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
  },
});

export default function LoginForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate(); // 👉 Hook de navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Exemple de logique simple : on considère que l'utilisateur n'a pas encore de compte
    const utilisateurExiste = false;

    if (!utilisateurExiste) {
      console.log("Nouvel utilisateur :", formData);
      navigate("/Confirmation"); // ✅ Redirection après inscription
    } else {
      // autre cas (non utilisé ici)
      console.log("L'utilisateur a déjà un compte.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <RestaurantIcon />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={'bold'} color={'#ff9800'}>
              Inscription
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Adresse Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Numero de Telephone"
                name="telephone" 
                value={formData.telephone}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: 'white',
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#e68900' },
                }}
              >
                S'inscrire
              </Button>
            </Box>
          </Box>
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

