import {
  Box, Button, Card, CardActions, CardContent,
  CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, MenuItem, Select, Typography,
  Snackbar, Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";

const API_URL = "https://tchopshap.onrender.com/livreur";

function LivreurUpload() {
  const [livreurs, setLivreurs] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentLivreur, setCurrentLivreur] = useState(null);
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔔 Nouveaux états pour Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "success", // "error", "info", "warning"
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ message, severity });
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setLivreurs(res.data);
        console.log("Livreurs récupérés :", res.data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement :", err);
        showSnackbar("Erreur lors du chargement des livreurs", "error");
      });
  }, []);

  const handleEdit = (livreur) => {
    setCurrentLivreur(livreur);
    setStatut(livreur.statut);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setLivreurs(prev => prev.filter(l => l.idLivreur !== id));
      showSnackbar("Livreur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      showSnackbar("Erreur lors de la suppression", "error");
    }
  };

  const handleSubmit = async () => {
    if (!currentLivreur) return;

    setLoading(true);

    const updated = {
      nom: currentLivreur.nom,
      prenom: currentLivreur.prenom,
      telephone: currentLivreur.numeroDeTel,
      type_de_vehicule: currentLivreur.typeDeVehicule,
      statut: statut
    };

    try {
      const res = await axios.put(`${API_URL}/${currentLivreur.idLivreur}`, updated);
      console.log("Livreur modifié :", res.data);

      setLivreurs(prev =>
        prev.map(l => l.idLivreur === currentLivreur.idLivreur ? { ...l, statut } : l)
      );
      showSnackbar("Statut mis à jour !");
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      showSnackbar("Erreur lors de la mise à jour", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Liste des Livreurs</Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }
        }}
      >
        {livreurs.map((livreur) => (
          <motion.div
            key={livreur.idLivreur}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {livreur.nom} {livreur.prenom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Statut : {livreur.statut}
                </Typography>
                <Typography variant="body2">
                  Véhicule : {livreur.typeDeVehicule}
                </Typography>
                <Typography variant="body2">
                  Téléphone : {livreur.numeroDeTel}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(livreur)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(livreur.idLivreur)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* MODALE de modification */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Modifier le statut</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {currentLivreur?.nom} {currentLivreur?.prenom}
          </Typography>
          <Select
            fullWidth
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="disponible">Disponible</MenuItem>
            <MenuItem value="occupé">Occupé</MenuItem>
          </Select>

          {loading && (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress size={24} sx={{ color: "orange" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar d'information */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LivreurUpload;



