import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import axios from "axios";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Divider, Tooltip,
  Button
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FULL_DRAWER_WIDTH = 200;
const COLLAPSED_DRAWER_WIDTH = 70;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Client", icon: <PeopleIcon />, path: "/admin/client" },
  { text: "Plats", icon: <RestaurantIcon />, path: "/admin/plats" },
  { text: "Restaurants", icon: <StoreIcon />, path: "/admin/restaurants" },
];

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState(() => localStorage.getItem("adminName") || null);
  const [adminImage, setAdminImage] = useState(() => localStorage.getItem("adminImage") || null);

  // ---
  // Correction: Use useCallback for handleLogout
  // This memoizes the function, ensuring its reference is stable across renders
  // unless its own dependencies (like 'navigate') change.
  // ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminImage");
    navigate("/admin/login");
  }, [navigate]); // 'navigate' is a dependency of handleLogout

  // ---
  // Correction: Add handleLogout to useEffect dependencies
  // Now that handleLogout is memoized with useCallback, it's safe to add it
  // to the useEffect's dependency array.
  // ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      handleLogout(); // Calling the memoized handleLogout
      return;
    }

    if (userId && (!adminName || !adminImage)) {
      axios
        .get(`https://tchopshap.onrender.com/utilisateurs/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          const user = res.data;
          setAdminName(user.nom);
          localStorage.setItem("adminName", user.nom);
          setAdminImage(user.image);
          localStorage.setItem("adminImage", user.image);
        })
        .catch((err) => {
          console.error("Error fetching admin data:", err);
          handleLogout();
        });
    }
  }, [adminName, adminImage, navigate, handleLogout]); // handleLogout is now a dependency

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: collapsed ? "center" : "flex-start" }}>
        {!collapsed ? (
          <Typography variant="h6" fontWeight="bold" color="orange">
            TchopShap
          </Typography>
        ) : (
          <Typography fontWeight="bold" color="orange">T</Typography>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={collapsed ? item.text : ""} placement="right">
            <ListItem
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 2 : 3,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  backgroundColor: "orange",
                  color: "#fff",
                  fontWeight: "bold",
                  "& .MuiListItemIcon-root": {
                    color: "#fff",
                  },
                },
                "&:hover": {
                  backgroundColor: "#ffe0b2",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: "inherit",
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* TOPBAR */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% - ${collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH}px)`
          },
          ml: {
            sm: `${collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH}px`
          },
          bgcolor: "orange",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            {/* Mobile menu toggle button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop drawer collapse toggle button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleCollapse}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box display={'flex'} gap={2} alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontWeight="bold" textTransform="capitalize">
                {adminName || "Admin"}
              </Typography>
              <Avatar src={adminImage || "https://i.pravatar.cc/150?img=1"} alt="Admin Avatar" />
            </Box>

            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{ border: "1px solid white", color: "white", bgcolor: "transparent", '&:hover': { bgcolor: "rgba(255,255,255,0.2)" } }}
            >
              Se déconnecter
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Box
        component="nav"
        sx={{
          width: {
            sm: collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH
          },
          flexShrink: { sm: 0 },
          transition: "width 0.5s ease"
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: "70vw",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH,
              overflowX: "hidden",
              transition: "width 0.5s ease",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: {
            sm: `calc(100% - ${collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH}px)`
          },
          transition: "margin 0.3s ease",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}