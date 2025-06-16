import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  Link,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Confirm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [commandeInfo, setCommandeInfo] = useState(null);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandeInfo = async () => {
      try {
        // Récupération de la dernière commande de l'utilisateur
        const commandeResponse = await axios.get('https://tchopshap.onrender.com/commande');
        const commandes = commandeResponse.data;
        const userCommande = commandes
          .filter(cmd => cmd.idUtilisateur === user.id)
          .sort((a, b) => new Date(b.date_com) - new Date(a.date_com))[0];

        if (userCommande) {
          setCommandeInfo(userCommande);
          
          // Récupération des informations de l'utilisateur
          const userResponse = await axios.get(`https://tchopshap.onrender.com/utilisateurs/${userCommande.idUtilisateur}`);
          setUserName(userResponse.data.nom);
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des informations:", err);
        setError("Une erreur est survenue lors de la récupération des informations de la commande.");
        setLoading(false);
      }
    };

    if (user) {
      fetchCommandeInfo();
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <Header />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Box
        sx={{
          backgroundColor: "#f8f9fa",
          minHeight: "80vh",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom fontWeight={'bold'}>
              Commande Confirmée!
            </Typography>

            {error ? (
              <Typography color="error">{error}</Typography>
            ) : commandeInfo && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Merci {userName} pour votre commande!
                </Typography>            
                <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                width: "100%"
              }}>
              <Box sx={{
                backgroundColor: "#F9FAFB",
                width: "100%",
                maxWidth: "400px",
                p: 3,
                borderRadius: 1,
                mb: 2,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.05)"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1">
                    Numéro de commande:</Typography>
                  <Typography variant="body1" fontWeight={'bold'}>
                    {commandeInfo.idCommande}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1">
                    Date de commande:</Typography>
                  <Typography variant="body1" fontWeight={'bold'}>
                    {new Date(commandeInfo.date_com).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">
                    Mode de paiement:</Typography>
                  <Typography variant="body1" fontWeight={'bold'}>
                    {commandeInfo.modeDePaiement}
                  </Typography>
                </Box>
              </Box>
            </Box>
              </>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="/"
                variant="contained"
                color="primary"
                sx={{  backgroundColor:"#F97316",width:"100%" }}
              >
                Retour à l'accueil
              </Button>
            </Box>
             <Box sx={{ mt:2}}>
              <Button
                component={Link}
                href="/restaurants"
                variant="contained"
                color="black"
                sx={{  backgroundColor:"#FFFFFF", width:"100%" }}
              >
                Commander à nouveau
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </div>
  );
}
