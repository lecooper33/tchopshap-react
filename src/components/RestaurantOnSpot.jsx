import React from "react";
import { Container, Box, Typography, Grid, CardMedia, Card, CardContent, Chip,} from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";
import { Link as RouterLink, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

const RestaurantOnSpot = ({ restaurants }) => {
  const location = useLocation(); 
  const isOnRestaurantsPage = location.pathname === "/restaurants"; 

  return (
    <Container sx={{ py: 6 }}>
      {!isOnRestaurantsPage && (
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3,}}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Restaurants Populaires
          </Typography>
          <RouterLink
            to="/restaurants"
            style={{ textDecoration: "none", color: "orange", fontWeight: "bold", display: "flex", alignItems: "center",}}>
            Voir tout <RiArrowRightSLine />
          </RouterLink>
        </Box>
      )}

 
      <Grid container spacing={4}>
        {restaurants.map((restaurant, index) => (
          <Grid xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, cursor: "pointer",width:'100%' }}>
              <CardMedia
                component="img"
                sx={{ height: "42.3vh", objectFit: "cover" }}
                image={restaurant.image}
                alt={restaurant.name}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {restaurant.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    icon={<StarIcon sx={{ color: "#FFD700" }} />}
                    label={restaurant.rating}
                    sx={{ backgroundColor: "#EAF4DC", fontWeight: "bold" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {restaurant.time} • {restaurant.price}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
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
