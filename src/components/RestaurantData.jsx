import React, { useState } from "react";
import {Box, Paper, TextField, Select, MenuItem, FormControl, Typography, Button, Grid, Card, CardMedia, CardContent} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Liste des plats disponibles
const plats = [
  {
    nom: "Burger Classique",
    description: "Boeuf, salade, tomate, oignons, fromage, sauce maison",
    prix: 12.0,
    image: "/img pltsdetail/Image (1).png",
    categorie: "Burger",
  },
  {
    nom: "Burger Végétarien",
    description: "Galette de légumes, salade, tomate, oignons, sauce",
    prix: 11.6,
    image: "/img pltsdetail/Image (2).png",
    categorie: "Burger",
  },
  {
    nom: "Burger du Chef",
    description: "Double steak, bacon, cheddar, sauce spéciale",
    prix: 15.0,
    image: "/img pltsdetail/Image (16).png",
    categorie: "Burger",
  },
  {
    nom: "Frites Maison",
    description: "Frites avec herbes, ketchup, sel de mer",
    prix: 4.5,
    image: "/img pltsdetail/Image (3).png",
    categorie: "Accompagnement",
  },
  {
    nom: "Margherita",
    description: "Sauce tomate, mozzarella, basilic frais",
    prix: 10.5,
    image: "/img pltsdetail/Image (10).png",
    categorie: "Pizza",
  },
  {
    nom: "Quatre Fromages",
    description: "Mozzarella, gorgonzola, parmesan, chèvre",
    prix: 13.9,
    image: "/img pltsdetail/Image (11).png",
    categorie: "Pizza",
  },
  {
    nom: "Calzone",
    description: "Pâte repliée, jambon, champignons, fromage",
    prix: 14.5,
    image: "/img pltsdetail/Image (13).png",
    categorie: "Pizza",
  },
  {
    nom: "Plateau Découverte",
    description: "10 pièces maki, california, sashimi",
    prix: 18.9,
    image: "/img pltsdetail/Image (12).png",
    categorie: "Sushi",
  },
  {
    nom: "California Rolls",
    description: "Avocat, saumon, concombre, sésame",
    prix: 8.0,
    image: "/img pltsdetail/Image (15).png",
    categorie: "Sushi",
  },
  {
    nom: "Sashimi Saumon",
    description: "6 tranches de saumon frais",
    prix: 12.5,
    image: "/img pltsdetail/Image (14).png",
    categorie: "Sushi",
  },
];

const categories = ["Toutes les catégories", "Burger", "Pizza", "Sushi", "Accompagnement"];

const Details = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [prixMin, setPrixMin] = useState(0);
  const [prixMax, setPrixMax] = useState(30);

  const navigate = useNavigate();

  // Filtrage des plats selon les critères
  const platsFiltres = plats.filter((plat) => {
    const matchNom = plat.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Toutes les catégories" || plat.categorie === selectedCategory;
    const matchPrix = plat.prix >= prixMin && plat.prix <= prixMax;
    return matchNom && matchCat && matchPrix;
  });

  return (
    <div>
      {/* Filtres de recherche */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Nos plats
        </Typography>

        <Paper
          sx={{p: 2,
            display: "flex", flexWrap: "wrap",
            alignItems: "center", gap: 2,
            borderRadius: 3, boxShadow: 1,}}>
          {/* Recherche par nom */}
          <TextField
            placeholder="Rechercher un plat..."
            variant="outlined"
            size="small" value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}/>

          {/* Filtrage par catégorie */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={selectedCategory}
              displayEmpty
              onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtrage par plage de prix */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Prix :</Typography>
            <TextField
              size="small" type="number"
              value={prixMin}
              onChange={(e) => setPrixMin(Number(e.target.value))}
              sx={{ width: 70 }}/>
            <Typography variant="body2">-</Typography>
            <TextField
              size="small"
              type="number" value={prixMax}
              onChange={(e) => setPrixMax(Number(e.target.value))}
              sx={{ width: 70 }}/>
            <Typography variant="body2">€</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Affichage des plats */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={4}>
          {platsFiltres.map((plat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                {/* Image du plat */}
                <CardMedia component="img" image={plat.image} alt={plat.nom}
                  sx={{ width: "100%",height: { xs: 180, sm: 220, md: 260 }, objectFit: "cover",
                    borderTopLeftRadius: 12, borderTopRightRadius: 12,}}/>
                    

                {/* Informations du plat */}
                <CardContent>
                  <Typography variant="h6">{plat.nom}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {plat.description}
                  </Typography>

                  {/* Prix + bouton d’ajout */}
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {plat.prix.toFixed(2)} €
                    </Typography>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => navigate("/Cart", { state: { plat } })}>
                      Ajouter
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Details;


