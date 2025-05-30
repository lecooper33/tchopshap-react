import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, MenuItem
} from "@mui/material";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

function RestaurantForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    idCategorie: '',
    image: ''
  });
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Cette section charge les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://tchopshap.onrender.com/categorie");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nom: '', adresse: '', idCategorie: '', image: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cette section permet d'heberger les images sur cloudinary
  const handleImageUpload = async (acceptedFiles) => {
    setUploading(true);
    const file = acceptedFiles[0];
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'tchopshap');
    form.append('cloud_name', 'dwhqa7huy');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dwhqa7huy/image/upload`,
        form
      );
      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setUploading(false);
    }
  };

  // Cette section permet la creation d'un nouveau restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://tchopshap.onrender.com/restaurant", formData);
      console.log("Restaurant ajouté avec succès:", response.data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du restaurant:", error);
      console.log("reponse");
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter un restaurant
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un nouveau restaurant</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="nom"
              label="Nom du restaurant"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="adresse"
              label="Adresse"
              value={formData.adresse}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              select
              name="idCategorie"
              label="Catégorie"
              value={formData.idCategorie}
              onChange={handleChange}
              margin="normal"
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat.idCategorie} value={cat.idCategorie}>
                  {cat.categorie}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Dropzone onDrop={handleImageUpload}>
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <input {...getInputProps()} />
                    {uploading ? (
                      <Typography>Téléchargement en cours...</Typography>
                    ) : formData.image ? (
                      <img
                        src={formData.image}
                        alt="Aperçu"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    ) : (
                      <Typography>
                        Glissez une image ici ou cliquez pour sélectionner
                      </Typography>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={uploading}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RestaurantForm;
