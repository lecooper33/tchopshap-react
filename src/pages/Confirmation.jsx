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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Confirm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: { xs: 40, sm: 48 },
                color: "#10b981", // Couleur corrigée
                mb: 2,
              }}
            />

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
                  flexWrap:'wrap',
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
            >
              Commander à nouveau
            </Button>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </div>
  );
}
