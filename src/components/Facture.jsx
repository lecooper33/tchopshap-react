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
  const [modePaiement, setModePaiement] = useState("");
  
  // États pour les informations de livraison
  const [nomComplet, setNomComplet] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // Récupération des données du state
  const state = location.state || {};
  const {
    total = 0,
    sousTotal = 0,
    fraisLivraison = 0
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

  const [operateur, setOperateur] = useState("");
  const [numeroMobile, setNumeroMobile] = useState("");

  // Fonction pour changer l'opérateur et le mode de paiement en même temps
  const handleOperateurChange = (newOperateur) => {
    setOperateur(newOperateur);
    setModePaiement("Mobile Money");
  };

  const handleConfirm = async () => {
    // Validation des informations de livraison
    if (!nomComplet || !adresse || !telephone) {
      alert("Veuillez remplir toutes les informations de livraison obligatoires");
      return;
    }

    // Validation du format du numéro de téléphone
    const numeroRegex = /^0[1-9][0-9]{7}$/;
    if (!numeroRegex.test(telephone)) {
      alert("Le numéro de téléphone doit être au format 0XXXXXXXX (9 chiffres)");
      return;
    }

    if (!commandeId) {
      alert("ID de commande manquant");
      return; 
    }

    setLoading(true);

    try {
      // Mettre à jour d'abord les informations de livraison de la commande
      const updateResponse = await axios.put(`https://tchopshap.onrender.com/commande/${commandeId}`, {
        modeDePaiement: modePaiement,
        nomClient: nomComplet,
        adresseLivraison: adresse,
        telephone: telephone,
        instructions: instructions
      });

      if (updateResponse.status !== 200) {
        throw new Error("Erreur lors de la mise à jour des informations de livraison");
      }

      // Traiter ensuite le paiement selon le mode choisi
      if (modePaiement === "Mobile Money") {
        const paiementResponse = await axios.post("https://tchopshap.onrender.com/api/rest-transaction", {
          amount: total,
          customer_account_number: telephone,
          product: "CommandePlat",
          free_info: nomComplet
        });

        if (!paiementResponse.data.success || paiementResponse.data.data.status !== "SUCCESS") {
          throw new Error(paiementResponse.data.message || "Échec du paiement mobile money");
        }
        
        navigate("/Confirmation");
      } else if (modePaiement === "Carte Bancaire") {
        const paiementResponse = await axios.post("https://tchopshap.onrender.com/api/payment/generate-link", {
          amount: total,
          customer_account_number: telephone,
          service: "VISA_MASTERCARD",
          agent: "WEB",
          product: "CommandePlat",
          free_info: nomComplet,
          owner_charge: "CUSTOMER",
          operator_owner_charge: "CUSTOMER"
        });

        if (paiementResponse.data.success && paiementResponse.data.paymentLink) {
          window.location.href = paiementResponse.data.paymentLink;
        } else {
          throw new Error(paiementResponse.data.message || "Échec de la génération du lien de paiement");
        }
      } else if (modePaiement === "Espèce") {
        navigate("/Confirmation");
      }
    } catch (error) {
      alert("Erreur lors du traitement: " + (error.response?.data?.message || error.message));
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
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Jean Dupont" 
            sx={{ mb: 2 }}
            value={nomComplet}
            onChange={(e) => setNomComplet(e.target.value)}
          />
          <Typography>Adresse de livraison</Typography>
          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            placeholder="Adresse complète" 
            sx={{ mb: 2 }}
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
          <Typography>Numéro de téléphone</Typography>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Ex : 077123456" 
            sx={{ mb: 2 }}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            error={telephone && !/^0[1-9][0-9]{7}$/.test(telephone)}
            helperText={telephone && !/^0[1-9][0-9]{7}$/.test(telephone) ? 
              "Format invalide. Utilisez le format: 0XXXXXXXX" : ""}
          />
          <Typography>Instructions spéciales (optionnel)</Typography>
          <TextField 
            fullWidth 
            multiline 
            rows={2} 
            size="small" 
            placeholder="Indications" 
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </Box>
      </Paper>

      {/* Paiement */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Méthode de paiement
        </Typography>

        {/* Carte Bancaire */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={modePaiement === "Carte Bancaire"}
            onChange={() => setModePaiement("Carte Bancaire")}
          />
          <Typography>Carte bancaire (Visa/Mastercard)</Typography>
        </Box>

        {/* Mobile Money */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={modePaiement === "Mobile Money"}
            onChange={() => setModePaiement("Mobile Money")}
          />
          <Typography>Mobile Money (Airtel Money / Moov Money)</Typography>
        </Box>

        {/* Espèces */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
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
          disabled={loading || !modePaiement}
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