import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Card, CardContent, CardMedia, Typography, Chip,
  Avatar, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ClientUpload() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUtilisateurs = () => {
    axios.get("https://tchopshap.onrender.com/utilisateurs")
      .then((res) => setUtilisateurs(res.data))
      .catch((err) => console.error("Erreur récupération :", err));
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://tchopshap.onrender.com/utilisateurs/${id}`)
      .then(() => fetchUtilisateurs())
      .catch((err) => console.error("Erreur suppression :", err));
  };

  const handleOpenDialog = (user) => {
    setSelectedUser({ ...user });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios.put(`https://tchopshap.onrender.com/utilisateurs/${selectedUser.idUtilisateur}`, selectedUser)
      .then(() => {
        setOpenDialog(false);
        fetchUtilisateurs();
      })
      .catch((err) => console.error("Erreur modification :", err));
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          p: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        {utilisateurs.map((user) => (
          <Card key={user.idUtilisateur} sx={{ borderRadius: 2, overflow: "hidden", position: "relative" }}>
            {user.image ? (
              <CardMedia component="img" height="200" image={user.image} alt={user.nom} />
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Avatar sx={{ width: 64, height: 64, fontSize: 24 }}>
                  {user.nom?.charAt(0).toUpperCase() || "?"}
                </Avatar>
              </Box>
            )}
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{user.nom}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              <Typography variant="body2" color="text.secondary">{user.numeroDeTel || "Numéro non fourni"}</Typography>

              <Box mt={1} display="flex" gap={1}>
                {user.role && (
                  <Chip label={user.role} size="small" color="primary" />
                )}
                <Chip
                  label={user.verifie === "FALSE" ? "Non vérifié" : "Vérifié"}
                  size="small"
                  color={user.verifie === "FALSE" ? "warning" : "success"}
                />
              </Box>

              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(user.idUtilisateur)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {selectedUser && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Nom" name="nom" value={selectedUser.nom} onChange={handleChange} />
            <TextField label="Email" name="email" value={selectedUser.email} onChange={handleChange} />
            <TextField label="Téléphone" name="numeroDeTel" value={selectedUser.numeroDeTel || ""} onChange={handleChange} />
            <TextField label="Rôle" name="rôle" value={selectedUser.rôle || ""} onChange={handleChange} />
            <TextField label="Image (URL)" name="image" value={selectedUser.image || ""} onChange={handleChange} />
            <TextField label="Vérifie" name="vérifie" value={selectedUser.verifie || ""} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleUpdate}>Enregistrer</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ClientUpload;


