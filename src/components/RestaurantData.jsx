import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
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

  useEffect(() => {
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
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Filtres de recherche */}
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

          {/* Grille des plats */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Grid
              container
              spacing={3}
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr ",
              }}
            >
              {platsFiltres.map((plat) => (
                <Grid item key={plat.idPlat}>
                  <Card
                    sx={{
                      width: "95%",
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
                      image={plat.image}
                      alt={plat.nom}
                      sx={{
                        height: 200,
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{plat.nom}</Typography>
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
        </>
      )}
    </div>
  );
};

export default Details;
