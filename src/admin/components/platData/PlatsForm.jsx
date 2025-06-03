import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

function PlatsForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    details: '',
    image: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nom: '', prix: '', details: '', image: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
    useEffect(() => {
      const userId = localStorage.getItem("userId");
      console.log("ID utilisateur récupéré du localStorage:", userId);
      setFormData(prev => ({
        ...prev,
        idUtilisateur: userId
      }));
    }, []);

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
      const response = await axios.post("https://tchopshap.onrender.com/plat", formData);
      console.log("Plat ajouté avec succès:", response.data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du plat:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter un plat
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un nouveau plat</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="nom"
              label="Nom du plat"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="prix"
              label="Prix"
              type="number"
              value={formData.prix}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="details"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
            />

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

export default PlatsForm;
