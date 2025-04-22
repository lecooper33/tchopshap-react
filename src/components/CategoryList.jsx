import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Link,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";

const CategoryList = ({ categories }) => {
  return (
    <Container sx={{ py: { xs: 2, sm: 4 } }}>
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
          Catégories
        </Typography>

        <Link
          href="#"
          sx={{
            textDecoration: "none",
            color: "orange",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Voir tout <RiArrowRightSLine />
        </Link>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: { xs: "180px", sm: "200px", md: "27.8vh" },
                  objectFit: "cover",
                }}
                image={category.image}
                alt={category.name}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryList;


