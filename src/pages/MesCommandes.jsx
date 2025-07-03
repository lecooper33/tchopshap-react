import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Chip, Button, CircularProgress, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MesCommandes = () => {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCommandes = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`https://tchopshap.onrender.com/commande/${user.id}`);
      setCommandes(res.data);
    } catch (e) {
      setError("Erreur lors du chargement des commandes.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommandes();
    // eslint-disable-next-line
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <>
      <Header />
      <Box maxWidth={700} mx="auto" my={4} px={2}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={700}>Historique de mes commandes</Typography>
            <Button onClick={fetchCommandes} startIcon={<RefreshIcon />} variant="outlined">Rafraîchir</Button>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error.main">{error}</Typography>
          ) : commandes.length === 0 ? (
            <Typography color="text.secondary">Aucune commande trouvée.</Typography>
          ) : (
            <List sx={{ maxHeight: 500, overflow: 'auto' }}>
              {commandes.map(cmd => (
                <ListItem key={cmd.idCommande} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={600}>Commande #{cmd.idCommande}</Typography>
                        <Chip label={cmd.statut} sx={{ fontWeight: 600, bgcolor: cmd.statut === 'livrée' ? '#e8f5e9' : '#fff3e0', color: cmd.statut === 'livrée' ? '#2e7d32' : 'primary.dark' }} />
                      </Box>
                    }
                    secondary={<Typography variant="body2" color="text.secondary">{formatDate(cmd.dateCommande)}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

export default MesCommandes;
