import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography
} from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

function CategorieForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    catégorie: '',
    image: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ catégorie: '', image: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://tchopshap.onrender.com/categorie", formData);
      console.log("Catégorie ajoutée avec succès:", response.data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter une catégorie
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="catégorie"
              label="Nom de la catégorie"
              value={formData.catégorie}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* Dropzone pour l'image */}
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
                      <Box>
                        <img
                          src={formData.image}
                          alt="Aperçu"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      </Box>
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

export default CategorieForm;
