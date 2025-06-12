import React from 'react';
import { Container, Grid, Typography, Box, Link } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box sx={{ backgroundColor: '#1E252F', color: '#fff', py: 4 , width:'100%', marginTop:'5%' }}>
      <Container >
        <Grid container spacing={4}>
        
          {/* Section TchôpShap */}
          <Grid xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">
              TchôpShap
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, width:'60%' }}>
              Votre plateforme de livraison de repas préférée. Rapide, fiable et délicieux.
            </Typography>

            {/* Section pour les icônes */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Link href="#" target="_blank" rel="noopener" underline="none" aria-label="Facebook">
                <FacebookOutlinedIcon sx={{ color: 'inherit' }} />
              </Link>
              <Link href="#" target="_blank" rel="noopener" underline="none" aria-label="Instagram">
                <InstagramIcon sx={{ color: 'inherit' }} />
              </Link>
              <Link href="#" target="_blank" rel="noopener" underline="none" aria-label="Twitter">
                <TwitterIcon sx={{ color: 'inherit' }} />
              </Link>
            </Box>
          </Grid>
          
          {/* Section Liens Rapides */}
          <Grid  xs={12} md={4} sx={{ width: '25%' }}>
            <Typography variant="h6" fontWeight="bold">
              Liens Rapides
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/" underline="none" color="inherit" variant="body2"
                sx={{ '&:hover': { textDecoration: 'underline', color: '#f0f0f0' } }}>
                Accueil
              </Link>
              <Link component={RouterLink} to="/restaurants" underline="none" color="inherit" variant="body2"
                sx={{ '&:hover': { textDecoration: 'underline', color: '#f0f0f0' } }}>
                Restaurants
              </Link>
              <Link component={RouterLink} to="/PLatCard" underline="none" color="inherit" variant="body2"
                sx={{ '&:hover': { textDecoration: 'underline', color: '#f0f0f0' } }}>
                Plats
              </Link>
              <Link component={RouterLink} to="/signup" underline="none" color="inherit" variant="body2"
                sx={{ '&:hover': { textDecoration: 'underline', color: '#f0f0f0' } }}>
                Inscription
              </Link>
              <Link component={RouterLink} to="/Profil" underline="none" color="inherit" variant="body2"
                sx={{ '&:hover': { textDecoration: 'underline', color: '#f0f0f0' } }}>
                Connexion
              </Link>
            </Box>
          </Grid>

          {/* Section Contact */}
          <Grid  xs={12} md={4} width={'28%'}>
            <Typography variant="h6" fontWeight="bold">
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LocationOnIcon sx={{ color: 'orange', mr: 1 }} />
              <Typography variant="body2">
                123 Avenue de la République,<br />
                75011 Port-gentil
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <PhoneIcon sx={{ color: 'orange', mr: 1 }} />
              <Typography variant="body2">+33 1 23 45 67 89</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <EmailIcon sx={{ color: 'orange', mr: 1 }} />
              <Typography variant="body2">contact@tchopshap.fr</Typography>
            </Box>
          </Grid>
         
        </Grid>
        
        {/* Footer Bottom */}
        <Box sx={{ borderTop: '1px solid #444', mt: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2">© 2025 TchôpShap. Tous droits réservés.</Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
