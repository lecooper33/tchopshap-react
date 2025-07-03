// src/pages/PlatCard.jsx
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
  Skeleton,
  Badge,
  IconButton,
  Stack,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"
import { useCart } from "../context/CartContext";

const PlatCard = () => {
  const { idRestaurant } = useParams();
  const location = useLocation();
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Toutes les catégories");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");  const [loading, setLoading] = useState(true);
  const [platSelectionne, setPlatSelectionne] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [selectedPlats, setSelectedPlats] = useState([]);
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();

  // Récupérer les plats
  useEffect(() => {
    axios
      .get("https://tchopshap.onrender.com/plat")
      .then((res) => setPlats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Récupérer restaurants et catégories, et déterminer le nom du restaurant si on a un id en URL
  useEffect(() => {
    // Restaurants
    axios
      .get("https://tchopshap.onrender.com/restaurant")
      .then((res) => {
        setRestaurants(res.data);
        if (idRestaurant) {
          const r = res.data.find(
            (r) => r.idRestaurant.toString() === idRestaurant
          );
          if (r) {
            setRestaurantName(r.nom);
          }
        }
      })
      .catch(console.error);

    // Catégories
    axios
      .get("https://tchopshap.onrender.com/categorie")
      .then((res) => setCategoriesData(res.data))
      .catch(console.error);
  }, [idRestaurant]);

  // Récupérer la catégorie depuis l'URL si présente
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('categorie');
    if (cat) setSelectedCat(cat);
  }, [location.search]);

  // Ajout : récupération du paramètre de recherche depuis l'URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setSearch(searchParam);
  }, [location.search]);

  // Options de catégories (noms récupérés de l'API)
  const categories = [
    "Toutes les catégories",
    ...categoriesData.map((c) => c["categorie"]),
  ];

  // Filtrage : priorité à la catégorie sélectionnée, sinon on applique le filtre idRestaurant
  const filtres = plats
    .filter((p) => {
      if (selectedCat !== "Toutes les catégories") {
        // Filtrer par catégorie
        const catObj = categoriesData.find(
          (c) => c["catégorie"] === selectedCat
        );
        if (!catObj) return true;
        const resto = restaurants.find((r) => r.idRestaurant === p.idRestaurant);
        return resto && resto.idCategorie === catObj.idCategorie;
      }
      // Si pas de catégorie spécifique, mais qu'un resto a été cliqué
      if (idRestaurant) {
        return p.idRestaurant.toString() === idRestaurant;
      }
      return true;
    })
    .filter((p) => p.nom.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      const prix = Number(p.prix);
      const min = prixMin === "" ? 0 : Number(prixMin);
      const max = prixMax === "" ? Infinity : Number(prixMax);
      return prix >= min && prix <= max;
    });
  const handleAddToCart = (plat) => {
    addToCart({ plat, quantite: 1 });
    setSelectedPlats((prev) => prev.includes(plat.idPlat) ? prev : [...prev, plat.idPlat]);
  };

  return (
    <>
      <Header/>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          {selectedCat !== "Toutes les catégories"
            ? `Plats - ${selectedCat}`
            : idRestaurant
            ? `Plats de ${restaurantName || `#${idRestaurant}`}`
            : "Tous nos plats"}
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
              value={selectedCat}
              displayEmpty
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
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

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3} display="grid" gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr",
          }}>
            {loading
              ? Array.from(new Array(4)).map((_, i) => (
                  <Grid item key={i} xs={12}>
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
              : filtres.map((plat) => (
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
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => handleAddToCart(plat)}
                            >
                              Ajouter
                            </Button>
                            {selectedPlats.includes(plat.idPlat) && (
                              <IconButton
                                size="small"
                                onClick={() => navigate('/Cart')}
                                sx={{
                                  backgroundColor: 'orange',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: 'darkorange',
                                  }
                                }}
                              >
                                <Badge badgeContent={cartCount} color="error">
                                  <ShoppingCart fontSize="small" />
                                </Badge>
                              </IconButton>
                            )}
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>
      </Box>
      <Footer/>
    </>
  );
};

export default PlatCard;





