import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box, Button, Typography, TextField, Divider, IconButton, 
  Paper, List, ListItem, ListItemText, Avatar, Chip,
  CircularProgress, useMediaQuery, ThemeProvider, createTheme
} from '@mui/material';
import { orange, deepOrange, grey } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: deepOrange[500],
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

export default function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: user?.nom || "", email: user?.email || "", password: "" });
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      axios.get(`https://tchopshap.onrender.com/commande/${user.id}`)
        .then(res => {
          setCommandes(res.data);
          setLoading(false);
        })
        .catch(() => {
          setCommandes([]);
          setLoading(false);
        });
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://tchopshap.onrender.com/utilisateurs/${user.id}`, form);
      if (form.password) {
        setMessage({ text: "Changement effectué ! Veuillez valider le code OTP envoyé à votre email pour vérifier votre compte.", type: "success" });
        setTimeout(() => {
          setMessage({ text: "", type: "" });
          navigate("/otp");
        }, 3000);
      } else {
        setMessage({ text: "Informations mises à jour avec succès !", type: "success" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      }
    } catch {
      setMessage({ text: "Erreur lors de la mise à jour", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      try {
        await axios.delete(`https://tchopshap.onrender.com/utilisateurs/${user.id}`);
        logout();
      } catch {
        setMessage({ text: "Erreur lors de la suppression", type: "error" });
      }
    }
  };

  const goHome = () => {
    window.location.href = "/";
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        maxWidth={800} 
        mx="auto" 
        my={isMobile ? 2 : 4}
        px={isMobile ? 1 : 4}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: isMobile ? 2 : 4, 
            borderRadius: 3, 
            background: 'linear-gradient(to bottom, #fff9f2, #ffffff)',
            boxShadow: '0 8px 32px rgba(255, 152, 0, 0.1)'
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" mb={4}>
            <IconButton 
              onClick={goHome} 
              sx={{ 
                mr: 2,
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              color="primary.main" 
              fontWeight={700} 
              sx={{ 
                textTransform: 'uppercase',
                letterSpacing: 1,
                background: 'linear-gradient(to right, #ff9800, #ff6d00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Mon Espace Client
            </Typography>
          </Box>

          {/* User Profile Section */}
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={4}>
            {/* Profile Form */}
            <Box flex={1}>
              <Box 
                display="flex" 
                alignItems="center" 
                mb={3}
                gap={2}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 56, 
                    height: 56,
                    fontSize: 24,
                    fontWeight: 700
                  }}
                >
                  {user?.nom?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {user?.nom}
                </Typography>
              </Box>

              <Box 
                component="form" 
                onSubmit={handleUpdate} 
                display="flex" 
                flexDirection="column" 
                gap={3}
              >
                <TextField 
                  label="Nom complet" 
                  name="nom" 
                  value={form.nom} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  variant="outlined" 
                  InputProps={{ 
                    sx: { 
                      borderRadius: 2,
                      background: '#fff',
                    } 
                  }} 
                />

                <TextField 
                  label="Email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  type="email" 
                  fullWidth 
                  variant="outlined" 
                  InputProps={{ 
                    sx: { 
                      borderRadius: 2,
                      background: '#fff',
                    } 
                  }} 
                />

                <TextField 
                  label="Nouveau mot de passe" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  type={showPassword ? "text" : "password"} 
                  fullWidth 
                  variant="outlined" 
                  InputProps={{ 
                    sx: { 
                      borderRadius: 2,
                      background: '#fff',
                    },
                    endAdornment: (
                      <IconButton 
                        onClick={() => setShowPassword(v => !v)} 
                        edge="end"
                        sx={{ color: grey[600] }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    )
                  }} 
                />

                {message.text && (
                  <Typography 
                    sx={{ 
                      color: message.type === "error" ? "error.main" : "success.main",
                      fontWeight: 600,
                      textAlign: 'center',
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      bgcolor: message.type === "error" ? '#ffebee' : '#e8f5e9'
                    }}
                  >
                    {message.text}
                  </Typography>
                )}

                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
                    '&:hover': { 
                      boxShadow: '0 6px 16px rgba(255, 152, 0, 0.3)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Mettre à jour mon profil
                </Button>
              </Box>
            </Box>

            {/* Command History */}
            <Box flex={1}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                mb={3}
                color="text.primary"
                sx={{
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '50px',
                    height: '4px',
                    bgcolor: 'primary.main',
                    borderRadius: 2
                  }
                }}
              >
                Mes Commandes
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress color="primary" />
                </Box>
              ) : commandes.length === 0 ? (
                <Box 
                  textAlign="center" 
                  py={4}
                  sx={{
                    background: '#fafafa',
                    borderRadius: 2,
                    border: `1px dashed ${grey[300]}`
                  }}
                >
                  <Typography color="text.secondary">
                    Aucune commande trouvée.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
                  {commandes.map(cmd => (
                    <ListItem 
                      key={cmd.idCommande} 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={600} color="text.primary">
                              Commande #{cmd.idCommande}
                            </Typography>
                            <Chip 
                              label={cmd.statut} 
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                bgcolor: cmd.statut === 'livrée' ? '#e8f5e9' : '#fff3e0',
                                color: cmd.statut === 'livrée' ? '#2e7d32' : 'primary.dark'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            {formatDate(cmd.dateCommande)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>

          {/* Delete Account Section */}
          <Divider sx={{ my: 4, borderColor: grey[200] }} />
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" mb={2}>
              Vous souhaitez quitter notre plateforme ?
            </Typography>
            <Button 
              onClick={handleDelete} 
              variant="outlined" 
              startIcon={<DeleteIcon />}
              sx={{ 
                color: 'error.main',
                borderColor: grey[300],
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                '&:hover': { 
                  borderColor: 'error.main',
                  bgcolor: '#ffebee'
                }
              }}
            >
              Supprimer mon compte
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}