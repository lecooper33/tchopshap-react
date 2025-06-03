import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Panier() {
  const location = useLocation();
  const navigate = useNavigate();
  const plat = location.state?.plat;
  const { user } = useAuth();
  const [quantite, setQuantite] = useState(1);
  const fraisLivraison = 1000;

  // Sauvegarde dans localStorage
  useEffect(() => {
    if (!plat) {
      const panierLocal = JSON.parse(localStorage.getItem("panier"));
      if (panierLocal?.plat) {
        navigate("/cart", { state: { plat: panierLocal } });
      }
    }
  }, [plat, quantite, navigate]);

  const formatPrix = (prix) => {
    if (prix == null) return "0 XOF";
    return prix.toLocaleString("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    });
  };

  const ajusterQuantite = (action) => {
    setQuantite((prev) => {
      if (action === "augmenter") return prev + 1;
      if (action === "diminuer") return Math.max(1, prev - 1);
      if (action === "reset") return 1;
      return prev;
    });
  };

  if (!plat) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Aucun plat sélectionné.</Typography>
      </Container>
    );
  }

  const sousTotal = plat.prix * quantite;
  const total = sousTotal + fraisLivraison;

  const handleCommander = () => {
    const panierData = { plat, quantite, sousTotal, total, fraisLivraison };
    localStorage.setItem("panier", JSON.stringify(panierData));

    if (user) {
      navigate("/Paiement", { state: panierData });
    } else {
      navigate("/profil", { state: { from: "/Paiement" } });
    }
  };

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

        <Button
          fullWidth
          variant="contained"
          onClick={handleCommander}
          sx={{
            mt: 3,
            backgroundColor: "#F97316",
            color: "white",
            "&:hover": { backgroundColor: "#ea580c" },
          }}
        >
          Commander
        </Button>
      </Paper>
    </Container>
  );
}
