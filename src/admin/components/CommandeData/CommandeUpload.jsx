import {
  Box, Button, Card, CardActions, CardContent,
  CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, MenuItem, TextField, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import AdminLayout from "../AdminLayout";

function CommandeUpload() {
  const [commandes, setCommandes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [open, setOpen] = useState(false);
  const [currentCommande, setCurrentCommande] = useState(null);
  const [form, setForm] = useState({ statut: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("https://tchopshap.onrender.com/commande")
      .then(res => setCommandes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tchopshap.onrender.com/commande/${id}`);
      setCommandes(commandes.filter(c => c.idCommande !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (commande) => {
    setCurrentCommande(commande);
    setForm({ statut: commande.statut });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("Commande modifiée à envoyer :", { statut: form.statut }); // pour debug

      await axios.put(
        `https://tchopshap.onrender.com/commande/${currentCommande.idCommande}`,
        { statut: form.statut } // ✅ Ligne modifiée : on n'envoie que le statut
      );

      // Mettre à jour localement
      setCommandes(commandes.map(c =>
        c.idCommande === currentCommande.idCommande
          ? { ...c, statut: form.statut }
          : c
      ));

      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la modification :", error); // ✅ Ligne ajoutée pour debug
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVoirPlus = () => setVisibleCount(prev => prev + 4);
  const handleVoirMoins = () => setVisibleCount(4);

  return (
    <AdminLayout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Liste des Commandes</Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)"
          }
        }}
      >
        {commandes.slice(0, visibleCount).map((commande) => (
          <motion.div
            key={commande.idCommande}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">Commande #{commande.idCommande}</Typography>
                <Typography>Utilisateur : {commande.idUtilisateur}</Typography>
                <Typography>Plat : {commande.idPlat}</Typography>
                <Typography>Statut : <strong>{commande.statut}</strong></Typography>
                <Typography>Mode de paiement : {commande.modeDePaiement}</Typography>
                <Typography>Date : {new Date(commande.date_com).toLocaleDateString()}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(commande)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(commande.idCommande)}><DeleteIcon color="error" /></IconButton>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </Box>

      <Box mt={4} textAlign="center">
        {visibleCount < commandes.length ? (
          <Button variant="outlined" onClick={handleVoirPlus}>Voir plus</Button>
        ) : commandes.length > 4 ? (
          <Button variant="outlined" onClick={handleVoirMoins}>Voir moins</Button>
        ) : null}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Modifier le Statut</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Statut"
            name="statut"
            fullWidth
            margin="dense"
            value={form.statut}
            onChange={handleChange}
          >
            <MenuItem value="en préparation">En préparation</MenuItem>
            <MenuItem value="en cours de livraison">En cours de livraison</MenuItem>
            <MenuItem value="livrée">Livrée</MenuItem>
            <MenuItem value="annulée">Annulée</MenuItem>
          </TextField>
          {loading && (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress sx={{ color: "orange" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">Modifier</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </AdminLayout>
  );
}

export default CommandeUpload;


