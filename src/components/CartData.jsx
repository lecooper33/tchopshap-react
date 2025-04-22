import React, { useState } from "react";
import {
  Container, Typography, Box, Paper, Button, IconButton, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, Link } from "react-router-dom";

export default function Panier() {
  const location = useLocation();
  const plat = location.state?.plat;

  const [quantite, setQuantite] = useState(1);
  const fraisLivraison = 2.99;

  if (!plat) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Aucun plat sélectionné.</Typography>
      </Container>
    );
  }

  const formatPrix = (prix) => prix.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const augmenter = () => setQuantite(q => q + 1);
  const diminuer = () => setQuantite(q => Math.max(1, q - 1));
  const reset = () => setQuantite(1);

  const sousTotal = plat.prix * quantite;
  const total = sousTotal + fraisLivraison;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Votre panier
      </Typography>

      {/* Section du plat */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Box
              component="img"
              src={plat.image}
              alt={plat.nom}
              sx={{ width: "100%", height: "auto", borderRadius: 1, objectFit: "cover" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{plat.nom}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {plat.description}
            </Typography>
            <Typography fontWeight="bold">{formatPrix(plat.prix)}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <Button variant="outlined" onClick={diminuer}>-</Button>
              <Typography>{quantite}</Typography>
              <Button variant="outlined" onClick={augmenter}>+</Button>
              <IconButton onClick={reset} sx={{color:"#F97316"}}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Récapitulatif */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Récapitulatif
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Sous-total</Typography>
          <Typography>{formatPrix(sousTotal)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Frais de livraison</Typography>
          <Typography>{formatPrix(fraisLivraison)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2} pt={2} borderTop="1px solid #ddd">
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold">{formatPrix(total)}</Typography>
        </Box>

        <Link to="/Profil" style={{ textDecoration: "none" }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "orange",
              color: "white",
              "&:hover": { backgroundColor: "darkorange" }
            }}
          >
            Commander
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
