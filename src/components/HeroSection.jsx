import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [address, setAddress] = useState('');

  const handleSearchChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearchClick = () => {
    if (address.trim()) {
      // Ajoutez ici votre logique de recherche
      console.log(`Recherche d'adresse: ${address}`);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#F97316',
        color: 'white',
        minHeight: { xs: '40vh', sm: 500 },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, sm: 0 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 6 },
          width: '100%',
          mx: 'auto',
          maxWidth: 1200,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 28, sm: 36, md: 40 },
            fontWeight: 'bold',
            lineHeight: 1.2,
          }}
        >
          Commandez vos plats
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 28, sm: 36, md: 40 },
            fontWeight: 'bold',
            mb: 2,
            lineHeight: 1.2,
          }}
        >
          préférés en quelques clics
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 18 },
            mb: 3,
            maxWidth: 600,
          }}
        >
          TchôpShap vous livre les meilleurs restaurants directement chez vous.
        </Typography>

        {/* Zone de recherche */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            maxWidth: 700,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <TextField
            placeholder="Entrez votre adresse de livraison"
            variant="outlined"
            fullWidth
            value={address}
            onChange={handleSearchChange}
            sx={{
              bgcolor: 'white',
              borderRadius: { xs: 2, sm: '4px 0 0 4px' },
              flexGrow: 1,
            }}
            aria-label="Adresse de livraison"
          />
          <Button
            variant="contained"
            onClick={handleSearchClick}
            sx={{
              bgcolor: '#D95316',
              height: 'auto',
              borderRadius: { xs: 2, sm: '0 4px 4px 0' },
              boxShadow: 'none',
              px: 3,
              mt: { xs: 1, sm: 0 },
            }}
            aria-label="Rechercher"
          >
            <SearchIcon sx={{ mr: 1 }} />
            Rechercher
          </Button>
        </Box>
      </Box>

      {/* Vague en bas */}
      <Box
        component="img"
        src="/Vector.png"
        alt="vector"
        sx={{
          width: '100%',
          height: 'auto',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      />
    </Box>
  );
}

export default HeroSection;
