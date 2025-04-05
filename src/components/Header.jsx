import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Link } from "@mui/material";
import { FiUser } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";

const Header = () => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "white" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "95%" }}>
        {/* Logo ou Nom */}
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "orange" }}>
          TchôpShap
        </Typography>

        {/* Navigation */}
        <Box component="nav" sx={{ display: "flex", gap: 4 }}>
          <Link href="#" underline="none" color="inherit" sx={{ "&:hover": { textDecoration: "underline" } }}>
            Accueil
          </Link>
          <Link href="#" underline="none" color="inherit" sx={{ "&:hover": { textDecoration: "underline" } }}>
            Restaurants
          </Link>
          <Link href="#" underline="none" color="inherit" sx={{ "&:hover": { textDecoration: "underline" } }}>
            Plats
          </Link>
        </Box>

        {/* Actions (Connexion + Panier) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FiUser size={20} />
          <Button color="inherit">Connexion</Button>
          <IconButton>
            <Badge badgeContent={1} color="error">
              <LuShoppingCart size={20} />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

