import React from "react";
import { Container, Box, Typography, Grid, CardMedia, Card, CardContent, Chip,} from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";
import { Link as RouterLink, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

const RestaurantOnSpot = ({ restaurants }) => {
  const location = useLocation();
  const isOnRestaurantsPage = location.pathname === "/restaurants";

  return (
    <Container sx={{ py: { xs: 3, md: 6 } }}>
      {!isOnRestaurantsPage && (
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 3, gap: 1,}} >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            Restaurants Populaires
          </Typography>
          <RouterLink
            to="/restaurants"
            style={{ textDecoration: "none", color: "orange",
              fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "0.95rem",}}>
            Voir tout <RiArrowRightSLine />
          </RouterLink>
        </Box>
      )}

      <Grid container spacing={4}>
        {restaurants.map((restaurant, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Card
              sx={{ borderRadius: 3, boxShadow: 2,
                cursor: "pointer", height: "100%", display: "flex", flexDirection: "column",}}>
              <CardMedia
                component="img"
                sx={{
                  height: { xs: "180px", sm: "200px", md: "42.3vh" },
                  objectFit: "cover",
                }} image={restaurant.image} alt={restaurant.name}/>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  {restaurant.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",gap: 1,
                    mb: 1,flexWrap: "wrap",}}>
                  <Chip
                    icon={<StarIcon sx={{ color: "#FFD700" }} />} label={restaurant.rating}
                    sx={{ backgroundColor: "#EAF4DC",
                      fontWeight: "bold",fontSize: { xs: "0.8rem", sm: "0.9rem" },}}/>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: { xs: "0.8rem" } }}
                  >
                    {restaurant.time} • {restaurant.price}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  }}
                >
                  {restaurant.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RestaurantOnSpot;
