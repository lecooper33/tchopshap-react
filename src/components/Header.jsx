import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LuShoppingCart } from "react-icons/lu";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isConfirmationPage = location.pathname === "/Confirmation";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "Plats", href: "/RestaurantsDetail" },
  ];

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

        {/* Liens desktop */}
        {!isMobile && !isConfirmationPage && (
          <Box sx={{ display: "flex", gap: 4 }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                underline="none"
                color="inherit"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        )}

        {/* Partie droite */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isConfirmationPage ? (
            isMobile ? (
              <>
                <IconButton onClick={toggleDrawer}>
                  {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={toggleDrawer}
                  PaperProps={{
                    sx: {
                      width: 250,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ mt: 4, px: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Bonjour, Jean Dupont
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        toggleDrawer();
                        handleLogout();
                      }}
                      sx={{ mt: 2, mb: 2 }}
                      fullWidth
                    >
                      Déconnexion
                    </Button>
                    <Box display="flex" justifyContent="center">
                      <IconButton>
                        <Badge badgeContent={0} color="error" invisible>
                          <LuShoppingCart size={22} />
                        </Badge>
                      </IconButton>
                    </Box>
                  </Box>
                </Drawer>
              </>
            ) : (
              <>
                <Typography>Bonjour,</Typography>
                <Typography>Jean Dupont</Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Déconnexion
                </Button>
                <IconButton>
                  <Badge badgeContent={0} color="error" invisible>
                    <LuShoppingCart size={20} />
                  </Badge>
                </IconButton>
              </>
            )
          ) : (
            <>
              <RouterLink to="/Profil" style={{ textDecoration: "none", color: "inherit" }}>
                <Button color="inherit">Connexion</Button>
              </RouterLink>
              <IconButton>
                <Badge badgeContent={1} color="error">
                  <LuShoppingCart size={20} />
                </Badge>
              </IconButton>
              {isMobile && (
                <IconButton onClick={toggleDrawer}>
                  {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Toolbar>

      {/* Drawer mobile standard */}
      {!isConfirmationPage && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: { width: 250,
              backgroundColor: "rgba(255,255,255,0.95)",
               backdropFilter: "blur(4px)", boxShadow: 3,},}}>
          <Box sx={{ mt: 4 }}>
            <List>
              {navLinks.map((link) => (
                <ListItem
                  button
                  key={link.label} component="a"
                  href={link.href} onClick={toggleDrawer}
                  sx={{ px: 3, py: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.09)",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      sx: {
                        color: "#000",
                        textDecoration: "underline",
                        fontWeight: 500,
                        
                      },}} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
    </AppBar>
  );
};

export default Header;
