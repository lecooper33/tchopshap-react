import React, { useState } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

export default function Panier() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateCartItem, removeFromCart, totalAmount, clearCart } = useCart();
  const fraisLivraison = 500;
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
  // Fonction supprimée car non utilisée

  const handleCommander = async () => {
    if (!user) {
      navigate("/profil", { state: { from: "/Cart" } });
      return;
    }

    setLoading(true);
    try {
      const commande = {
        idUtilisateur: parseInt(user.id),
        idPlat: parseInt(cartItems[0]?.plat?.idPlat),
        statut: "en préparation",
        modeDePaiement: "",
        date_com: new Date().toISOString()
      };

      console.log("Envoi de la commande:", commande);

      const response = await axios.post(
        "https://tchopshap.onrender.com/commande",
        commande
      );
      
      console.log("Réponse du serveur:", response.data);

      if (response.status === 200 || response.status === 201) {
        const panierData = {
          commandeId: response.data.idCommande,
          items: cartItems,
          fraisLivraison,
          sousTotal: totalAmount,
          total: totalAmount + fraisLivraison
        };

        clearCart();
        navigate("/Paiement", { state: panierData });
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant={isSmallScreen ? "h6" : "h5"}>Votre panier est vide.</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/restaurants')}
          sx={{ 
            mt: 2,
            backgroundColor: "#F97316",
            '&:hover': { backgroundColor: "#ea580c" }
          }}
          size={isSmallScreen ? "medium" : "large"}
        >
          Parcourir les restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ 
      mt: isSmallScreen ? 2 : 4, 
      mb: isSmallScreen ? 2 : 4,
      px: isSmallScreen ? 1 : 2
    }}>
      <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={3}>
        Votre panier
      </Typography>

      <Paper elevation={3} sx={{ p: isSmallScreen ? 1 : 2, mb: 3 }}>
        <List>
          {cartItems.map((item, index) => (
            <React.Fragment key={item.plat.idPlat}>
              {index > 0 && <Divider />}
              <ListItem sx={{ 
                py: isSmallScreen ? 1 : 2,
                flexDirection: isSmallScreen ? 'column' : 'row',
                alignItems: isSmallScreen ? 'flex-start' : 'center'
              }}>
                <Box
                  component="img"
                  src={item.plat.image}
                  alt={item.plat.nom}
                  sx={{
                    width: isSmallScreen ? 60 : 80,
                    height: isSmallScreen ? 60 : 80,
                    borderRadius: 1,
                    mr: isSmallScreen ? 1 : 2,
                    mb: isSmallScreen ? 1 : 0,
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{
                  flexGrow: 1,
                  width: isSmallScreen ? '100%' : 'auto',
                  mb: isSmallScreen ? 1 : 0
                }}>
                  <ListItemText
                    primary={item.plat.nom}
                    primaryTypographyProps={{
                      variant: isSmallScreen ? "body1" : "subtitle1",
                      fontWeight: 'medium'
                    }}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {formatPrix(item.plat.prix)} / unité
                      </Typography>
                    }
                  />
                </Box>
                <ListItemSecondaryAction sx={{
                  position: isSmallScreen ? 'relative' : 'absolute',
                  right: isSmallScreen ? 0 : 16,
                  top: isSmallScreen ? 'auto' : '50%',
                  transform: isSmallScreen ? 'none' : 'translateY(-50%)',
                  mt: isSmallScreen ? 1 : 0
                }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size={isSmallScreen ? "small" : "medium"}
                      variant="outlined"
                      onClick={() => ajusterQuantite(item.plat.idPlat, item.quantite, "diminuer")}
                      sx={{ minWidth: 30 }}
                    >
                      -
                    </Button>
                    <Typography>{item.quantite}</Typography>
                    <Button
                      size={isSmallScreen ? "small" : "medium"}
                      variant="outlined"
                      onClick={() => ajusterQuantite(item.plat.idPlat, item.quantite, "augmenter")}
                      sx={{ minWidth: 30 }}
                    >
                      +
                    </Button>
                    <IconButton 
                      onClick={() => removeFromCart(item.plat.idPlat)}
                      sx={{ color: "#F97316" }}
                      size={isSmallScreen ? "small" : "medium"}
                    >
                      <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: isSmallScreen ? 2 : 3 }}>
        <Typography variant={isSmallScreen ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
          Récapitulatif
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant={isSmallScreen ? "body2" : "body1"}>Sous-total</Typography>
          <Typography variant={isSmallScreen ? "body2" : "body1"}>{formatPrix(totalAmount)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant={isSmallScreen ? "body2" : "body1"}>Frais de livraison</Typography>
          <Typography variant={isSmallScreen ? "body2" : "body1"}>{formatPrix(fraisLivraison)}</Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          pt={2}
          borderTop="1px solid #ddd"
        >
          <Typography variant={isSmallScreen ? "subtitle2" : "subtitle1"} fontWeight="bold">Total</Typography>
          <Typography variant={isSmallScreen ? "subtitle2" : "subtitle1"} fontWeight="bold">
            {formatPrix(totalAmount + fraisLivraison)}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleCommander}
          disabled={loading}
          size={isSmallScreen ? "medium" : "large"}
          sx={{
            mt: 3,
            py: isSmallScreen ? 1 : 1.5,
            backgroundColor: "#F97316",
            color: "white",
            "&:hover": { backgroundColor: "#ea580c" },
          }}
        >
          {loading ? "Chargement..." : "Commander"}
        </Button>
      </Paper>
    </Container>
  );
}