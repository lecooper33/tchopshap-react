import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box,
  Avatar, IconButton, Paper
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../context/AuthContext'; // Assurez-vous d'avoir un AuthContext
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios'; // Importez axios pour les requêtes HTTP

const EditProfil = () => {
  // Utilisez le contexte d'authentification pour accéder aux informations de l'utilisateur et à la fonction de mise à jour du profil
  const { user, updateUserProfile } = useAuth();
  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // État local pour les données du formulaire, initialisé avec les données de l'utilisateur actuel
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    numeroDeTel: user?.numeroDeTel || '',
    // Il est généralement déconseillé de pré-remplir le mot de passe pour des raisons de sécurité
    password: '',
    currentPassword: '', // Pour la confirmation du changement de mot de passe
  });

  // État local pour le fichier image sélectionné
  const [imageFile, setImageFile] = useState(null);
  // État local pour l'aperçu de l'image, utilise l'image de l'utilisateur ou une image par défaut
  const [imagePreview, setImagePreview] = useState(user?.image || 'https://via.placeholder.com/150');
  // État pour gérer l'état de téléchargement de l'image
  const [uploading, setUploading] = useState(false);

  // Gère les changements dans les champs de texte du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gère la sélection d'un fichier image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crée une URL d'objet pour l'aperçu de l'image
      setImagePreview(URL.createObjectURL(file));
      // Appelle la fonction de téléchargement d'image immédiatement après la sélection
      handleImageUpload([file]);
    }
  };

  // Gère le téléchargement de l'image vers Cloudinary
  const handleImageUpload = async (acceptedFiles) => {
    setUploading(true); // Indique que le téléchargement est en cours
    const file = acceptedFiles[0];
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'tchopshap'); // Votre "upload preset" Cloudinary
    form.append('cloud_name', 'dwhqa7huy'); // Votre nom de cloud Cloudinary

    try {
      console.log('Début du téléchargement de l\'image vers Cloudinary...');
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dwhqa7huy/image/upload`,
        form
      );
      console.log('Réponse de Cloudinary :', response.data);
      // Met à jour le formData avec l'URL sécurisée de l'image téléchargée
      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
      console.log('URL de l\'image mise à jour dans le formData :', response.data.secure_url);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image vers Cloudinary :', error);
      alert('Échec du téléchargement de l\'image. Veuillez réessayer.');
    } finally {
      setUploading(false); // Le téléchargement est terminé
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

    try {
      // Prépare les données pour l'appel API.
      // Si vous utilisez une API RESTful qui attend du JSON, convertissez FormData en un objet JSON.
      // Si l'API attend un FormData (par exemple, pour des fichiers), conservez-le.
      // Pour cet exemple, nous allons envoyer un objet JSON car les données de l'API sont des objets.
      // Cependant, si votre API est configurée pour recevoir un FormData pour l'image, vous devrez ajuster cela.

      const dataToUpdate = {
        nom: formData.nom,
        email: formData.email,
        numeroDeTel: formData.numeroDeTel,
        image: formData.image, // L'URL de l'image de Cloudinary
      };

      // Si le mot de passe est fourni, incluez-le ainsi que le mot de passe actuel
      if (formData.password) {
        dataToUpdate.password = formData.password;
        dataToUpdate.currentPassword = formData.currentPassword; // Envoyez le mot de passe actuel pour vérification côté serveur
      }

      console.log('Données à envoyer pour la mise à jour du profil :', dataToUpdate);

      // Assurez-vous que l'ID utilisateur est disponible pour la requête PATCH
      if (!user || !user.idUtilisateur) {
        console.error("ID utilisateur non disponible. Impossible de mettre à jour le profil.");
        alert("ID utilisateur non disponible. Impossible de mettre à jour le profil.");
        return;
      }

      // Appel à l'API backend pour mettre à jour le profil
      // Utilisez une requête PATCH pour mettre à jour partiellement la ressource utilisateur
      const apiUrl = `https://tchopshap.onrender.com/utilisateurs/${user.idUtilisateur}`;
      console.log('Envoi de la requête PATCH à :', apiUrl);
      const response = await axios.patch(apiUrl, dataToUpdate);
      console.log('Réponse de l\'API lors de la mise à jour du profil :', response.data);

      // Si la mise à jour est réussie, mettez à jour le contexte d'authentification
      // et redirigez l'utilisateur.
      await updateUserProfile(response.data); // Mettez à jour le contexte avec les nouvelles données de l'utilisateur
      alert('Profil mis à jour avec succès !');
      navigate('/Profil'); // Redirige vers la vue du profil ou la page d'accueil
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      // Affichez un message d'erreur plus détaillé si possible
      if (error.response) {
        // L'API a répondu avec un statut d'erreur
        console.error('Données d\'erreur de l\'API :', error.response.data);
        console.error('Statut d\'erreur de l\'API :', error.response.status);
        alert(`Échec de la mise à jour du profil : ${error.response.data.message || 'Veuillez réessayer.'}`);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue du serveur.');
        alert('Échec de la mise à jour du profil. Pas de réponse du serveur.');
      } else {
        // Quelque chose d'autre s'est mal passé
        console.error('Erreur :', error.message);
        alert('Échec de la mise à jour du profil. Veuillez réessayer.');
      }
    }
  };

  return (
    <div>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'orange', fontWeight: 'bold' }}>
            Modifier le Profil
          </Typography>

          <Box sx={{ mb: 3, position: 'relative' }}>
            <Avatar
              src={imagePreview}
              sx={{ width: 120, height: 120, border: '2px solid orange' }}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'orange',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkorange',
                },
              }}
            >
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              <PhotoCamera />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nom"
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              sx={{ '& label.Mui-focused': { color: 'orange' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'orange' } } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ '& label.Mui-focused': { color: 'orange' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'orange' } } }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="numeroDeTel"
              label="Numéro de Téléphone"
              name="numeroDeTel"
              value={formData.numeroDeTel}
              onChange={handleChange}
              sx={{ '& label.Mui-focused': { color: 'orange' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'orange' } } }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="currentPassword"
              label="Mot de passe actuel (pour changer le mot de passe)"
              type="password"
              id="currentPassword"
              autoComplete="current-password"
              value={formData.currentPassword}
              onChange={handleChange}
              sx={{ '& label.Mui-focused': { color: 'orange' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'orange' } } }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Nouveau Mot de passe"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ '& label.Mui-focused': { color: 'orange' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'orange' } } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
              disabled={uploading} // Désactive le bouton pendant le téléchargement de l'image
            >
              {uploading ? 'Téléchargement de l\'image...' : 'Sauvegarder les modifications'}
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default EditProfil;