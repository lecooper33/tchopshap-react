import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Button
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Facture() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [commandeId, setCommandeId] = useState(null);
  
  // Récupération des données du state
  const state = location.state || {};
  const {
    total = 0,
    sousTotal = 0,
    fraisLivraison = 0,
    items = []
  } = state;

  useEffect(() => {
    if (!user) {
      navigate("/profil", { state: { from: location.pathname } });
      return;
    }

    // Récupérer la dernière commande de l'utilisateur
    const fetchDerniereCommande = async () => {
      try {
        const response = await axios.get("https://tchopshap.onrender.com/commande");
        const commandes = response.data;
        
        // Filtrer les commandes de l'utilisateur et prendre la plus récente
        const commandesUtilisateur = commandes.filter(
          cmd => cmd.idUtilisateur === parseInt(user.id)
        );

        if (commandesUtilisateur.length > 0) {
          // Trier par date décroissante et prendre la première
          const derniereCommande = commandesUtilisateur.sort(
            (a, b) => new Date(b.date_com) - new Date(a.date_com)
          )[0];

          console.log("Dernière commande trouvée:", derniereCommande);
          setCommandeId(derniereCommande.idCommande);
        } else {
          console.log("Aucune commande trouvée pour l'utilisateur");
          navigate("/Cart");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande:", error);
        navigate("/Cart");
      }
    };

    fetchDerniereCommande();
  }, [user, navigate, location.pathname]);

  const [modePaiement, setModePaiement] = useState("");
  const [operateur, setOperateur] = useState("");
  const [numeroMobile, setNumeroMobile] = useState("");

  // Fonction pour changer l'opérateur et le mode de paiement en même temps
  const handleOperateurChange = (newOperateur) => {
    setOperateur(newOperateur);
    setModePaiement("Mobile Money");
  };

  const handleConfirm = async () => {
    // Validation pour le paiement mobile money
    if (modePaiement === "Mobile Money") {
      if (!operateur) {
        alert("Veuillez sélectionner un opérateur (Airtel Money ou Moov Money)");
        return;
      }
      if (!numeroMobile) {
        alert("Veuillez entrer votre numéro Mobile Money");
        return;
      }
      // Validation du format du numéro
      const numeroRegex = /^0[1-9][0-9]{7}$/;  // Format: 0XXXXXXXX (9 chiffres)
      if (!numeroRegex.test(numeroMobile)) {
        alert("Le numéro mobile doit être au format 0XXXXXXXX (9 chiffres)");
        return;
      }
    }

    if (!commandeId) {
      alert("ID de commande manquant");
      return;
    }

    setLoading(true);

    try {
      // Paiement via PVit pour le mobile money
      if (modePaiement === "Mobile Money") {
        const paiementResponse = await axios.post("https://tchopshap.onrender.com/api/rest-transaction", {
          amount: total,
          customer_account_number: numeroMobile,
          product: "CommandePlat",
          free_info: operateur // Ajout de l'opérateur dans les infos
        });

        const paiementData = paiementResponse.data;
        if (!paiementData.success || paiementData.data.status !== "SUCCESS") {
          alert("Échec du paiement: " + (paiementData.message || "Erreur inconnue"));
          setLoading(false);
          return;
        }
      }

      // Mettre à jour le mode de paiement de la commande
      const modePaiementFinal = modePaiement === "Mobile Money" ? operateur : modePaiement;
      
      const response = await axios.put(`https://tchopshap.onrender.com/commande/${commandeId}`, {
        modeDePaiement: modePaiementFinal
      });

      if (response.status === 200) {
        navigate("/Confirmation");
      } else {
        alert("Erreur lors de la mise à jour du mode de paiement");
      }
    } catch (error) {
      alert("Erreur lors du paiement: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/Cart");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 3 }}>
        <Button onClick={handleBack} sx={{ color: "black", textTransform: "none" }}>
          <ArrowBack /> <Typography ml={1}>Retour</Typography>
        </Button>

        <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
          Paiement de la commande
        </Typography>
        <Typography>
          Choisissez votre méthode de paiement préférée
        </Typography>
      </Box>

      {/* Livraison */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Informations de livraison
        </Typography>
        <Box>
          <Typography>Nom complet</Typography>
          <TextField fullWidth size="small" placeholder="Jean Dupont" sx={{ mb: 2 }} />
          <Typography>Adresse de livraison</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Adresse complète" sx={{ mb: 2 }} />
          <Typography>Numéro de téléphone</Typography>
          <TextField fullWidth size="small" placeholder="Ex : 077123456" sx={{ mb: 2 }} />
          <Typography>Instructions spéciales (optionnel)</Typography>
          <TextField fullWidth multiline rows={2} size="small" placeholder="Indications" />
        </Box>
      </Paper>

      {/* Paiement */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Méthode de paiement
        </Typography>

        {/* Carte Bancaire */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Checkbox
            checked={modePaiement === "Carte Bancaire"}
            onChange={() => setModePaiement("Carte Bancaire")}
          />
          <Typography>Carte bancaire</Typography>
        </Box>

        {modePaiement === "Carte Bancaire" && (
          <Box>
            <TextField fullWidth size="small" placeholder="1234 5678 9012 3456" sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box flex={1}>
                <Typography>Date d'expiration</Typography>
                <TextField fullWidth size="small" placeholder="MM/AA" />
              </Box>
              <Box flex={1}>
                <Typography>CVV</Typography>
                <TextField fullWidth size="small" placeholder="123" />
              </Box>
            </Box>
          </Box>
        )}

        {/* Mobile Money */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={modePaiement === "Mobile Money"}
              onChange={() => {
                if (modePaiement === "Mobile Money") {
                  setModePaiement("");
                  setOperateur("");
                } else {
                  setModePaiement("Mobile Money");
                }
              }}
            />
            <Typography>Mobile Money</Typography>
          </Box>
          {modePaiement === "Mobile Money" && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={operateur === "Airtel Money"}
                    onChange={() => handleOperateurChange("Airtel Money")}
                  />
                  <Typography>Airtel Money</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={operateur === "Moov Money"}
                    onChange={() => handleOperateurChange("Moov Money")}
                  />
                  <Typography>Moov Money</Typography>
                </Box>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Numéro Mobile Money (ex: 074XXXXXX)"
                value={numeroMobile}
                onChange={(e) => setNumeroMobile(e.target.value)}
                error={numeroMobile && !/^0[1-9][0-9]{7}$/.test(numeroMobile)}
                helperText={numeroMobile && !/^0[1-9][0-9]{7}$/.test(numeroMobile) ? 
                  "Format invalide. Utilisez le format: 0XXXXXXXX" : ""}
              />
            </Box>
          )}
        </Box>

        {/* Espèces */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Checkbox
            checked={modePaiement === "Espèce"}
            onChange={() => setModePaiement("Espèce")}
          />
          <Typography>Espèces à la livraison</Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          sx={{
            mt: 3,
            backgroundColor: "orange",
            "&:hover": { backgroundColor: "darkorange" },
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          {loading ? "Traitement en cours..." : "Confirmer le paiement"}
        </Button>
      </Paper>

      {/* Récapitulatif */}
      <Paper sx={{ p: 3, mb: 6 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Récapitulatif
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Sous-total</Typography>
          <Typography>{sousTotal.toLocaleString("fr-FR")} F</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography>Frais de livraison</Typography>
          <Typography>{fraisLivraison.toLocaleString("fr-FR")} F</Typography>
        </Box>

        <Box borderTop="2px solid #000" pt={2} display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold">{total.toLocaleString("fr-FR")} F</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
