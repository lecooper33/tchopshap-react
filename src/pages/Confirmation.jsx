import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Confirm() {
  return (
    <div>
      <Header />

      <Box
        sx={{
          backgroundColor: "#f8f9fa",
          minHeight: "80vh", padding: "40px 16px",}}>

        <Typography variant="h6" fontWeight="bold" mb={3} ml={5}>
          Confirmation de commande
        </Typography>

        <Paper
          elevation={3}
          sx={{width:'90%',
            margin: "auto", padding: "32px 24px",
            borderRadius: "8px", textAlign: "center",}}>
        
          <CheckCircleIcon
            sx={{
              fontSize: "48px", color: "#dcfce7", marginBottom: "16px",}}/>

          
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Commande confirmée !
          </Typography>

          <Typography variant="body2" color="text.secondary" marginBottom={3}>
            Votre commande a été enregistrée avec succès.
          </Typography>

          {/* Bloc gris clair avec infos commande */}
          <Box
            sx={{
              backgroundColor: "#f1f3f5", borderRadius: "6px",
              padding: "16px 20px", textAlign: "left",
              marginBottom: "24px",}}>

            <Box
              sx={{
                display: "flex", justifyContent: "space-between",
                marginBottom: "8px",}} >
              <Typography variant="body2">Numéro de commande:</Typography>
              <Typography variant="body2" fontWeight="bold" color=" #4B5563">
                ORDER- 256261
              </Typography>
            </Box>

        
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Estimation de livraison:</Typography>
              <Typography variant="body2" fontWeight="bold"color=" #4B5563" >
                30-45 minutes
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#FF6A00",
              "&:hover": { backgroundColor: "#e55d00" },
              textTransform: "none",
              marginBottom: "16px",}}>
            Retour à l'accueil
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#ccc", }}>
            Commander à nouveau
          </Button>
        </Paper>
      </Box>

      <Footer />
    </div>
  );
}
