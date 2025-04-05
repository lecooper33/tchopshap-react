import React from 'react';
import { Box, Typography, Container, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function HeroSection() {
  return (

      <Box sx={{ position: 'relative', width:'100%', backgroundColor: '#F97316', color: 'white', height: 480, display: 'flex', alignItems: 'center' }}>
        <Container>
          <Typography sx={{ fontSize: 40, fontWeight: 'bold' }}>
            Commandez vos plats 
          </Typography>
          <Typography sx={{ fontSize: 40, fontWeight: 'bold', mb: 2 }}>
            préférés en quelques clics
          </Typography>
          <Typography sx={{ fontSize: 18, mb: 3 }}>
            TchôpShap vous livre les meilleurs restaurants directement chez vous.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '80%', maxWidth: '700px' }}>
  <TextField 
    placeholder="Entrez votre adresse de livraison"
    variant="outlined"
    sx={{ bgcolor: 'white', borderRadius: '4px 0 0 4px', flexGrow: 1 
    }} 
  />
  <Button 
    variant="contained" sx={{ bgcolor: '#D95316', height: '56px', borderRadius: '0 4px 4px 0', boxShadow: 'none' 
    }}
  >
    <SearchIcon />
    Rechercher
  </Button>
</Box>

        </Container>

        {/* Vague en bas */}
        
        <Box component="img" src='/Vector.png' alt='vector' sx={{ width:'100%', height: '7vh', position:'absolute',bottom:'0'}}/>
      </Box>
    
  );
}

export default HeroSection;
