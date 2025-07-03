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
import Dropzone from "react-dropzone";

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
  const [form, setForm] = useState({
    nom: user?.nom || "",
    email: user?.email || "",
    numeroDeTel: user?.numeroDeTel || "",
    password: ""
  });
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [image, setImage] = useState(user?.image || "");
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      // Récupérer les infos utilisateur (dont l'image) depuis l'API
      axios.get(`https://tchopshap.onrender.com/utilisateurs/${user.id}`)
        .then(res => {
          if (res.data && res.data.image) {
            setImage(res.data.image);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      // Récupérer les commandes
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

  const handleImageUpload = async (acceptedFiles) => {
    setUploading(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tchopshap');
    formData.append('cloud_name', 'dwhqa7huy');
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwhqa7huy/image/upload',
        formData
      );
      setImage(response.data.secure_url);
    } catch (error) {
      alert('Erreur lors du téléchargement de la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    // Préparer uniquement les champs modifiés
    const updatedFields = {};
    if (form.nom && form.nom !== user?.nom) updatedFields.nom = form.nom;
    if (form.email && form.email !== user?.email) updatedFields.email = form.email;
    if (form.numeroDeTel && form.numeroDeTel !== user?.numeroDeTel) updatedFields.numeroDeTel = form.numeroDeTel;
    if (form.password) updatedFields.password = form.password;
    if (image && image !== user?.image) updatedFields.image = image;
    if (Object.keys(updatedFields).length === 0) {
      setMessage({ text: "Aucune modification détectée.", type: "info" });
      return;
    }
    try {
      console.log('PUT vers:', `https://tchopshap.onrender.com/utilisateurs/${user.id}`);
      console.log('Données envoyées:', updatedFields);
      await axios.put(`https://tchopshap.onrender.com/utilisateurs/${user.id}`, updatedFields);
      setMessage({ text: "Informations mises à jour avec succès !", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error('Erreur lors du PUT:', err);
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
              <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Avatar
                  src={image || user?.image || undefined}
                  sx={{
                    bgcolor: 'primary.main',
                    width: 90,
                    height: 90,
                    fontSize: 36,
                    fontWeight: 700,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(255,152,0,0.15)',
                    mr: 2
                  }}
                >
                  {!(image || user?.image) && user?.nom?.charAt(0).toUpperCase()}
                </Avatar>
                <Dropzone onDrop={handleImageUpload} accept={{'image/*': []}} multiple={false}>
                  {({ getRootProps, getInputProps }) => (
                    <Box {...getRootProps()} sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <input {...getInputProps()} />
                      <Typography variant="caption" color="primary" display="block" textAlign="center">
                        {uploading ? 'Téléchargement...' : 'Changer la photo'}
                      </Typography>
                    </Box>
                  )}
                </Dropzone>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {user?.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.numeroDeTel}
                  </Typography>
                </Box>
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
                  label="Numéro de téléphone" 
                  name="numeroDeTel" 
                  value={form.numeroDeTel || ''} 
                  onChange={handleChange} 
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
                <>
                  <List sx={{ maxHeight: 300, overflow: 'auto', pr: 1 }}>
                    {commandes.slice(0, 3).map(cmd => (
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
                  <Box textAlign="right" mt={1}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      sx={{ fontWeight: 600, borderRadius: 2 }}
                      onClick={() => navigate('/MesCommandes')}
                    >
                      Voir tout l'historique
                    </Button>
                  </Box>
                </>
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