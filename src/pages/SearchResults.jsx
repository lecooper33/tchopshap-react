import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function SearchResults() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    setQuery(q);
    if (!q) return;
    setLoading(true);
    Promise.all([
      axios.get("https://tchopshap.onrender.com/plat"),
      axios.get("https://tchopshap.onrender.com/restaurant"),
    ])
      .then(([platsRes, restosRes]) => {
        setPlats(
          platsRes.data.filter((p) =>
            p.nom.toLowerCase().includes(q.toLowerCase())
          )
        );
        setRestaurants(
          restosRes.data.filter((r) =>
            r.nom.toLowerCase().includes(q.toLowerCase())
          )
        );
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9fafb", minHeight: "80vh" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Résultats pour : <span style={{ color: "#F97316" }}>{query}</span>
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" mb={2} color="#F97316">Plats</Typography>
            {plats.length === 0 ? (
              <Typography color="text.secondary">Aucun plat trouvé.</Typography>
            ) : (
              <Grid container spacing={2}>
                {plats.map((plat) => (
                  <Grid item xs={12} sm={6} md={4} key={plat.idPlat}>
                    <Card>
                      {plat.image && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={plat.image}
                          alt={plat.nom}
                        />
                      )}
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>{plat.nom}</Typography>
                        <Typography variant="body2" color="text.secondary">{plat.details}</Typography>
                        <Typography variant="body2" color="text.secondary">Prix : {plat.prix} FCFA</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} color="#F97316">Restaurants</Typography>
            {restaurants.length === 0 ? (
              <Typography color="text.secondary">Aucun restaurant trouvé.</Typography>
            ) : (
              <Grid container spacing={2}>
                {restaurants.map((resto) => (
                  <Grid item xs={12} sm={6} md={4} key={resto.idRestaurant}>
                    <Card>
                      {resto.image && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={resto.image}
                          alt={resto.nom}
                        />
                      )}
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>{resto.nom}</Typography>
                        <Typography variant="body2" color="text.secondary">{resto.adresse}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
