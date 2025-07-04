import {
  Box, Button, Card, CardActions, CardContent, CardMedia,
  CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, TextField, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { motion } from "framer-motion";

function DeletePlat() {
  const [plats, setPlats] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [open, setOpen] = useState(false);
  const [currentPlat, setCurrentPlat] = useState(null);
  const [form, setForm] = useState({ nom: "", prix: "", details: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = parseInt(localStorage.getItem("userId")); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platsRes, restosRes] = await Promise.all([
          axios.get("https://tchopshap.onrender.com/plat"),
          axios.get("https://tchopshap.onrender.com/restaurant"),
        ]);
        // Correction structure : platsRes.data.data et restosRes.data.data
        const userRestaurants = Array.isArray(restosRes.data.data)
          ? restosRes.data.data.filter(r => r.idUtilisateur === userId)
          : [];
        if (userRestaurants.length === 0) {
          console.warn("Aucun restaurant trouvé pour cet utilisateur.");
          setPlats([]);
          return;
        }
        // On récupère tous les plats de tous les restaurants de l'utilisateur
        const userRestaurantIds = userRestaurants.map(r => r.idRestaurant);
        const platsDuRestaurant = Array.isArray(platsRes.data.data)
          ? platsRes.data.data.filter(p => userRestaurantIds.includes(p.idRestaurant))
          : [];
        setPlats(platsDuRestaurant);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };

    fetchData();
  }, [userId]);

 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tchopshap.onrender.com/plat/${id}`);
      setPlats(plats.filter(p => p.idPlat !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (plat) => {
    setCurrentPlat(plat);
    setForm({
      nom: plat.nom,
      prix: plat.prix,
      details: plat.details,
      image: plat.image
    });
    setOpen(true);
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image;
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "tchopshap");

    setLoading(true);
    const res = await axios.post("https://api.cloudinary.com/v1_1/dwhqa7huy/image/upload", data);
    setLoading(false);
    return res.data.secure_url;
  };

  const handleSubmit = async () => {
    try {
      const imageUrl = await uploadImage();
      const updatedPlat = {
        ...currentPlat,
        nom: form.nom,
        prix: parseInt(form.prix),
        details: form.details,
        image: imageUrl,
      };

      await axios.put(`https://tchopshap.onrender.com/plat/${currentPlat.idPlat}`, updatedPlat);
      setPlats(plats.map(p => (p.idPlat === currentPlat.idPlat ? updatedPlat : p)));
      setOpen(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVoirPlus = () => {
    setVisibleCount(prev => prev + 4);
  };

  const handleVoirMoins = () => {
    setVisibleCount(4);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Liste des Plats</Typography>

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
        {plats.slice(0, visibleCount).map((plat) => (
          <motion.div
            key={plat.idPlat}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={plat.image}
                alt={plat.nom}
              />
              <CardContent>
                <Typography variant="h6">{plat.nom}</Typography>
                <Typography color="text.secondary">{plat.prix} FCFA</Typography>
                <Typography variant="body2">{plat.details}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(plat)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(plat.idPlat)}><DeleteIcon color="error" /></IconButton>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Boutons Voir plus / Voir moins */}
      <Box mt={4} textAlign="center">
        {visibleCount < plats.length ? (
          <Button variant="outlined" onClick={handleVoirPlus}>Voir plus</Button>
        ) : plats.length > 4 ? (
          <Button variant="outlined" onClick={handleVoirMoins}>Voir moins</Button>
        ) : null}
      </Box>

      {/* Dialog modification */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le Plat</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="nom"
            fullWidth
            margin="dense"
            value={form.nom}
            onChange={handleChange}
          />
          <TextField
            label="Prix"
            name="prix"
            type="number"
            fullWidth
            margin="dense"
            value={form.prix}
            onChange={handleChange}
          />
          <TextField
            label="Détails"
            name="details"
            fullWidth
            multiline
            margin="dense"
            value={form.details}
            onChange={handleChange}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Télécharger une image
            <input type="file" hidden onChange={(e) => setImageFile(e.target.files[0])} />
          </Button>

          {/* Spinner orange */}
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
  );
}

export default DeletePlat;



