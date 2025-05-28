import {
  Box, Button, Card, CardActions, CardContent,
  CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, MenuItem, TextField, Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";

function LivraisonUpload() {
  const [livraisons, setLivraisons] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [open, setOpen] = useState(false);
  const [currentLivraison, setCurrentLivraison] = useState(null);
  const [form, setForm] = useState({ statut: "" });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [livreurs, setLivreurs] = useState([]);

  useEffect(() => {
    axios.get("https://tchopshap.onrender.com/livraison")
      .then(res => setLivraisons(res.data))
      .catch(err => console.error(err));

    axios.get("https://tchopshap.onrender.com/livreur")
      .then(res => setLivreurs(res.data))
      .catch(err => console.error(err));
  }, []);

  const getNomLivreur = (idLivreur) => {
    const livreur = livreurs.find(l => l.idLivreur === idLivreur);
    return livreur ? `${livreur.nom} ${livreur.prenom}` : `ID ${idLivreur}`;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tchopshap.onrender.com/livraison/${id}`);
      setLivraisons(livraisons.filter(l => l.idLivraison !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (livraison) => {
    setCurrentLivraison(livraison);
    setForm({ statut: livraison.statut });
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSending(true);

      await axios.put(
        `https://tchopshap.onrender.com/livraison/${currentLivraison.idLivraison}`,
        { statut: form.statut }
      );

      setLivraisons(prev =>
        prev.map(l =>
          l.idLivraison === currentLivraison.idLivraison
            ? { ...l, statut: form.statut }
            : l
        )
      );

      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setSending(false);
    }
  };

  const handleVoirPlus = () => setVisibleCount(prev => prev + 4);
  const handleVoirMoins = () => setVisibleCount(4);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Liste des Livraisons</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress sx={{ color: "orange" }} />
        </Box>
      ) : (
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
          {livraisons.slice(0, visibleCount).map((livraison) => (
            <motion.div
              key={livraison.idLivraison}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">Livraison #{livraison.idLivraison}</Typography>
                  <Typography>Commande : #{livraison.idCommande}</Typography>
                  <Typography>Livreur : {getNomLivreur(livraison.idLivreur)}</Typography>
                  <Typography>Adresse : {livraison.adresseLiv}</Typography>
                  <Typography>Statut : <strong>{livraison.statut}</strong></Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleEdit(livraison)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(livraison.idLivraison)}><DeleteIcon color="error" /></IconButton>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      <Box mt={4} textAlign="center">
        {visibleCount < livraisons.length ? (
          <Button variant="outlined" onClick={handleVoirPlus}>Voir plus</Button>
        ) : livraisons.length > 4 ? (
          <Button variant="outlined" onClick={handleVoirMoins}>Voir moins</Button>
        ) : null}
      </Box>

      {/* Modale d'édition */}
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
            <MenuItem value="en cours">En cours</MenuItem>
            <MenuItem value="livrée">Livrée</MenuItem>
            <MenuItem value="annulée">Annulée</MenuItem>
          </TextField>

          {sending && (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress sx={{ color: "orange" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={sending}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LivraisonUpload;

