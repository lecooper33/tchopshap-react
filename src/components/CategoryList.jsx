import React from "react";
import {Container,Grid,Typography,Box,Link,Card,CardMedia,CardContent,} from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";

const CategoryList = ({ categories }) => {
  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",  justifyContent: "space-between",
          alignItems: "center",mb: 3,}}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Catégories
        </Typography>
        <Link
          href="#"
          sx={{
            textDecoration: "none",
            color: "orange", fontWeight: "bold",
            display: "flex", alignItems: "center",}}>
          Voir tout <RiArrowRightSLine />
        </Link>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                height: "100%",cursor: "pointer",}}>
              <CardMedia
                component="img"
                sx={{ height: "27.8vh", objectFit: "cover" }}
                image={category.image}  alt={category.name}/>
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

