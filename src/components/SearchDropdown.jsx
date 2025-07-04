import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, CircularProgress } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from '../context/CartContext';

export default function SearchDropdown({ query, onClose }) {
  const [loading, setLoading] = useState(false);
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Ajout du cache local
  const cacheRef = useRef({});
  // Pour le debounce
  const debounceTimeout = useRef();

  useEffect(() => {
    if (!query) {
      setPlats([]);
      setRestaurants([]);
      return;
    }
    // Debounce : attend 300ms après la dernière frappe
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      // Vérifie si la requête est déjà en cache
      if (cacheRef.current[query]) {
        setPlats(cacheRef.current[query].plats);
        setRestaurants(cacheRef.current[query].restaurants);
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.all([
        axios.get("https://tchopshap.onrender.com/plat"),
        axios.get("https://tchopshap.onrender.com/restaurant"),
      ])
        .then(([platsRes, restosRes]) => {
          const platsFiltres = platsRes.data.filter((p) =>
            p.nom.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 20);
          const restosFiltres = restosRes.data.filter((r) =>
            r.nom.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 20);
          setPlats(platsFiltres);
          setRestaurants(restosFiltres);
          // Mise en cache
          cacheRef.current[query] = {
            plats: platsFiltres,
            restaurants: restosFiltres,
          };
        })
        .finally(() => setLoading(false));
    }, 300);
    // Nettoyage du timeout si le composant est démonté ou query change
    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  if (!query) return null;

  return (
    <Paper
      role="listbox"
      aria-label="Suggestions de recherche"
      aria-live="polite"
      sx={{ 
        position: 'absolute', 
        zIndex: 3, 
        width: '100%', 
        mt: 1, 
        maxHeight: 400, 
        overflowY: 'auto', 
        p: 0, 
        '&::-webkit-scrollbar': { 
          width: '6px' 
        }, 
        '&::-webkit-scrollbar-thumb': { 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          borderRadius: '3px' 
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        cursor: 'pointer'
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <CircularProgress size={24} color="warning" />
        </Box>
      ) : (
        <List sx={{ py: 0 }}>
          {plats.length === 0 && restaurants.length === 0 && (
            <ListItem role="option" aria-disabled="true">
              <ListItemText primary="Aucun résultat trouvé" />
            </ListItem>
          )}
          {plats.map((plat) => (
            <ListItem
              key={"plat-" + plat.idPlat}
              role="option"
              aria-selected="false"
              button
              onClick={() => {
                addToCart({ plat, quantite: 1 });
                navigate('/Cart');
              }}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'action.hover',
                  cursor: 'pointer'
                },
                px: 2,
                py: 1.5
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={plat.image || undefined}
                  sx={{ bgcolor: 'orange', width: 56, height: 56, mr: 1 }}
                >
                  <FastfoodIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight={600}>{plat.nom}</Typography>}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {plat.details}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plat.prix ? `${plat.prix} FCFA` : ''}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
          {restaurants.map((resto) => (
            <ListItem
              key={"resto-" + resto.idRestaurant}
              role="option"
              aria-selected="false"
              button
              onClick={() => navigate(`/restaurants?search=${encodeURIComponent(resto.nom)}`)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'action.hover',
                  cursor: 'pointer'
                },
                px: 2,
                py: 1.5
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={resto.image || undefined}
                  sx={{ bgcolor: '#1976d2', width: 56, height: 56, mr: 1 }}
                >
                  <RestaurantIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight={600}>{resto.nom}</Typography>}
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {resto.adresse}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}