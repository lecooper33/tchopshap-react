import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Snackbar, Alert, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from location state, or an empty string if not provided
  const email = location.state?.email || '';

  useEffect(() => {
    // If email is not provided via navigation state, display a message
    if (!email) {
      showSnackbar('Email non fourni. Veuillez vous inscrire ou vous connecter d\'abord.', 'info');
      // Optionally, you might want to redirect the user if no email is present
      // navigate('/register'); // Example redirect
    }
  }, [email, navigate]); // Depend on email and navigate to avoid re-running unnecessarily

  // Function to show the snackbar messages
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle the OTP verification submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation before making the API call
    if (!email) {
      showSnackbar('L\'email est requis pour la vérification OTP.', 'error');
      return;
    }
    if (!otp || otp.trim().length === 0) {
      showSnackbar('Veuillez entrer le code OTP.', 'error');
      return;
    }

    try {
      // Make a POST request to the OTP verification endpoint
      const response = await fetch('https://tchopshap.onrender.com/verifier-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otp.trim() }), // Send trimmed OTP
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        // On successful verification
        showSnackbar(data.message || "OTP vérifié avec succès !", "success");
        // Store JWT token and user role in localStorage for future use
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);

        // Navigate based on the user's role after a short delay for snackbar visibility
        setTimeout(() => {
          if (data.role === "administrateur") {
            navigate("/admin");
          } else {
            navigate("/"); // Or a default user dashboard
          }
        }, 2000); // 2-second delay
      } else {
        // On verification failure (e.g., incorrect OTP, expired OTP)
        showSnackbar(data.message || 'Erreur lors de la vérification OTP.', "error");
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error("Erreur de vérification OTP ou réseau :", error);
      showSnackbar('Problème de connexion au serveur. Veuillez réessayer plus tard.', 'error');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ p: 2, backgroundColor: '#f0f2f5' }} // Added a light background color
    >
      <Paper elevation={6} sx={{ padding: 5, width: 400, borderRadius: 2 }}> {/* Increased padding, elevated paper, rounded corners */}
        <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, color: '#333' }}>
          Vérification OTP
        </Typography>

        {email ? (
          <Typography variant="body1" align="center" sx={{ mb: 3, color: '#555' }}>
            Un code OTP a été envoyé à : <Typography component="span" fontWeight="bold">{email}</Typography>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Veuillez entrer l'email pour recevoir le code OTP.
          </Typography>
        )}

        <form onSubmit={handleVerifyOtp}>
          <TextField
            label="Code OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
            variant="outlined" // Added outlined variant for better visual
            inputProps={{ maxLength: 4 }} // Assuming a 4-digit OTP
            required
            sx={{ mb: 2 }} // Margin bottom
          />
          <Button
            type="submit" // Set type to submit for form handling
            variant="contained"
            fullWidth
            sx={{
              py: 1.5, // Padding vertical
              backgroundColor: '#1976d2', // Primary color
              '&:hover': {
                backgroundColor: '#115293', // Darker on hover
              },
              borderRadius: 1, // Slightly rounded buttons
            }}
          >
            Vérifier
          </Button>
        </form>
      </Paper>

      {/* Snackbar for visual feedback */}
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