import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {
  Box, Button, Checkbox, FormControlLabel, Link,
  TextField, Typography, Paper, Grid
} from "@mui/material";

export default function Profil() {
  return (
    <div>
      <Header />

      {/* Section principale centrée */}
      <Box
        sx={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2, // padding horizontal pour mobile
        }}
      >
        {/* Boîte de connexion */}
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Connexion
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={2}
          >
            Connectez-vous pour accéder à votre compte
          </Typography>

          {/* Info démo */}
          <Box
            sx={{
              backgroundColor: "#e8f0fe",
              padding: 2,
              borderRadius: 1,
              fontSize: 14,
              color: "#1D4ED8",
              mb: 3,
            }}
          >
            <strong>Info démo :</strong>{" "}
            Email : <strong>user@example.com</strong>, Mot de passe :{" "}
            <strong>password</strong> —{" "}
            <Link href="#" underline="hover">Remplir automatiquement</Link>
          </Box>

          {/* Formulaire de connexion */}
          <form>
            {/* Champ Email */}
            <Typography variant="body2" mb={0.5}>
              Adresse e-mail
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="votre@email.com"
              size="small"
            />

            {/* Champ Mot de passe + lien oublié */}
            <Grid container justifyContent="space-between" alignItems="center" mt={2} mb={0.5}>
              <Grid item>
                <Typography variant="body2">Mot de passe</Typography>
              </Grid>
              <Grid item>
                <Link href="#" fontSize={13} underline="hover">
                  Mot de passe oublié ?
                </Link>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              type="password"
              placeholder="Votre mot de passe"
              size="small"
            />

            {/* Checkbox "Se souvenir" */}
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Se souvenir de moi"
              sx={{ mt: 1 }}
            />

            {/* Bouton de connexion */}
            <Link href="/Paiement" underline="none">
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#ff6600",
                  ":hover": { backgroundColor: "#e65c00" },
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Se connecter
              </Button>
            </Link>

            {/* Lien vers l'inscription */}
            <Typography variant="body2" textAlign="center" mt={2}>
              Vous n’avez pas de compte ?{" "}
              <Link href="#" underline="hover" color="orange">
                S’inscrire
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>

      <Footer />
    </div>
  );
}
