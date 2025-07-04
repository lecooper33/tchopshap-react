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
        // Remplacez l'URL par celle de votre API pour récupérer les commandes du restaurant
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://tchopshap.onrender.com/commandes/restaurant/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCommandes(res.data);
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
      await axios.patch(
        `https://tchopshap.onrender.com/commandes/${commandeId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === commandeId ? { ...cmd, status: action } : cmd
        )
      );
    } catch (err) {
      alert("Erreur lors de la mise à jour de la commande.");
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
                    <TableRow key={commande._id}>
                      <TableCell>{commande.client?.nom || "-"}</TableCell>
                      <TableCell>
                        {commande.plats?.map((p) => p.nom).join(", ")}
                      </TableCell>
                      <TableCell>{commande.montant} FCFA</TableCell>
                      <TableCell>
                        <Chip
                          label={commande.status}
                          color={
                            commande.status === "annulée"
                              ? "error"
                              : commande.status === "en pause"
                              ? "warning"
                              : "success"
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={actionLoading[commande._id] || commande.status === "annulée"}
                          onClick={() => handleAction(commande._id, "annulée")}
                          sx={{ mr: 1 }}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          disabled={actionLoading[commande._id] || commande.status === "en pause" || commande.status === "annulée"}
                          onClick={() => handleAction(commande._id, "en pause")}
                        >
                          Mettre en pause
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
