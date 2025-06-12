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
  
  // Récupération des données du state
  const state = location.state || {};
  const {
    total = 0,
    sousTotal = 0,
    fraisLivraison = 0,
    idPlat,
    items = []
  } = state;

  // Vérification explicite de l'utilisateur et de son ID
  useEffect(() => {
    console.log("=== Vérification de l'authentification ===");
    console.log("User object:", user);
    console.log("User ID:", user?.id);
    
    if (!user) {
      console.log("❌ Utilisateur non connecté, redirection vers la page de profil");
      navigate("/profil", { state: { from: location.pathname } });
    } else if (!user.id) {
      console.log("❌ ID utilisateur manquant dans l'objet user");
    } else {
      console.log("✅ Utilisateur authentifié avec ID:", user.id);
    }
  }, [user, navigate, location.pathname]);

  // Récupération de l'ID utilisateur du contexte d'authentification
  const idUtilisateur = user?.id;

  const [modePaiement, setModePaiement] = useState("");
  const [loading, setLoading] = useState(false);
  const [numeroMobile, setNumeroMobile] = useState("");

  const handleConfirm = async () => {
    // Vérification détaillée des informations requises
    console.log("=== Vérification des informations ===");
    console.log("modePaiement:", modePaiement);
    console.log("idPlat:", idPlat);
    console.log("idUtilisateur:", idUtilisateur);
    console.log("user:", user);
    console.log("location.state:", location.state);
    console.log("items:", items);

    if (!user) {
      navigate("/profil", { state: { from: location.pathname } });
      return;
    }

    if (!modePaiement || !idPlat || !idUtilisateur) {
      console.log("=== Détails des informations manquantes ===");
      if (!modePaiement) console.log("❌ Mode de paiement non sélectionné");
      if (!idPlat) console.log("❌ ID du plat manquant");
      if (!idUtilisateur) console.log("❌ ID de l'utilisateur manquant");
      return;
    }

    if (modePaiement === "Airtel Money" && !numeroMobile) {
      console.log("Numéro Mobile Money manquant");
      return;
    }

    setLoading(true);

    try {
      // Paiement via PVit
      if (modePaiement === "Airtel Money") {
        console.log("Début de la requête PVit...");
        const paiementResponse = await axios.post("https://tchopshap.onrender.com/api/rest-transaction", {
          amount: total,
          customer_account_number: numeroMobile,
          product: "CommandePlat",
          free_info: "Paiement App"
        });

        console.log("Réponse de l'API PVit:", paiementResponse.data);
        const paiementData = paiementResponse.data;

        if (!paiementData.success || paiementData.data.status !== "SUCCESS") {
          console.log("Échec du paiement:", paiementData);
          setLoading(false);
          return;
        }
      }

      // Enregistrement de la commande
      console.log("Envoi de la commande...");
      const commande = {
        idUtilisateur,
        idPlat,
        statut: "en préparation",
        modeDePaiement: modePaiement,
        date_com: new Date().toISOString(),
      };
      console.log("Données de la commande:", commande);

      const response = await axios.post("https://tchopshap.onrender.com/commande", commande);
      console.log("Réponse de l'API commande:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log("Commande créée avec succès!");
        navigate("/Confirmation");
      } else {
        console.log("Erreur lors de la création de la commande:", response);
      }
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/Cart", {
      state: {
        idPlat,
        idUtilisateur,
        total,
        sousTotal,
        fraisLivraison,
        items
      }
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 3 }}>
        <Button onClick={handleBack} sx={{ color: "black", textTransform: "none" }}>
          <ArrowBack /> <Typography ml={1}>Retour</Typography>
        </Button>

        <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
          Finaliser la commande
        </Typography>
        <Typography>
          Remplissez les informations ci-dessous pour finaliser votre commande
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
                <Typography>Date d’expiration</Typography>
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
              checked={modePaiement === "Airtel Money"}
              onChange={() => setModePaiement("Airtel Money")}
            />
            <Typography>Mobile Money</Typography>
          </Box>
          {modePaiement === "Airtel Money" && (
            <TextField
              fullWidth
              size="small"
              placeholder="Numéro Mobile Money"
              sx={{ mt: 1 }}
              value={numeroMobile}
              onChange={(e) => setNumeroMobile(e.target.value)}
            />
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
          {loading ? "Envoi en cours..." : "Confirmer la commande"}
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
