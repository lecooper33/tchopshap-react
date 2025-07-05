import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import SearchDropdown from './SearchDropdown';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Images du diaporama
  const bgImages = [
    '/Img/bacground-hero.jpg',
    '/Img/hero-2.avif',
    '/Img/hero-3.jpg',
    '/Img/hero-4.jpg',
    '/Img/Container.png',
  ];
  const [bgIndex, setBgIndex] = useState(0);
  const [zoom, setZoom] = useState(1.2); // commence légèrement zoomé

  useEffect(() => {
    // Animation de dézoom
    const zoomInterval = setInterval(() => {
      setZoom((z) => (z > 1 ? z - 0.002 : 1));
    }, 16); // ~60fps
    // Changement d'image toutes les 5s
    const imgInterval = setInterval(() => {
      setBgIndex((i) => (i + 1) % bgImages.length);
      setZoom(1.2); // reset zoom à chaque image
    }, 5000);
    return () => {
      clearInterval(zoomInterval);
      clearInterval(imgInterval);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(!!e.target.value);
  };

  const handleSearchClick = async () => {
    if (searchQuery.trim()) {
      setShowDropdown(false);
      // Récupérer les plats depuis l'API pour trouver le plat correspondant
      try {
        const response = await axios.get('https://tchopshap.onrender.com/plat');
        const plats = response.data.data || [];
        const plat = plats.find((p) => p.nom.toLowerCase() === searchQuery.trim().toLowerCase());
        if (plat) {
          addToCart({ plat, quantite: 1 });
        }
      } catch (e) {
        // ignore erreur, on redirige quand même
      }
      navigate('/Cart');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '40vh', sm: 500 },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, sm: 0 },
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* Background animé */}
      <Box
        sx={{
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImages[bgIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease',
          transform: `scale(${zoom})`,
          transitionProperty: 'background-image, transform',
          transitionDuration: '1s, 5s',
          willChange: 'transform',
        }}
      />
      {/* Overlay orange */}
      <Box
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(249,115,22,0.45), rgba(249,115,22,0.45))',
        }}
      />
      {/* Contenu principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
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
            position: 'relative',
          }}
        >
          <Box sx={{ width: '100%', position: 'relative' }}>
            <TextField
              placeholder="Nom de plat ou restaurant"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                bgcolor: 'white',
                borderRadius: { xs: 2, sm: '4px 0 0 4px' },
                flexGrow: 1, outline: 'none',
                
              }}
              aria-label="Recherche plat ou restaurant"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchClick();
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => setShowDropdown(!!searchQuery)}
            />
            {showDropdown && (
              <SearchDropdown query={searchQuery} />
            )}
          </Box>
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
          zIndex: 1,
        }}
      />
    </Box>
  );
}

export default HeroSection;
