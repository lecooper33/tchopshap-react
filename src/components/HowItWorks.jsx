import React from "react";
import { Container, Typography, Box, Grid } from '@mui/material';

function HowItWorks() {
  return (
    <Container sx={{ textAlign: 'center', backgroundColor: '#F9FAFB', py: 5 }}>
      <Typography sx={{ fontWeight: 600, fontSize: 30, py: 2 }}>
        Comment ça marche
      </Typography>
      <Typography fontWeight="light">
        Commandez votre repas en trois étapes simples et rapides
      </Typography>

      <Grid container spacing={4} sx={{ py: 2 , gap:'100px'}} justifyContent="center"  >
        {/* Étape 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ textAlign: 'center',alignItems:'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%',
               backgroundColor: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#F97316' }}>1</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, py: 1 }}>Choisissez un restaurant</Typography>
            <Typography fontWeight="light">Parcourez notre sélection de</Typography>
            <Typography fontWeight="light">restaurants de qualité près de chez</Typography>
            <Typography fontWeight="light">vous</Typography>
          </Box>
        </Grid>

        {/* Étape 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ textAlign: 'center',alignItems:'center' }}>
            <Box
              sx={{width: 64, height: 64, borderRadius: '50%',
                backgroundColor: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',}}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#F97316' }}>2</Typography>
            </Box>
            <Typography fontWeight="bold" sx={{ py: 1 }}>Sélectionnez vos plats</Typography>
            <Typography fontWeight="light">Parcourez le menu et ajoutez vos</Typography>
            <Typography fontWeight="light">plats préférés à votre panier.</Typography>
          </Box>
        </Grid>

        {/* Étape 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ textAlign: 'center',alignItems:'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#FFEDD5', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',}}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#F97316' }}>3</Typography>
            </Box>
            <Typography fontWeight="bold" sx={{ py: 1 }}>Livraison rapide</Typography>
            <Typography fontWeight="light">Payez en ligne et recevez votre</Typography>
            <Typography fontWeight="light">commande en un temps record.</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HowItWorks;
