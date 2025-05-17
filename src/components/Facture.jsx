import React from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  Checkbox,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Facture() {
  const location = useLocation();
  const navigate = useNavigate();
  const { total = 0, sousTotal = 0, fraisLivraison = 0 } = location.state || {};

  const handleConfirm = () => {
    const isConnected = localStorage.getItem("isConnected") === "true";
    if (!isConnected) {
      navigate("/Profil", { state: { redirectAfterLogin: "/Confirmation" } });
    } else {
      navigate("/Confirmation");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 3 }}>
        <Link href="/Cart" underline="none" color="inherit">
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
            <ArrowBack /> Retour
          </Typography>
        </Link>

        <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
          Finaliser la commande
        </Typography>
        <Typography>
          Remplissez les informations ci-dessous pour finaliser votre commande
        </Typography>
      </Box>

      {/* Livraison */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Informations de livraison
        </Typography>

        <Box>
          <Typography>Nom complet</Typography>
          <TextField fullWidth size="small" placeholder="Jean Dupont" sx={{ mb: 2 }} />
          <Typography>Adresse de livraison</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Adresse complète" sx={{ mb: 2 }} />
          <Typography>Numéro de téléphone</Typography>
          <TextField fullWidth size="small" placeholder="Ex : 077123456" sx={{ mb: 2 }} />
          <Typography>Instructions spéciales (optionnel)</Typography>
          <TextField fullWidth multiline rows={2} size="small" placeholder="Indications" />
        </Box>
      </Paper>

      {/* Paiement */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Méthode de paiement
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Checkbox id="carteBancaire" />
          <Typography htmlFor="carteBancaire">Carte bancaire</Typography>
        </Box>
        <TextField fullWidth size="small" placeholder="1234 5678 9012 3456" sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box flex={1}>
            <Typography>Date d’expiration</Typography>
            <TextField fullWidth size="small" placeholder="MM/AA" />
          </Box>
          <Box flex={1}>
            <Typography>CVV</Typography>
            <TextField fullWidth size="small" placeholder="123" />
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox id="mobileMoney" />
            <Typography htmlFor="mobileMoney">Mobile Money</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox id="especes" />
            <Typography htmlFor="especes">Espèces à la livraison</Typography>
          </Box>
        </Box>

    <Link href="/Profil" underline="none" color="inherit"> 
     <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          sx={{
            mt: 3,
            backgroundColor: "orange",
            "&:hover": { backgroundColor: "darkorange" },
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Confirmer la commande
        </Button>
        </Link>  
      </Paper>

      {/* Récapitulatif */}
      <Paper sx={{ p: 3, mb: 6 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Récapitulatif
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Sous-total</Typography>
          <Typography>{sousTotal.toLocaleString("fr-FR")} F</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography>Frais de livraison</Typography>
          <Typography>{fraisLivraison.toLocaleString("fr-FR")} F</Typography>
        </Box>

        <Box
          borderTop="2px solid #000"
          pt={2}
          display="flex"
          justifyContent="space-between"
        >
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold">{total.toLocaleString("fr-FR")} F</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
