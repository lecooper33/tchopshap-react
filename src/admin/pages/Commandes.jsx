import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Chip
} from "@mui/material";

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        const userId = parseInt(localStorage.getItem("userId"));
        const res = await axios.get("https://tchopshap.onrender.com/commande");
        // Nouvelle structure : res.data.data
        const allCommandes = Array.isArray(res.data.data) ? res.data.data : [];
        // On récupère les restaurants de l'utilisateur
        const restosRes = await axios.get("https://tchopshap.onrender.com/restaurant");
        const userRestaurants = Array.isArray(restosRes.data.data)
          ? restosRes.data.data.filter(r => r.idUtilisateur === userId)
          : [];
        const userRestaurantIds = userRestaurants.map(r => r.idRestaurant);
        // On filtre les commandes liées aux restaurants de l'utilisateur
        const commandesFiltrees = allCommandes.filter(cmd => userRestaurantIds.includes(cmd.idRestaurant));
        setCommandes(commandesFiltrees);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des commandes.");
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, []);

  const handleAction = async (commandeId, action) => {
    setActionLoading((prev) => ({ ...prev, [commandeId]: true }));
    try {
      console.log('Envoi PUT:', {
        url: `https://tchopshap.onrender.com/commande/${commandeId}/statut`,
        data: { statut: action },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const response = await axios.put(
        `https://tchopshap.onrender.com/commande/${commandeId}/statut`,
        { statut: action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log('Réponse backend PUT:', response.data);
      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd.idCommande === commandeId ? { ...cmd, statut: action } : cmd
        )
      );
    } catch (err) {
      alert("Erreur lors de la mise à jour de la commande.");
      console.error('Erreur PUT:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [commandeId]: false }));
    }
  };

  const handleDelete = async (commandeId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
    setActionLoading((prev) => ({ ...prev, [commandeId]: true }));
    try {
      console.log('Envoi DELETE:', {
        url: `https://tchopshap.onrender.com/commande/${commandeId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const response = await axios.delete(
        `https://tchopshap.onrender.com/commande/${commandeId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log('Réponse backend DELETE:', response.data);
      setCommandes((prev) => prev.filter(cmd => cmd.idCommande !== commandeId));
    } catch (err) {
      alert("Erreur lors de la suppression de la commande.");
      console.error('Erreur DELETE:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [commandeId]: false }));
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Commandes
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Plats</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commandes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucune commande trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  commandes.map((commande) => (
                    <TableRow key={commande.idCommande}>
                      <TableCell>{commande.nomUtilisateur || '-'}</TableCell>
                      <TableCell>{commande.nomRestaurant || '-'}</TableCell>
                      <TableCell>{commande.total} FCFA</TableCell>
                      <TableCell>
                        <Chip
                          label={commande.statut}
                          color={
                            commande.statut === "annulée"
                              ? "error"
                              : commande.statut === "en pause"
                              ? "warning"
                              : "success"
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {/* Actions à adapter selon la logique de statut */}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={commande.statut === "annulée"}
                          onClick={() => handleAction(commande.idCommande, "annulée")}
                          sx={{ mr: 1 }}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          disabled={commande.statut === "en pause" || commande.statut === "annulée"}
                          onClick={() => handleAction(commande.idCommande, "en pause")}
                          sx={{ mr: 1 }}
                        >
                          Mettre en pause
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleDelete(commande.idCommande)}
                          disabled={actionLoading[commande.idCommande]}
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AdminLayout>
  );
};

export default Commandes;
