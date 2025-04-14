import React, { useState } from "react";
import { Box, Paper, TextField, Select, MenuItem, FormControl, Typography, Button,
     Grid, Card, CardMedia, CardContent,Link} from "@mui/material";



const plats = [
  {
    nom: "Burger Classique",
    description: "Boeuf, salade, tomate, oignons, fromage, sauce maison",
    prix: 12.0,
    image: "/img pltsdetail/Image (1).png",
    categorie: "Burger"
  },
  {
    nom: "Burger Végétarien",
    description: "Galette de légumes, salade, tomate, oignons, sauce",
    prix: 11.6,
    image: "/img pltsdetail/Image (2).png",
    categorie: "Burger"
  },
  {
    nom: "Burger du Chef",
    description: "Double steak, bacon, cheddar, sauce spéciale",
    prix: 15.0,
    image: "/img pltsdetail/Image (16).png",
    categorie: "Burger"
  },
  {
    nom: "Frites Maison",
    description: "Frites avec herbes, ketchup, sel de mer",
    prix: 4.5,
    image: "/img pltsdetail/Image (3).png",
    categorie: "Accompagnement"
  },
  {
    nom: "Margherita",
    description: "Sauce tomate, mozzarella, basilic frais",
    prix: 10.5,
    image: "/img pltsdetail/Image (10).png",
    categorie: "Pizza"
  },
  {
    nom: "Quatre Fromages",
    description: "Mozzarella, gorgonzola, parmesan, chèvre",
    prix: 13.9,
    image: "/img pltsdetail/Image (11).png",
    categorie: "Pizza"
  },
  {
    nom: "Calzone",
    description: "Pâte repliée, jambon, champignons, fromage",
    prix: 14.5,
    image: "/img pltsdetail/Image (13).png",
    categorie: "Pizza"
  },
  {
    nom: "Plateau Découverte",
    description: "10 pièces maki, california, sashimi",
    prix: 18.9,
    image: "/img pltsdetail/Image (12).png",
    categorie: "Sushi"
  },
  {
    nom: "California Rolls",
    description: "Avocat, saumon, concombre, sésame",
    prix: 8.0,
    image: "/img pltsdetail/Image (15).png",
    categorie: "Sushi"
  },
  {
    nom: "Sashimi Saumon",
    description: "6 tranches de saumon frais",
    prix: 12.5,
    image: "/img pltsdetail/Image (14).png",
    categorie: "Sushi"
  }
];


const categories = ["Toutes les catégories", "Burger", "Pizza", "Sushi", "Accompagnement"];

const Details = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");


  const platsFiltres = plats.filter((plat) => {
    const matchNom = plat.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "Toutes les catégories" || plat.categorie === selectedCategory;
    return matchNom && matchCat;
  });

  return (
    <div>


      <Box sx={{ p: 2 }}>
  <h2 style={{ marginBottom: "1rem" }}>Plats</h2>

  <Paper
    sx={{display: "flex", alignItems: "center",
      padding: "10px", gap: 2,
      borderRadius: "12px", boxShadow: 1,}}>

    <TextField
      placeholder="Rechercher un plat..." variant="outlined"
      size="small"
      value={search}onChange={(e) => setSearch(e.target.value)}
      sx={{ flex: 1 }}/>

    <FormControl size="small">
      <Select
        value={selectedCategory}
        displayEmpty
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Filtre prix */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <span>Prix:</span>
      <TextField size="small" type="number" value={0} sx={{ width: 60 }} />
      <span>-</span>
      <TextField size="small" type="number" value={30} sx={{ width: 60 }} />
      <span>€</span>
    </Box>
  </Paper>
</Box>


      {/* grilles pour les plats */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {platsFiltres.map((plat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardMedia
                  component="img"
                 sx={{ objectFit:'cover',width:'100%',height:'45vh'}}
                  image={plat.image}
                  alt={plat.nom}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {plat.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plat.description}
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1">{plat.prix.toFixed(2)} €</Typography>
                    <Link href='/Cart'>
                    <Button variant="contained" color="warning" size="small">
                      Ajouter
                    </Button>
                    </Link>
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
