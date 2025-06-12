import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { LuShoppingCart } from "react-icons/lu";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletOrMore = useMediaQuery(theme.breakpoints.up("sm"));

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    toggleDrawer();
  };

  const navItems = [
    { text: "Accueil", to: "/", icon: <HomeIcon /> },
    { text: "Restaurants", to: "/restaurants", icon: <RestaurantIcon /> },
    { text: "Plats", to: "/platcard", icon: <FastfoodIcon /> },
  ];

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          py: 1,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            fontWeight: 800,
            color: "orange",
            cursor: "pointer",
            fontSize: { xs: "1.3rem", sm: "1.5rem" },
            letterSpacing: -0.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          TchôpShap
        </Typography>

        {/* Navigation desktop */}
        {isTabletOrMore && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
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
                  fontWeight: 500,
                  color:
                    location.pathname === to ? "orange" : "text.primary",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 165, 0, 0.08)",
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
          <IconButton
            onClick={() => navigate("/Cart")}
            sx={{
              p: 1.5,
              "&:hover": {
                backgroundColor: "rgba(255, 165, 0, 0.08)",
              },
            }}
          >
            <Badge badgeContent={cartCount} color="error">
              <LuShoppingCart style={{ width: 24, height: 24 }} />
            </Badge>
          </IconButton>

          {/* Utilisateur connecté */}
          {user ? (
            isTabletOrMore && (
              <Box display={"flex"} gap={2} alignItems="center" ml={1}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Bonjour
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {user.nom}
                  </Typography>
                </Box>
                <Button
                  onClick={logout}
                  variant="text"
                  sx={{
                    textTransform: "none",
                    color: "text.secondary",
                    ml: 1,
                    "&:hover": {
                      color: "orange",
                    },
                  }}
                >
                  Déconnexion
                </Button>
              </Box>
            )
          ) : (
            isTabletOrMore && (
              <Button
                component={RouterLink}
                to="/Profil"
                color="inherit"
                state={{ from: location.pathname }}
                variant="contained"
                disableElevation
                sx={{
                  textTransform: "none",
                  backgroundColor: "orange",
                  color: "white",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "darkorange",
                  },
                }}
              >
                Connexion
              </Button>
            )
          )}

          {/* Hamburger mobile */}
          {isMobile && (
            <IconButton
              onClick={toggleDrawer}
              aria-label="Menu mobile"
              sx={{
                ml: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 165, 0, 0.08)",
                },
              }}
            >
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
            width: "75%",
            backgroundColor: "#fff",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "orange" }}>
            Menu
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ py: 0 }}>
          {navItems.map(({ text, to, icon }) => (
            <ListItem
              button
              key={text}
              component={RouterLink}
              to={to}
              onClick={toggleDrawer}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255, 165, 0, 0.08)",
                },
                borderLeft:
                  location.pathname === to
                    ? "4px solid orange"
                    : "4px solid transparent",
              }}
            >
              <IconButton sx={{ color: "orange", mr: 2 }}>{icon}</IconButton>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: "#000",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <List>
          {user ? (
            <>
              <ListItem sx={{ px: 3, py: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "orange",
                    mr: 2,
                  }}
                >
                  {user.nom.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Connecté en tant que
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {user.nom}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 165, 0, 0.08)",
                  },
                }}
              >
                <IconButton sx={{ color: "orange", mr: 2 }}>
                  <LogoutIcon />
                </IconButton>
                <ListItemText
                  primary="Déconnexion"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: "#000",
                  }}
                />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              component={RouterLink}
              to="/Profil"
              onClick={toggleDrawer}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255, 165, 0, 0.08)",
                },
              }}
            >
              <IconButton sx={{ color: "orange", mr: 2 }}>
                <PersonOutlineIcon />
              </IconButton>
              <ListItemText
                primary="Se Connecter"
                primaryTypographyProps={{
                  fontWeight: 500,
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
