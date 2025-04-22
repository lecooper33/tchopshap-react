// Importation des modules React et composants nécessaires
import React, { useState } from "react";
import RestaurantOnSpot from "../components/RestaurantOnSpot.jsx";
import restaurants from "../components/restaurantsData.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

// Composants de l'interface (MUI)
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";

// Liste des catégories de restaurants
const categories = [
  "Tous",
  "Burgers",
  "Pizza",
  "Sushi",
  "Cuisine Africaine",
  "Cuisine Française",
  "Desserts",
];

const Resto = () => {
  // États pour la recherche, la catégorie sélectionnée, le tri et le bouton actif
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [sortBy, setSortBy] = useState("Popularité");
  const [activeCategory, setActiveCategory] = useState("Tous");

  return (
    <div>
      {/* En-tête du site */}
      <Header />

      {/* Contenu principal */}
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9fafb" }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Restaurants
        </Typography>

        {/* Filtres de recherche */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 2,
            borderRadius: "12px",
          }}
        >
          {/* Champ de recherche */}
          <TextField
            placeholder="Rechercher un restaurant..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}
          />

          {/* Sélecteur de catégorie */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="Toutes les catégories">Toutes les catégories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sélecteur de tri */}
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

        {/* Boutons de catégories */}
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
      </Box>

      {/* Liste des restaurants */}
      <RestaurantOnSpot restaurants={restaurants} />

      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default Resto;

