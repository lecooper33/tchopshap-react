import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

// Liste des catégories avec leurs IDs
const categories = [
  "Tous",
  "Burgers",
  "Pizza",
  "Sushi",
  "Cuisine Africaine",
  "Cuisine Française",
  "Desserts",
];

// Fonction pour traduire idCategorie en nom
const getCategorieNom = (id) => {
  const map = {
    1: "Burgers",
    2: "Pizza",
    3: "Sushi",
    4: "Cuisine Africaine",
    5: "Cuisine Française",
    6: "Desserts",
  };
  return map[id] || "Inconnue";
};

const Resto = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("Popularité");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://tchopshap.onrender.com/restaurant");
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchSearch = restaurant.nom.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "Tous" ||
        getCategorieNom(restaurant.idCategorie) === activeCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "Note") return b.rating - a.rating;
      if (sortBy === "Prix") return a.price - b.price;
      return b.popularity - a.popularity;
    });

  return (
    <div>
      <Header />
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9fafb" }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Restaurants
        </Typography>

        {/* Barre de filtres */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            flexWrap: "wrap",
            borderRadius: 3,
          }}
        >
          <TextField
            placeholder="Rechercher un restaurant..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="Popularité">Popularité</MenuItem>
              <MenuItem value="Note">Note</MenuItem>
              <MenuItem value="Prix">Prix</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Boutons Catégories */}
        <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant="contained"
              sx={{
                borderRadius: "9999px",
                px: 2.5,
                py: 0.8,
                fontSize: "0.875rem",
                textTransform: "none",
                backgroundColor: activeCategory === cat ? "#f97316" : "#f3f4f6",
                color: activeCategory === cat ? "#fff" : "#000",
                boxShadow: "none",
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        {/* Affichage des restaurants */}
        <Box mt={4}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress sx={{ color: "#f97316" }} />
            </Box>
          ) : filteredRestaurants.length > 0 ? (
            <Grid
              container
              spacing={3}
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr",
              }}
            >
              {filteredRestaurants.map((resto) => (
                <Grid item key={resto.idRestaurant}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={resto.image || "/default-restaurant.jpg"}
                      alt={resto.nom}
                      sx={{
                        height: 180,
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight={600}>
                        {resto.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {resto.adresse}
                      </Typography>
                      <Typography mt={1} variant="body2" color="text.secondary">
                        Catégorie : {getCategorieNom(resto.idCategorie)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{ px: 2, py: 4, textAlign: "center" }}
              color="text.secondary"
            >
              Aucun restaurant ne correspond à votre recherche.
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default Resto;
