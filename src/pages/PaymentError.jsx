import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Link,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentError() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Récupérer la méthode de paiement depuis le localStorage ou le state si besoin
  const modePaiement = localStorage.getItem("modePaiement") || "";
  // Récupérer les infos de commande du localStorage si besoin
  const commandeState = localStorage.getItem("commandeState")
    ? JSON.parse(localStorage.getItem("commandeState"))
    : {};

  React.useEffect(() => {
    if (commandeState && commandeState.commandeId) {
      axios.put(`https://tchopshap.onrender.com/commande/${commandeState.commandeId}`, {
        statut: "annulée"
      }).catch(() => {}); // On ignore l'erreur pour ne pas bloquer l'affichage
    }
  }, []);

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
            <ErrorIcon
              sx={{ fontSize: 60, color: "error.main", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom fontWeight={'bold'} color="error">
              Paiement échoué !
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Une erreur est survenue lors du paiement {modePaiement ? `(${modePaiement})` : ''}. Veuillez réessayer ou contacter le support.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="/"
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "#F97316", width: "100%" }}
                onClick={async (e) => {
                  e.preventDefault();
                  if (commandeState && commandeState.commandeId) {
                    try {
                      await axios.put(`https://tchopshap.onrender.com/commande/${commandeState.commandeId}`, {
                        statut: "annulée"
                      });
                    } catch {}
                  }
                  window.location.href = "/";
                }}
              >
                Retour à l'accueil
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="black"
                sx={{ backgroundColor: "#FFFFFF", width: "100%" }}
                onClick={async () => {
                  if (commandeState && commandeState.commandeId) {
                    try {
                      await axios.put(`https://tchopshap.onrender.com/commande/${commandeState.commandeId}`, {
                        statut: "annulée"
                      });
                    } catch {}
                  }
                  navigate("/paiement", { state: commandeState });
                }}
              >
                Réessayer le paiement
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </div>
  );
}
