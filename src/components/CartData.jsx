import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, Link } from "react-router-dom";

export default function Panier() {
  const location = useLocation();
  const plat = location.state?.plat;

  const [quantite, setQuantite] = useState(1);
  const fraisLivraison = 1000; // En Franc CFA

  if (!plat) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Aucun plat sélectionné.</Typography>
      </Container>
    );
  }

  const formatPrix = (prix) =>
    prix.toLocaleString("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    });

  const ajusterQuantite = (action) => {
    setQuantite((prevQuantite) => {
      if (action === "augmenter") return prevQuantite + 1;
      if (action === "diminuer") return Math.max(1, prevQuantite - 1);
      if (action === "reset") return 1;
    });
  };

  const sousTotal = plat.prix * quantite;
  const total = sousTotal + fraisLivraison;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Votre panier
      </Typography>

      <Box
        component="img"
        src={plat.image}
        alt={plat.nom}
        sx={{
          width: "100%",
          height: 300,
          objectFit: "cover",
          borderRadius: 2,
          mb: 2,
        }}
      />

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">{plat.nom}</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {plat.description}
        </Typography>
        <Typography fontWeight="bold" sx={{ fontSize: "1.2rem", color: "#F97316" }}>
          {formatPrix(plat.prix)} / unité
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="start" gap={2} mt={2}>
          <Button variant="outlined" onClick={() => ajusterQuantite("diminuer")}>-</Button>
          <Typography>{quantite}</Typography>
          <Button variant="outlined" onClick={() => ajusterQuantite("augmenter")}>+</Button>
          <IconButton onClick={() => ajusterQuantite("reset")} sx={{ color: "#F97316" }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>

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

        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          pt={2}
          borderTop="1px solid #ddd"
        >
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold">{formatPrix(total)}</Typography>
        </Box>

        <Link
          to="/Paiement"
          state={{ total, sousTotal, fraisLivraison, plat, quantite }}
          style={{ textDecoration: "none" }}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#F97316",
              color: "white",
              "&:hover": { backgroundColor: "#ea580c" },
            }}
          >
            Commander
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
