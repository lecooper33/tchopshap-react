import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, MenuItem
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

function LivreurForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    statut: '',
    typeDeVehicule: '',
    numeroDeTel: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      nom: '',
      prenom: '',
      statut: '',
      typeDeVehicule: '',
      numeroDeTel: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api-tchop-shap.onrender.com/api/v1/livreurs", formData);
      console.log("Livreur ajouté avec succès:", response.data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du livreur:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter un livreur
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="prenom"
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="statut"
              label="Statut"
              select
              value={formData.statut}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="disponible">Disponible</MenuItem>
              <MenuItem value="occupé">Occupé</MenuItem>
            </TextField>
            <TextField
              fullWidth
              name="typeDeVehicule"
              label="Type de véhicule"
              value={formData.typeDeVehicule}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="numeroDeTel"
              label="Numéro de téléphone"
              value={formData.numeroDeTel}
              onChange={handleChange}
              margin="normal"
              required
            />
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
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LivreurForm;
