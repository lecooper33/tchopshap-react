import React, { useEffect, useState } from "react";
import {
  Box, MenuItem, Paper, TextField, Select, FormControl, Typography,
  Button, Grid, Card, CardMedia, CardContent, Skeleton,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const [plats, setPlats] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPlats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://tchopshap.onrender.com/plat");
      console.log("Plats reçus :", response.data);
      setPlats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des plats :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlats();
  }, []);

  const categories = ["Toutes les catégories", ...new Set(plats.map((plat) => plat.idRestaurant.toString()))];

  const platsFiltres = plats.filter((plat) => {
    const matchNom = plat.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "Toutes les catégories" || plat.idRestaurant.toString() === selectedCategory;

    const prix = Number(plat.prix);
    const min = prixMin === "" ? 0 : Number(prixMin);
    const max = prixMax === "" ? Infinity : Number(prixMax);
    const matchPrix = prix >= min && prix <= max;

    return matchNom && matchCat && matchPrix;
  });

  return (
    <div>
      {/* Filtres */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Nos plats
        </Typography>

        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <TextField
            placeholder="Rechercher un plat..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={selectedCategory}
              displayEmpty
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat === "Toutes les catégories" ? cat : `Restaurant ${cat}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Prix :</Typography>
            <TextField
              size="small"
              type="number"
              placeholder="Min"
              value={prixMin}
              onChange={(e) => setPrixMin(e.target.value)}
              sx={{ width: 70 }}
            />
            <Typography variant="body2">-</Typography>
            <TextField
              size="small"
              type="number"
              placeholder="Max"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              sx={{ width: 70 }}
            />
            <Typography variant="body2">FCFA</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Grille des plats ou Skeleton */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid
          container
          spacing={3}
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr",
          }}
        >
          {loading
            ? Array.from(new Array(4)).map((_, index) => (
                <Grid item key={index} xs={12}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      boxShadow: 1,
                      p: 2,
                    }}
                  >
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    <Skeleton height={30} sx={{ mt: 2 }} />
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="40%" sx={{ mt: 1 }} />
                  </Card>
                </Grid>
              ))
            : platsFiltres.map((plat) => (
                <Grid item key={plat.idPlat} xs={12}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={plat.image}
                      alt={plat.nom}
                      sx={{
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {plat.nom}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {plat.details}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {plat.prix.toLocaleString()} FCFA
                        </Typography>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => navigate("/Cart", { state: { plat } })}
                        >
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

