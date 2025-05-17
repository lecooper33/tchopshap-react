import React, { useState, useEffect } from "react";
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

export default function Confirm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Définir l'état de chargement
  const [loading, setLoading] = useState(true);

  // Simuler un appel réseau (exemple avec setTimeout)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // L'action asynchrone est terminée (simulée ici)
    }, 2000); // Délai de 2 secondes

    return () => clearTimeout(timer); // Nettoyage du timer si le composant est démonté
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
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={3}
            textAlign={isMobile ? "center" : "left"}
          >
            Confirmation de commande
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // léger ombrage ajouté
            }}
          >
            {loading ? (
              // Afficher l'indicateur de chargement
              <CircularProgress size={48} sx={{ color: "#FF6A00", mb: 2 }} />
            ) : (
              // Afficher l'icône de confirmation lorsque le chargement est terminé
              <CheckCircleIcon
                sx={{
                  fontSize: { xs: 40, sm: 48 },
                  color: "#10b981",
                  mb: 2,
                }}
              />
            )}

            {!loading && (
              <>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Commande confirmée !
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  marginBottom={3}
                >
                  Votre commande a été enregistrée avec succès.
                </Typography>

                {/* Bloc gris clair avec infos commande */}
                <Box
                  sx={{
                    backgroundColor: "#f1f3f5",
                    borderRadius: "6px",
                    p: 2,
                    textAlign: "left",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Numéro de commande:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#4B5563">
                      ORDER-256261
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Estimation de livraison:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#4B5563">
                      30-45 minutes
                    </Typography>
                  </Box>
                </Box>

                <Link href="/" underline="none">
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "#FF6A00",
                      "&:hover": { backgroundColor: "#e55d00" },
                      textTransform: "none",
                      mb: 2,
                    }}
                    aria-label="Retour à l'accueil"
                  >
                    Retour à l'accueil
                  </Button>
                </Link>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#ccc",
                  }}
                  aria-label="Commander à nouveau"
                >
                  Commander à nouveau
                </Button>
              </>
            )}
          </Paper>
        </Container>
      </Box>

      <Footer />
    </div>
  );
}
