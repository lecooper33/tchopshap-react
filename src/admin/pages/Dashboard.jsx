import {
  Box, Grid, Paper, Typography, Button, CircularProgress,
  Snackbar, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, MenuItem,
  Select, FormControl, InputLabel
} from "@mui/material";
import {
  Restaurant, Fastfood, ShoppingCart,
  TrendingUp, TrendingDown, AttachMoney
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from 'recharts';
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { format, subDays, startOfDay, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const StatCard = ({ title, count, icon, color, route, trend, subtitle }) => {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        borderRadius: 2,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
        }
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        {trend && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {trend > 0 ? 
              <TrendingUp sx={{ color: "#4caf50" }} /> : 
              <TrendingDown sx={{ color: "#f44336" }} />
            }
            <Typography variant="body2">
              {Math.abs(trend)}%
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>{count}</Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      )}
      <Button
        variant="contained"
        size="small"
        sx={{
          mt: 1,
          bgcolor: "rgba(255,255,255,0.9)",
          color,
          "&:hover": {
            bgcolor: "white",
          }
        }}
        onClick={() => navigate(route)}
      >
        Voir plus
      </Button>
    </Paper>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    restaurant: [],
    plat: [],
    commande: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [periodFilter, setPeriodFilter] = useState(7); // 7 jours par défaut
  const previousCommandeIds = useRef(new Set());
  const [dailyStats, setDailyStats] = useState([]);
  const [userCommands, setUserCommands] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const calculateStats = useCallback((commands) => {
    const today = startOfDay(new Date());
    const todayCommands = commands.filter(cmd => {
      if (!cmd.date_com) return false;
      try {
        const commandDate = parseISO(cmd.date_com);
        return isValid(commandDate) && startOfDay(commandDate).getTime() === today.getTime();
      } catch (error) {
        return false;
      }
    });

    const totalAmount = commands.reduce((sum, cmd) => sum + (cmd.montant || 0), 0);
    const todayAmount = todayCommands.reduce((sum, cmd) => sum + (cmd.montant || 0), 0);

    return {
      todayCommands: todayCommands.length,
      todayAmount,
      totalAmount,
      avgOrderValue: commands.length ? totalAmount / commands.length : 0
    };
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const [resRestaurant, resPlat, resCommande, resUsers] = await Promise.all([
        axios.get("https://tchopshap.onrender.com/restaurant"),
        axios.get("https://tchopshap.onrender.com/plat"),
        axios.get("https://tchopshap.onrender.com/commande"),
        axios.get("https://tchopshap.onrender.com/utilisateurs")
      ]);

      // Ajout de logs pour voir ce que le backend renvoie
      console.log('Réponse commandes brute:', resCommande.data);
      console.log('Réponse restaurants brute:', resRestaurant.data);
      console.log('Réponse plats brute:', resPlat.data);
      console.log('Réponse utilisateurs brute:', resUsers.data);

      // Récupérer les données et sécuriser le typage
      const allRestaurants = Array.isArray(resRestaurant.data.data) ? resRestaurant.data.data : [];
      const allPlats = Array.isArray(resPlat.data.data) ? resPlat.data.data : [];
      const allCommandes = Array.isArray(resCommande.data.data) ? resCommande.data.data : [];
      const allUsers = Array.isArray(resUsers.data.data) ? resUsers.data.data : [];

      // 1. Filtrer les restaurants de l'utilisateur
      const userRestaurants = allRestaurants.filter(
        resto => parseInt(resto.idUtilisateur) === userId
      );

      // 2. Extraire les ID des restaurants
      const restaurantIds = userRestaurants.map(resto =>
        parseInt(resto.idRestaurant)
      );

      // 3. Filtrer les plats liés aux restaurants de l'utilisateur
      const userPlats = allPlats.filter(plat =>
        restaurantIds.includes(parseInt(plat.idRestaurant))
      );

      // 4. Filtrer les commandes liées à ces restaurants
      const userCommandes = allCommandes.filter(cmd =>
        restaurantIds.includes(parseInt(cmd.idRestaurant))
      );

      // 5. Vérifier les nouvelles commandes
      const currentCommandeIds = new Set(userCommandes.map(cmd => cmd.idCommande));
      const hasNewCommandes = [...currentCommandeIds].some(
        id => !previousCommandeIds.current.has(id)
      );

      if (hasNewCommandes) {
        setNotifMessage("Nouvelle(s) commande(s) reçue(s) !");
        setNotifOpen(true);
      }

      previousCommandeIds.current = currentCommandeIds;

      // 6. Préparer les données pour les graphiques
      const lastDays = Array.from({ length: periodFilter }, (_, i) => {
        const date = subDays(new Date(), i);
        const dayStr = format(date, 'EEEE', { locale: fr });
        const dayCommands = userCommandes.filter(cmd => {
          if (!cmd.date_com) return false;
          try {
            const commandDate = parseISO(cmd.date_com);
            return isValid(commandDate) &&
              startOfDay(commandDate).getTime() === startOfDay(date).getTime();
          } catch (error) {
            console.error("Date invalide:", cmd.date_com);
            return false;
          }
        });
        return {
          name: dayStr,
          commandes: dayCommands.length,
          montant: dayCommands.reduce((sum, cmd) => sum + parseFloat(cmd.total || 0), 0)
        };
      }).reverse();

      setDailyStats(lastDays);

      // 7. Ajouter les infos utilisateurs dans les commandes
      const commandesWithUserInfo = userCommandes.map(cmd => {
        const user = allUsers.find(u => u.idUtilisateur === cmd.idUtilisateur);
        return {
          ...cmd,
          userName: user ? `${user.nom} ${user.prenom || ''}` : (cmd.nomUtilisateur || 'Utilisateur inconnu'),
          platNom: cmd.nomPlat || 'Plat inconnu'
        };
      }).sort((a, b) => new Date(b.date_com) - new Date(a.date_com));

      // 8. Mettre à jour les états
      setUserCommands(commandesWithUserInfo);
      setStats({
        restaurant: userRestaurants,
        plat: userPlats,
        commande: userCommandes,
        users: allUsers
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
    }
  }, [userId, periodFilter]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const calculatedStats = useMemo(() => calculateStats(stats.commande), [stats.commande, calculateStats]);

  const statCards = useMemo(() => [
    {
      title: "Restaurants",
      icon: <Restaurant />,
      count: stats.restaurant.length,
      color: "#1976d2",
      route: "/admin/restaurants",
      trend: 12
    },
    {
      title: "Plats",
      icon: <Fastfood />,
      count: stats.plat.length,
      color: "#d32f2f",
      route: "/admin/plats",
      trend: 8
    },
    {
      title: "Commandes du jour",
      icon: <ShoppingCart />,
      count: calculatedStats.todayCommands,
      subtitle: `${calculatedStats.todayAmount.toLocaleString()} FCFA`,
      color: "#388e3c",
      route: "/admin/commandes",
      trend: 15
    },
    {
      title: "Chiffre d'affaires",
      icon: <AttachMoney />,
      count: `${calculatedStats.totalAmount.toLocaleString()} FCFA`,
      subtitle: `Moy. par commande: ${Math.round(calculatedStats.avgOrderValue).toLocaleString()} FCFA`,
      color: "#f57c00",
      route: "/admin/commandes",
      trend: 20
    }
  ], [stats, calculatedStats]);

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
          Tableau de bord
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} sx={{ color: "orange" }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Cartes statistiques */}
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard {...card} />
              </Grid>
            ))}

            {/* Filtre de période et graphique des commandes */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Évolution des commandes
                  </Typography>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="periode-label">Période</InputLabel>
                    <Select
                      labelId="periode-label"
                      value={periodFilter}
                      label="Période"
                      onChange={(e) => setPeriodFilter(e.target.value)}
                    >
                      <MenuItem value={7}>7 derniers jours</MenuItem>
                      <MenuItem value={14}>14 derniers jours</MenuItem>
                      <MenuItem value={30}>30 derniers jours</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100%', height: 300, overflowX: 'auto' }}>
                  <LineChart
                    width={Math.max(800, dailyStats.length * 100)}
                    height={300}
                    data={dailyStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="commandes" 
                      name="Nombre de commandes"
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="montant" 
                      name="Montant (FCFA)"
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </Box>
              </Paper>
            </Grid>

            {/* Tableau des dernières commandes */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Dernières commandes
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID Commande</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Restaurant</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Montant</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Mode de paiement</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userCommands
                        .filter(cmd => stats.restaurant.some(resto => parseInt(resto.idRestaurant) === parseInt(cmd.idRestaurant)))
                        .slice(0, 10)
                        .map((cmd) => (
                          <TableRow key={cmd.idCommande}>
                            <TableCell>#{cmd.idCommande}</TableCell>
                            <TableCell>{cmd.nomUtilisateur || cmd.userName}</TableCell>
                            <TableCell>{cmd.nomRestaurant}</TableCell>
                            <TableCell>
                              {cmd.date_com ? format(parseISO(cmd.date_com), 'Pp', { locale: fr }) : 'Date non disponible'}
                            </TableCell>
                            <TableCell>{cmd.total ? `${parseFloat(cmd.total).toLocaleString()} FCFA` : '-'}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  backgroundColor: 
                                    cmd.statut === 'en préparation' ? '#fff3cd' :
                                    cmd.statut === 'livré' ? '#d4edda' :
                                    '#f8d7da',
                                  color: 
                                    cmd.statut === 'en préparation' ? '#856404' :
                                    cmd.statut === 'livré' ? '#155724' :
                                    '#721c24',
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 1,
                                  display: 'inline-block'
                                }}
                              >
                                {cmd.statut}
                              </Box>
                            </TableCell>
                            <TableCell>{cmd.modeDePaiement}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

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
      </Box>
    </AdminLayout>
  );
}


