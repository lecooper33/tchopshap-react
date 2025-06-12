import { 
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Restaurant,
  Fastfood,
  ShoppingCart,
  Category,
  DeliveryDining,
  LocalShipping
} from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    restaurant: [],
    plat: [],
    commande: [],
    categorie: [],
    livreur: [],
    livraison: [],
  });
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const previousCommandeIds = useRef(new Set());

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const [
        resRestaurant,
        resPlat,
        resCommande,
        resCategorie,
        resLivreur,
        resLivraison,
      ] = await Promise.all([
        axios.get("https://tchopshap.onrender.com/restaurant"),
        axios.get("https://tchopshap.onrender.com/plat"),
        axios.get("https://tchopshap.onrender.com/commande"),
        axios.get("https://tchopshap.onrender.com/categorie"),

      ]);

      // Détection nouvelles commandes
      const currentCommandeIds = new Set(resCommande.data.map(c => c._id));
      // Trouver les commandes présentes maintenant mais pas avant
      const newCommandes = [...currentCommandeIds].filter(id => !previousCommandeIds.current.has(id));

      if (newCommandes.length > 0) {
        setNotifMessage(`Nouvelle commande reçue (${newCommandes.length}) !`);
        setNotifOpen(true);
      }

      previousCommandeIds.current = currentCommandeIds;

      setStats({
        restaurant: resRestaurant.data,
        plat: resPlat.data,
        commande: resCommande.data,
        categorie: resCategorie.data,

      });

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Polling toutes les 30 secondes pour vérifier les nouvelles commandes
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Restaurants",
      icon: <Restaurant />,
      count: stats.restaurant.length,
      color: "#1976d2",
      route: "/admin/restaurants",
    },
    {
      title: "Plats",
      icon: <Fastfood />,
      count: stats.plat.length,
      color: "#d32f2f",
      route: "/admin/plats",
    },
    {
      title: "Commandes",
      icon: <ShoppingCart />,
      count: stats.commande.length,
      color: "#388e3c",
      route: "/admin/commandes",
    },
    {
      title: "Catégories",
      icon: <Category />,
      count: stats.categorie.length,
      color: "#f57c00",
      route: "/admin/categories",
    },

  ];

  return ( 
    <AdminLayout>
      <Typography variant="h4" gutterBottom>Tableau de bord</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} color="#FFA500" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((card, index) => (
            <Grid  xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  bgcolor: card.color,
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                  borderRadius: 2
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  {card.icon}
                  <Typography variant="h6">{card.title}</Typography>
                </Box>
                <Typography variant="h4">{card.count}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1, bgcolor: "white", color: card.color }}
                  onClick={() => navigate(card.route)}
                >
                  Voir plus
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notifOpen}
        autoHideDuration={6000}
        onClose={() => setNotifOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotifOpen(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {notifMessage}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}


