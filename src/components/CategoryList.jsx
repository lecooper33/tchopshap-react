import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Box,
  Link,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
} from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://tchopshap.onrender.com/categorie");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderSkeletons = (count = 6) => (
    <Grid
      container
      spacing={3}
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "1fr 1fr",
        md: "1fr 1fr 1fr",
        lg: "1fr 1fr 1fr 1fr",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Grid  xs={12} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Skeleton
              variant="rectangular"
              height={200}
              animation="wave"
              sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            />
            <CardContent sx={{ textAlign: "center" }}>
              <Skeleton width="60%" height={30} animation="wave" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

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

      {loading ? (
        renderSkeletons(6)
      ) : categories.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Aucune catégorie disponible.
        </Typography>
      ) : (
        <Grid
          container
          spacing={3}
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          }}
        >
          {categories.map((category, index) => (
            <Grid
              xs={12}
              key={category.id || category.categorie || index}
            >
              <Card
                onClick={() => navigate(`/restaurants?categorie=${encodeURIComponent(category.categorie)}`)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: { xs: "180px", sm: "200px", md: "27vh" },
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                  image={category.image}
                  alt={category.categorie}
                />
                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {category.categorie}
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

export default CategoryList;
