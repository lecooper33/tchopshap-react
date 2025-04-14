import React, { useState } from "react";
import RestaurantOnSpot from "../components/RestaurantOnSpot.jsx";
import restaurants from "../components/restaurantsData.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Box, Typography, TextField, FormControl, Select, MenuItem, Button, Paper,} from "@mui/material";

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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [sortBy, setSortBy] = useState("Popularité");
  const [activeCategory, setActiveCategory] = useState("Tous");

  return (
    <div>
      <Header />

      <Box sx={{ p: 4, bgcolor: "#f9fafb" }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Restaurants
        </Typography>

        <Paper elevation={1}
          sx={{ p: 2,display: "flex",flexWrap: "wrap",
            alignItems: "center",
            gap: 2,borderRadius: "12px",}}>
          <TextField placeholder="Rechercher un restaurant..."
            variant="outlined" size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
             width:'100%',
              flex: 1,}}/>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={selectedCategory}
              displayEmpty
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ borderRadius: "8px" }}>

              <MenuItem value="Toutes les catégories">Toutes les catégories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={sortBy}
              displayEmpty
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ borderRadius: "8px" }}>
              <MenuItem value="Popularité">Popularité</MenuItem>
              <MenuItem value="Note">Note</MenuItem>
              <MenuItem value="Prix">Prix</MenuItem>
            </Select>
          </FormControl>
        </Paper>

 
        <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {categories.map((cat) => (
            <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant="contained"
            sx={{
              borderRadius: "9999px",
              px: 2.5,  py: 0.8,
              fontSize: "0.875rem",  textTransform: "none",
              backgroundColor: activeCategory === cat ? "#f97316" : "#f3f4f6",
              color: activeCategory === cat ? "#fff" : "#000",boxShadow: "none",}}>
            {cat}
          </Button>
          ))}
        </Box>
      </Box>

      <RestaurantOnSpot restaurants={restaurants} />
      <Footer />
    </div>
  );
};

export default Resto;
