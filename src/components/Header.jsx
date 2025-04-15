import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Link,} from "@mui/material";
import { LuShoppingCart } from "react-icons/lu";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isConfirmationPage = location.pathname === "/Confirmation";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="static"  color="default" elevation={0}
      sx={{  borderBottom: 1, borderColor: "divider",  backgroundColor: "#fff", px: 4,}}>
      <Toolbar
        sx={{display: "flex", justifyContent: "space-between", minHeight: 64,  gap: 4, }}>
        
        <Box sx={{ flex: 1 }}>
          <Typography  variant="h6"
            sx={{ fontWeight: "bold",  color: "orange",  cursor: "pointer",}}
            onClick={() => navigate("/")}>
            TchôpShap
          </Typography>
        </Box>

        <Box sx={{display: "flex",  gap: 4,  justifyContent: "center", flex: 1, }}>
          <Link href="#" underline="none" color="inherit"
            sx={{ "&:hover": { textDecoration: "underline" }, }} >
            Accueil
          </Link>
          <Link  href="/restaurants"  underline="none"  color="inherit"
            sx={{ "&:hover": { textDecoration: "underline" },}} >
            Restaurants
          </Link>
          <Link  href="/RestaurantsDetail" underline="none"  color="inherit"
            sx={{  "&:hover": { textDecoration: "underline" }, }} >
            Plats
          </Link>
        </Box>

  
        <Box sx={{  display: "flex",  alignItems: "center",
            justifyContent: "flex-end",  flex: 1,  gap: 2, }} >
          {isConfirmationPage ? (
            <>
              <Typography>Bonjour,</Typography>
              <Typography>Jean Dupont</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
              <IconButton>
                <Badge
                  badgeContent={0}
                  color="error"
                  invisible={true}>
                  <LuShoppingCart size={20} />
                </Badge>
              </IconButton>
            </>
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
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header