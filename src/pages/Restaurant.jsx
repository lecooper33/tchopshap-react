// src/pages/Resto.jsx
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
  Skeleton,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

const Resto = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(["Tous"]);
  const [catData, setCatData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("Popularité");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic category retrieval
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://tchopshap.onrender.com/categorie");
        setCatData(res.data);
        setCategories(["Tous", ...res.data.map((c) => c["categorie"])]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Restaurant retrieval
  useEffect(() => {
    const fetchR = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://tchopshap.onrender.com/restaurant");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchR();
  }, []);

  const getCatNom = (id) => {
    const cat = catData.find((c) => c.idCategorie === id);
    return cat ? cat["categorie"] : "Inconnue";
  };

  const filtered = restaurants
    .filter((r) => {
      const matchSearch = r.nom.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        activeCategory === "Tous" || getCatNom(r.idCategorie) === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "Note") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "Prix") return (a.price || 0) - (b.price || 0);
      return (b.popularity || 0) - (a.popularity || 0);
    });

  return (
    <div>
      <Header />
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9fafb" }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Restaurants
        </Typography>

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

        <Box mt={4}>
          {loading ? (
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
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <Grid item key={i}>
                    <Link to="/PlatCard" style={{ textDecoration: "none" }}>
                      <Card sx={{ height: "100%", borderRadius: 3 }}>
                        <Skeleton
                          variant="rectangular"
                          height={180}
                          sx={{
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                          }}
                        />
                        <CardContent>
                          <Skeleton variant="text" height={30} width="80%" />
                          <Skeleton variant="text" height={20} width="60%" />
                          <Skeleton
                            variant="text"
                            height={20}
                            width="50%"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
            </Grid>
          ) : filtered.length > 0 ? (
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
              {filtered.map((r) => (
                <Grid item key={r.idRestaurant}>
                  <Link
                    to={`/PlatCard/${r.idRestaurant}`}
                    style={{ textDecoration: "none" }}
                  >
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
                        image={r.image || "/default-restaurant.jpg"}
                        alt={r.nom}
                        sx={{
                          height: 180,
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight={600}>
                          {r.nom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {r.adresse}
                        </Typography>
                        <Typography mt={1} variant="body2" color="text.secondary">
                          Catégorie : {getCatNom(r.idCategorie)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
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