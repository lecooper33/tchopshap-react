import React, { useState } from "react";

import { Container, Typography, Box, Paper, Button, IconButton, Link} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Panier() {
  const [quantite, setQuantite] = useState(1);
  const prixPlat = 12.9;
  const fraisLivraison = 2.99;

  const augmenter = () => setQuantite(q => q + 1);
  const diminuer = () => setQuantite(q => Math.max(1, q - 1));
  const reset = () => setQuantite(1);

  
  const formatPrix = (prix) => {
    return prix.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const sousTotal = quantite * prixPlat;
  const total = sousTotal + fraisLivraison;

  return (
    <div>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2} translate="no">
          Votre panier
        </Typography>

        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight="bold" mb={1} translate="no">
            Le Burger Gourmet
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box 
              component="img" 
              src="/Img/Image (1).png" 
              alt="burger" 
              sx={{ width: 64, height: 64, borderRadius: 1 }} 
            />

            <Box>
              <Typography translate="no">Burger Classique</Typography>
              <Typography translate="no">{formatPrix(prixPlat)}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              <Button onClick={diminuer} translate="no">-</Button>
              <Typography sx={{ mx: 1 }} translate="no">{quantite}</Typography>
              <Button onClick={augmenter} translate="no">+</Button>
              <IconButton onClick={reset} color="error" aria-label="Supprimer">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography fontWeight="bold" mb={2} translate="no">
            Récapitulatif
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography translate="no">Sous-total</Typography>
            <Typography translate="no">{formatPrix(sousTotal)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography translate="no">Frais de livraison</Typography>
            <Typography translate="no">{formatPrix(fraisLivraison)}</Typography>
          </Box>

          <Box sx={{ 
            display: "flex", justifyContent: "space-between", 
            mb: 2, mt: 2, pt: 2,
            borderTop: "1px solid rgba(0,0,0,0.12)"}}>
            <Typography fontWeight="bold" translate="no">Total</Typography>
            <Typography fontWeight="bold" translate="no">{formatPrix(total)}</Typography>
          </Box>

          <Link href='/Profil'> <Button fullWidth variant="contained" 
            sx={{ 
              backgroundColor: "orange", 
              color: "white", "&:hover": { backgroundColor: "darkorange" }}}
            translate="no">
            Commander
          </Button>
          </Link>
        </Paper>
      </Container>
    </div>
  );
}