import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

// MUI Components
import {
  AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Drawer,
  List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme,
  Divider, Avatar, Chip,
} from "@mui/material";

// MUI Icons
import {
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  Fastfood as FastfoodIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

// Contextes
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Navigation
const navItems = [
  { text: "Accueil", to: "/", icon: <HomeIcon /> },
  { text: "Restaurants", to: "/restaurants", icon: <RestaurantIcon /> },
  { text: "Menu", to: "/platcard", icon: <FastfoodIcon /> },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    toggleDrawer();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: '100vw',
        maxWidth: '100vw',
        left: 0,
        overflow: 'hidden',
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(8px)",
        background: "rgba(255, 255, 255, 0.8)",
        paddingRight: {xs: 2, md: 15}, // Adjust padding for mobile and desktop
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 1,
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #FF6B00 30%, #FFA800 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -0.5,
            }}
          >
            TchôpShap
          </Typography>
        </Box>

        {/* Navigation Desktop */}
        {isDesktop && (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flex: 1,
              justifyContent: "center",
              mx: 4,
            }}
          >
            {navItems.map(({ text, to }) => (
              <Button
                key={text}
                component={RouterLink}
                to={to}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontSize: 16,
                  color: location.pathname === to ? "primary.main" : "text.primary",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: location.pathname === to ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
                    width: "60%",
                    height: 3,
                    backgroundColor: "primary.main",
                    transition: "transform 0.3s ease",
                  },
                  "&:hover::after": {
                    transform: "translateX(-50%) scaleX(1)",
                  },
                }}
              >
                {text}
              </Button>
            ))}
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Panier */}
          <IconButton onClick={() => navigate("/Cart")}>
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon sx={{ color: "text.primary" }} />
            </Badge>
          </IconButton>

          {/* Utilisateur */}
          {user ? (
            isDesktop ? (
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{user.nom ? user.nom.charAt(0).toUpperCase() : '?'}</Avatar>}
                  label={`Bonjour, ${user.nom ? user.nom.split(' ')[0] : ''}`}
                  variant="outlined"
                  onClick={() => navigate("/user")}
                  sx={{
                    cursor: 'pointer',
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                />
                <Button
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    textTransform: "none",
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                    },
                  }}
                >
                  Déconnexion
                </Button>
              </Box>
            ) : (
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            )
          ) : isDesktop ? (
            <Button
              component={RouterLink}
              to="/Profil"
              state={{ from: location.pathname }}
              variant="contained"
              color="primary"
              startIcon={<PersonIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Connexion
            </Button>
          ) : (
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
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
            width: "min(85vw, 250px)",
            p: 2,
            boxSizing: "border-box",
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>Menu</Typography>
          <IconButton onClick={toggleDrawer}><CloseIcon /></IconButton>
        </Box>

        {/* Utilisateur */}
        {user && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 ,}}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "primary.main" }}>{user.nom ? user.nom.charAt(0).toUpperCase() : '?'}</Avatar>
              <Box>
                <Typography fontWeight={600}>{user.nom || ''}</Typography>
                <Typography fontSize={13} color="text.secondary">{user.email || ''}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        <List>
          {navItems.map(({ text, to, icon }) => (
            <ListItem
              key={text}
              button
              component={RouterLink}
              to={to}
              onClick={toggleDrawer}
              selected={location.pathname === to}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: 'black',
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <List>
          {user ? (
            <>
              <ListItem
                button
                component={RouterLink}
                to="/user"
                onClick={toggleDrawer}
                sx={{
                  borderRadius: 1,
                  bgcolor: "primary.main",
                  color: "white",
                  mb: 1,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Mon compte" />
              </ListItem>
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "#EBF0EC",
                  },
                }}
              >
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              component={RouterLink}
              to="/Profil"
              onClick={toggleDrawer}
              selected={location.pathname === "/Profil"}
              sx={{
                borderRadius: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.main",
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Se connecter" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
