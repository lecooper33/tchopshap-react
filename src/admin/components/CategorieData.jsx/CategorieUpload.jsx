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

function CategorieUpload() {
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [open, setOpen] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState(null);
  const [form, setForm] = useState({ categorie: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("https://tchopshap.onrender.com/categorie")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tchopshap.onrender.com/categorie/${id}`);
      setCategories(categories.filter(c => c.idCategorie !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (categorie) => {
    setCurrentCategorie(categorie);
    setForm({
      categorie: categorie.categorie || "",
      image: categorie.image || ""
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
      const updatedCategorie = {
        ...currentCategorie,
        categorie: form.categorie,
        image: imageUrl
      };

      await axios.put(`https://tchopshap.onrender.com/categorie/${currentCategorie.idCategorie}`, updatedCategorie);
      setCategories(categories.map(c =>
        c.idCategorie === currentCategorie.idCategorie ? updatedCategorie : c
      ));
      setOpen(false);
      setForm({ categorie: "", image: "" });
      setImageFile(null);
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
      <Typography variant="h5" gutterBottom>Liste des Catégories</Typography>

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
        {categories.slice(0, visibleCount).map((categorie) => (
          <motion.div
            key={categorie.idCategorie}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={categorie.image || "https://via.placeholder.com/300x180?text=Pas+d'image"}
                alt={categorie.categorie}
              />
              <CardContent>
                <Typography variant="h6">{categorie.categorie}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(categorie)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(categorie.idCategorie)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </Box>

      <Box mt={4} textAlign="center">
        {visibleCount < categories.length ? (
          <Button variant="outlined" onClick={handleVoirPlus}>Voir plus</Button>
        ) : categories.length > 4 ? (
          <Button variant="outlined" onClick={handleVoirMoins}>Voir moins</Button>
        ) : null}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        keepMounted={false}
        disablePortal={false}
        disableEnforceFocus
      >
        <DialogTitle>Modifier la Catégorie</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de la catégorie"
            name="categorie"
            fullWidth
            margin="dense"
            value={form.categorie}
            onChange={handleChange}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Télécharger une image
            <input
              type="file"
              hidden
              onChange={(e) => setImageFile(e.target.files[0])}
              accept="image/*"
            />
          </Button>

          {loading && (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress sx={{ color: "orange" }} />
            </Box>
          )}

          {(form.image || imageFile) && (
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                alt="Aperçu"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
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

export default CategorieUpload;


