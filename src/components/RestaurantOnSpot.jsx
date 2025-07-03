import React, { useState, useEffect } from "react";
import {
  Container, Box, Typography, Grid, CardMedia, Card,
  CardContent, Chip, Skeleton
} from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Star from "@mui/icons-material/Star";

const RestaurantOnSpot = () => {
  const location = useLocation();
  const isOnRestaurantsPage = location.pathname === "/restaurants";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
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

  const renderSkeletons = (count = 4) => (
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
      {Array.from({ length: count }).map((_, index) => (
        <Grid  xs={12} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: 3,
              p: 1,
            }}
          >
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
            <CardContent>
              <Skeleton width="60%" height={30} />
              <Box display="flex" alignItems="center" gap={1} my={1}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={40} height={24} />
                <Skeleton variant="rounded" width={50} height={24} />
              </Box>
              <Skeleton width="100%" height={40} />
              <Skeleton width="40%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container sx={{ py: { xs: 3, md: 6 } }}>
      {!isOnRestaurantsPage && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            Restaurants Populaires
          </Typography>
          <RouterLink
            to="/restaurants"
            style={{
              textDecoration: "none",
              color: "orange",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            Voir tout <RiArrowRightSLine />
          </RouterLink>
        </Box>
      )}

      {loading ? (
        renderSkeletons(6) // ⬅️ Affiche 6 cartes squelettes
      ) : restaurants.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Aucune donnée de restaurant disponible.
        </Typography>
      ) : (
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
          {restaurants.map((resto, index) => (
            <Grid  xs={12} key={index}>
              <Card
  component={RouterLink}
  to={`/PlatCard/${resto.idRestaurant}`}
  sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    boxShadow: 3,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: 6,
    },
  }}
>
                <CardMedia
                  component="img"
                  height="160"
                  image={resto.image || "/default-restaurant.jpg"}
                  alt={resto.nom}
                  sx={{ objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {resto.nom}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} my={1} flexWrap="wrap">
                    <Chip
                      icon={<Star sx={{ color: "white" }} fontSize="small" />}
                      label={resto.rating}
                      color="success"
                      size="small"
                    />
                    <Typography variant="body2">{resto.time}</Typography>
                    <Typography variant="body2">{resto.price}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {resto.description || ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {resto.adresse}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RestaurantOnSpot;
