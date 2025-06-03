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

function RestaurantUpload() {
  const [restaurants, setRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [open, setOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [form, setForm] = useState({ nom: "", adresse: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = parseInt(localStorage.getItem("userId")); // ✅ Converti en nombre

  useEffect(() => {
    axios.get("https://tchopshap.onrender.com/restaurant")
      .then(res => {
        const allRestaurants = res.data;
        const userRestaurants = allRestaurants.filter(r => r.idUtilisateur === userId); // ✅ Clé corrigée
        setRestaurants(userRestaurants);
      })
      .catch(err => console.error("❌ Erreur de récupération des restaurants :", err));
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tchopshap.onrender.com/restaurant/${id}`);
      setRestaurants(restaurants.filter(r => r.idRestaurant !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setForm({
      nom: restaurant.nom,
      adresse: restaurant.adresse,
      image: restaurant.image
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
      const updatedRestaurant = {
        ...currentRestaurant,
        nom: form.nom,
        adresse: form.adresse,
        image: imageUrl
      };

      await axios.put(`https://tchopshap.onrender.com/restaurant/${currentRestaurant.idRestaurant}`, updatedRestaurant);
      setRestaurants(restaurants.map(r =>
        r.idRestaurant === currentRestaurant.idRestaurant ? updatedRestaurant : r
      ));
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
      <Typography variant="h5" gutterBottom>Liste de mes Restaurants</Typography>

      {restaurants.length === 0 ? (
        <Typography color="text.secondary">Aucun restaurant trouvé pour cet utilisateur.</Typography>
      ) : (
        <>
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
            {restaurants.slice(0, visibleCount).map((restaurant) => (
              <motion.div
                key={restaurant.idRestaurant}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="180"
                    image={restaurant.image || "https://via.placeholder.com/300x180?text=Pas+d'image"}
                    alt={restaurant.nom}
                  />
                  <CardContent>
                    <Typography variant="h6">{restaurant.nom}</Typography>
                    <Typography color="text.secondary">{restaurant.adresse}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEdit(restaurant)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(restaurant.idRestaurant)}><DeleteIcon color="error" /></IconButton>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Box>

          {/* Boutons Voir plus / Voir moins */}
          <Box mt={4} textAlign="center">
            {visibleCount < restaurants.length ? (
              <Button variant="outlined" onClick={handleVoirPlus}>Voir plus</Button>
            ) : restaurants.length > 4 ? (
              <Button variant="outlined" onClick={handleVoirMoins}>Voir moins</Button>
            ) : null}
          </Box>
        </>
      )}

      {/* Dialog modification */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le Restaurant</DialogTitle>
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
            label="Adresse"
            name="adresse"
            fullWidth
            margin="dense"
            value={form.adresse}
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

export default RestaurantUpload;

