import React, { useState } from "react";
import { Box, Button, Paper, TextField, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      const email = localStorage.getItem("emailUtilisateur");
      if (!email) {
        return showSnackbar("Email utilisateur introuvable. Veuillez vous reconnecter.", "error");
      }

      const response = await axios.get("https://tchopshap.onrender.com/utilisateurs");
      const user = response.data.find((u) => u.email === email);

      if (!user) {
        return showSnackbar("Utilisateur non trouvé", "error");
      }

      const currentTime = new Date();
      const otpExpireDate = new Date(user.otp_expires_at);
      const otpClean = otp.trim();

      if (String(user.OTP) === String(otpClean) && otpExpireDate > currentTime) {
        await axios.put(
          `https://tchopshap.onrender.com/utilisateurs/${user.idUtilsateur}`,
          {
            ...user,
            verifie: "TRUE", 
          }
        );

        showSnackbar(" OTP vérifié avec succès !", "success");

        setTimeout(() => {
          if (user.role === "administrateur") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        showSnackbar("❌ OTP incorrect ou expiré", "error");
      }
    } catch (error) {
      console.error("Erreur de vérification OTP :", error);
      showSnackbar("❌ Erreur lors de la vérification OTP", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ p: 2 }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <TextField
          label="Confirmer le code OTP"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" fullWidth onClick={handleVerifyOtp}>
          Vérifier
        </Button>
      </Paper>

      {/* Snackbar pour affichage visuel */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

