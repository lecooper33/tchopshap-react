import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Panier() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateCartItem, removeFromCart, totalAmount } = useCart();
  const fraisLivraison = 1000;

  const formatPrix = (prix) => {
    if (prix == null) return "0 XOF";
    return prix.toLocaleString("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    });
  };

  const ajusterQuantite = (idPlat, quantiteActuelle, action) => {
    let nouvelleQuantite = quantiteActuelle;
    if (action === "augmenter") nouvelleQuantite += 1;
    else if (action === "diminuer") nouvelleQuantite = Math.max(0, quantiteActuelle - 1);
    
    if (nouvelleQuantite === 0) {
      removeFromCart(idPlat);
    } else {
      updateCartItem(idPlat, nouvelleQuantite);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Votre panier est vide.</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/restaurants')}
          sx={{ 
            mt: 2,
            backgroundColor: "#F97316",
            '&:hover': { backgroundColor: "#ea580c" }
          }}
        >
          Parcourir les restaurants
        </Button>
      </Container>
    );
  }

  const handleCommander = () => {
    const panierData = {
      items: cartItems,
      fraisLivraison,
      total: totalAmount + fraisLivraison
    };

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

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <List>
          {cartItems.map((item, index) => (
            <React.Fragment key={item.plat.idPlat}>
              {index > 0 && <Divider />}
              <ListItem sx={{ py: 2 }}>
                <Box
                  component="img"
                  src={item.plat.image}
                  alt={item.plat.nom}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    mr: 2,
                    objectFit: 'cover'
                  }}
                />
                <ListItemText
                  primary={item.plat.nom}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {formatPrix(item.plat.prix)} / unité
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => ajusterQuantite(item.plat.idPlat, item.quantite, "diminuer")}
                    >
                      -
                    </Button>
                    <Typography>{item.quantite}</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => ajusterQuantite(item.plat.idPlat, item.quantite, "augmenter")}
                    >
                      +
                    </Button>
                    <IconButton 
                      onClick={() => removeFromCart(item.plat.idPlat)}
                      sx={{ color: "#F97316" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Récapitulatif
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Sous-total</Typography>
          <Typography>{formatPrix(totalAmount)}</Typography>
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
          <Typography fontWeight="bold">
            {formatPrix(totalAmount + fraisLivraison)}
          </Typography>
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
