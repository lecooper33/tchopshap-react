import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, Badge,
  IconButton, Drawer, List, ListItem, ListItemText,
  useMediaQuery, useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { LuShoppingCart } from "react-icons/lu";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletOrMore = useMediaQuery(theme.breakpoints.up("sm"));

  const { user, logout } = useAuth(); // ✅
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const navItems = [
    { text: "Accueil", to: "/", icon: <HomeIcon sx={{ color: "orange", mr: 2 }} /> },
    { text: "Restaurants", to: "/restaurants", icon: <RestaurantIcon sx={{ color: "orange", mr: 2 }} /> },
    { text: "Plats", to: "/platcard", icon: <FastfoodIcon sx={{ color: "orange", mr: 2 }} /> },
  ];

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "#fff", px: 2 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            fontWeight: "bold",
            color: "orange",
            cursor: "pointer",
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' }
          }}
        >
          TchôpShap
        </Typography>

        {/* Navigation desktop */}
        {isTabletOrMore && (
          <Box sx={{ display: "flex", gap: 4 }}>
            {navItems.map(({ text, to }) => (
              <Button
                key={text}
                component={RouterLink}
                to={to}
                color="inherit"
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {text}
              </Button>
            ))}
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
            <Box display={'flex'} gap={1}>
              <Typography color="black" fontWeight={'bold'}>Bonjour</Typography>
              <Typography sx={{ fontWeight: 500, color: "#000" }}>
                {user.nom}
              </Typography>
            </Box>
              
              <Button
                onClick={logout}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "orange",
                  color: "orange",
                  "&:hover": {
                    backgroundColor: "rgba(255, 165, 0, 0.1)",
                    borderColor: "orange",
                  },
                }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            isTabletOrMore && (
              <Button
                component={RouterLink}
                to="/Profil"
                color="inherit"
                state={{from:location.pathname}}
                startIcon={<PersonOutlineIcon />}
                sx={{ textTransform: "none", backgroundColor:"orange", color:"white" }}
              >
                Se Connecter
              </Button>
            )
          )}

          {/* Panier */}
          <IconButton onClick={() => navigate("/Cart")}>
            <Badge badgeContent={1} color="error">
              <LuShoppingCart size={22} />
            </Badge>
          </IconButton>

          {/* Hamburger mobile */}
          {isMobile && (
            <IconButton onClick={toggleDrawer} aria-label="Menu mobile">
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Drawer mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: "50%",
            backgroundColor: "rgba(255,255,255,0.98)",
            pt: 2,
          },
        }}
      >
        <List>
          {navItems.map(({ text, to, icon }) => (
            <ListItem
              button
              key={text}
              component={RouterLink}
              to={to}
              onClick={toggleDrawer}
              sx={{ px: 3, py: 2 }}
            >
              {icon}
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  color: "#000",
                }}
              />
            </ListItem>
          ))}
          {!user && (
            <ListItem
              button
              component={RouterLink}
              to="/Profil"
              onClick={toggleDrawer}
              sx={{ px: 3, py: 2 }}
            >
              <PersonOutlineIcon sx={{ color: "orange", mr: 2 }} />
              <ListItemText
                primary="Connexion"
                primaryTypographyProps={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  color: "#000",
                }}
              />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;

