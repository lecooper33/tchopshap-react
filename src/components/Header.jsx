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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { LuShoppingCart } from "react-icons/lu";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isConfirmationPage = location.pathname === "/Confirmation";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleCartClick = () => {
    navigate("/panier");
  };

  const iconStyle = {
    color: "#FFA726",
    mr: 2,
  };

  const menuItemStyle = {
    px: 3,
    py: 2,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  };

  const menuTextStyle = {
    sx: {
      fontWeight: 400,
      fontSize: "1rem",
      color: "#000",
    },
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "#fff",
        px: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "orange", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          TchôpShap
        </Typography>

        {/* Desktop navigation */}
        {!isMobile && !isConfirmationPage && (
          <Box sx={{ display: "flex", gap: 4 }}>
            <Button href="/" color="inherit">Accueil</Button>
            <Button href="/restaurants" color="inherit">Restaurants</Button>
            <Button href="/RestaurantsDetail" color="inherit">Plats</Button>
          </Box>
        )}

        {/* Right actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Connexion sur desktop uniquement */}
          {!isMobile && !isConfirmationPage && (
            <RouterLink to="/Profil" style={{ textDecoration: "none", color: "inherit" }}>
              <Button color="inherit">Connexion</Button>
            </RouterLink>
          )}

          {/* Panier - toujours visible */}
          <IconButton onClick={handleCartClick}>
            <Badge badgeContent={1} color="error">
              <LuShoppingCart size={20} />
            </Badge>
          </IconButton>

          {/* Menu mobile uniquement */}
          {isMobile && (
            <IconButton onClick={toggleDrawer}>
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Drawer mobile */}
      {!isConfirmationPage && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: {
              width: 260,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              transition: "all 0.3s ease-in-out",
              boxShadow: 5,
            },
          }}
        >
          <Box sx={{ mt: 4 }}>
            <List>
              <ListItem button onClick={toggleDrawer} component="a" href="/" sx={menuItemStyle}>
                <HomeIcon sx={iconStyle} />
                <ListItemText primary="Accueil" primaryTypographyProps={menuTextStyle} />
              </ListItem>
              <ListItem button onClick={toggleDrawer} component="a" href="/restaurants" sx={menuItemStyle}>
                <RestaurantIcon sx={iconStyle} />
                <ListItemText primary="Restaurants" primaryTypographyProps={menuTextStyle} />
              </ListItem>
              <ListItem button onClick={toggleDrawer} component="a" href="/RestaurantsDetail" sx={menuItemStyle}>
                <FastfoodIcon sx={iconStyle} />
                <ListItemText primary="Plats" primaryTypographyProps={menuTextStyle} />
              </ListItem>
              <ListItem button onClick={toggleDrawer} component={RouterLink} to="/Profil" sx={menuItemStyle}>
                <PersonOutlineIcon sx={iconStyle} />
                <ListItemText primary="Connexion" primaryTypographyProps={menuTextStyle} />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}
    </AppBar>
  );
};

export default Header;
