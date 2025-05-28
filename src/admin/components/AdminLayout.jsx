import React, { useState } from "react";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Divider, Tooltip
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  Category as CategoryIcon,
  LocalShipping as LocalShippingIcon,
  DeliveryDining as DeliveryDiningIcon
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const FULL_DRAWER_WIDTH = 200;
const COLLAPSED_DRAWER_WIDTH = 70;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Client", icon: <PeopleIcon />, path: "/admin/client" },
  { text: "Plats", icon: <RestaurantIcon />, path: "/admin/plats" },
  { text: "Commandes", icon: <ShoppingCartIcon />, path: "/admin/commandes" },
  { text: "Restaurants", icon: <RestaurantIcon />, path: "/admin/restaurants" },
  { text: "Catégories", icon: <CategoryIcon />, path: "/admin/categories" },
  { text: "Livraisons", icon: <LocalShippingIcon />, path: "/admin/livraisons" },
  { text: "Livreurs", icon: <DeliveryDiningIcon />, path: "/admin/livreurs" },
];

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
              button
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
                },
                "&:hover": {
                  backgroundColor: "#ffe0b2",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#000",
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
                    color: "#000",
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
            {/* Bouton mobile */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Bouton pour replier/étendre */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleCollapse}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight="bold">Garland Brel</Typography>
            <Avatar src="https://i.pravatar.cc/150?img=1" />
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
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: "50vw", // ouverture à moitié sur mobile
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer desktop */}
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

      {/* CONTENU */}
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
