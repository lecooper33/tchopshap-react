import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Button,
  Avatar
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
  const [modePaiement, setModePaiement] = useState("");
  
  // États pour les informations de livraison
  const [nomComplet, setNomComplet] = useState(user?.nom || "");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState(user?.numeroDeTel || "");
  const [instructions, setInstructions] = useState("");
  
  // Récupération des données du state
  const state = location.state || {};
  const {
    commandes = [], // tableau [{idCommande, idRestaurant, montantTotal}]
    items = [],
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
        const commandes = response.data.data || [];
        
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
          // setCommandeId(derniereCommande.idCommande);
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

  // Synchroniser les champs nom et téléphone si l'utilisateur change
  useEffect(() => {
    if (user) {
      setNomComplet(user.nom || "");
      setTelephone(user.numeroDeTel || "");
    }
  }, [user]);

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
    if (!commandes.length) {
      alert("Aucune commande à traiter");
      return;
    }
    setLoading(true);
    try {
      for (const cmd of commandes) {
        let paiementOk = true;
        if (modePaiement === "Mobile Money") {
          const paiementResponse = await axios.post("https://tchopshap.onrender.com/api/rest-transaction", {
            amount: cmd.montantTotal || total,
            customer_account_number: telephone,
            product: "CommandePlat",
            free_info: nomComplet
          });
          if (!paiementResponse.data.success || paiementResponse.data.data.status !== "SUCCESS") {
            paiementOk = false;
            break;
          }
        } else if (modePaiement === "Carte Bancaire") {
          const paiementResponse = await axios.post("https://tchopshap.onrender.com/api/payment/generate-link", {
            amount: cmd.montantTotal || total,
            customer_account_number: telephone,
            service: "VISA_MASTERCARD",
            agent: "WEB",
            product: "CommandePlat",
            free_info: nomComplet,
            owner_charge: "CUSTOMER",
            operator_owner_charge: "CUSTOMER"
          });
          if (paiementResponse.data.success && paiementResponse.data.paymentLink) {
            await axios.put(`https://tchopshap.onrender.com/commande/${cmd.idCommande}`, {
              modeDePaiement: modePaiement,
              statut: "en préparation",
              date_com: new Date().toISOString(),
              montant_total: cmd.montantTotal || total
            });
            window.location.href = paiementResponse.data.paymentLink;
            return;
          } else {
            paiementOk = false;
            break;
          }
        }
        // Mise à jour de la commande après paiement (ou pour espèces)
        if (paiementOk || modePaiement === "Espèce") {
          await axios.put(`https://tchopshap.onrender.com/commande/${cmd.idCommande}`, {
            modeDePaiement: modePaiement,
            statut: "en préparation",
            date_com: new Date().toISOString(),
            montant_total: cmd.montantTotal || total
          });
        } else {
          throw new Error("Paiement échoué pour une commande");
        }
      }
      navigate("/Confirmation");
    } catch (error) {
      navigate("/payment-error");
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