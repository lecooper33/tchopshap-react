import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, CircularProgress } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchDropdown({ query, onClose }) {
  const [loading, setLoading] = useState(false);
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setPlats([]);
      setRestaurants([]);
      return;
    }
    setLoading(true);
    Promise.all([
      axios.get("https://tchopshap.onrender.com/plat"),
      axios.get("https://tchopshap.onrender.com/restaurant"),
    ])
      .then(([platsRes, restosRes]) => {
        setPlats(
          platsRes.data.filter((p) =>
            p.nom.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 20)
        );
        setRestaurants(
          restosRes.data.filter((r) =>
            r.nom.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 20)
        );
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) return null;

  return (
    <Paper sx={{ 
      position: 'absolute', 
      zIndex: 10, 
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
    }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <CircularProgress size={24} color="warning" />
        </Box>
      ) : (
        <List sx={{ py: 0 }}>
          {plats.length === 0 && restaurants.length === 0 && (
            <ListItem>
              <ListItemText primary="Aucun résultat trouvé" />
            </ListItem>
          )}
          {plats.map((plat) => (
            <ListItem
              key={"plat-" + plat.idPlat}
              button
              onClick={() => navigate(`/PlatCard?search=${encodeURIComponent(plat.nom)}`)}
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