import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, MenuItem,
  Select, InputLabel, FormControl
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
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');

  const userId = parseInt(localStorage.getItem("userId"));
  console.log("👤 userId récupéré :", userId);

  useEffect(() => {
    if (!userId) return;
    axios.get("https://tchopshap.onrender.com/restaurant")
      .then(res => {
        // Correction structure : res.data.data
        const userRestaurants = Array.isArray(res.data.data)
          ? res.data.data.filter(r => r.idUtilisateur === userId)
          : [];
        setRestaurants(userRestaurants);
      })
      .catch(err => console.error("Erreur de récupération des restaurants :", err));
  }, [userId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nom: '', prix: '', details: '', image: '' });
    setRestaurantId('');
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
    if (!restaurantId) {
      alert("Veuillez sélectionner un restaurant.");
      return;
    }
    const platData = {
      idRestaurant: parseInt(restaurantId),
      nom: formData.nom,
      prix: formData.prix,
      details: formData.details,
      image: formData.image
    };
    try {
      const response = await axios.post("https://tchopshap.onrender.com/plat", platData);
      console.log(" Plat ajouté avec succès:", response.data);
      handleClose();
    } catch (error) {
      console.error(" Erreur lors de l'ajout du plat:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter un plat
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouveau plat</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>

            {/* idRestaurant */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="restaurant-label">Restaurant</InputLabel>
           <Select
               label="restaurant-label"
               value={restaurantId}
               onChange={(e) => setRestaurantId(e.target.value)}
              >
                {restaurants.map(resto => (
                 <MenuItem key={resto.idRestaurant} value={resto.idRestaurant}>
                   {resto.nom}
                 </MenuItem>
                ))}
              </Select>

            </FormControl>

            {/* nom */}
            <TextField
              fullWidth
              name="nom"
              label="nom"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* prix */}
            <TextField
              fullWidth
              name="prix"
              label="prix"
              type="number"
              value={formData.prix}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* details */}
            <TextField
              fullWidth
              name="details"
              label="details"
              multiline
              rows={4}
              value={formData.details}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* image */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              image
            </Typography>
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

