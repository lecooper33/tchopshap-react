import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import axios from "axios";
import { useThemeMode } from "../../theme/ThemeProvider";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Divider, 
  Tooltip, Button, Menu, MenuItem, Badge, TextField, Switch,
  ListItemButton, Collapse, useTheme, InputAdornment, alpha
} from "@mui/material";
import {
  Menu as MenuIcon, Dashboard as DashboardIcon,
  People as PeopleIcon, Restaurant as RestaurantIcon,
  Store as StoreIcon, Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Receipt as ReceiptIcon,
  ExpandLess as ExpandLessIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FULL_DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 70;

// Optimisé avec memo pour éviter les re-rendus inutiles
const MenuItems = memo(({ items, location, collapsed, onItemClick }) => {
  const [openSubMenu, setOpenSubMenu] = useState("");

  const handleSubMenuClick = (itemPath) => {
    setOpenSubMenu(openSubMenu === itemPath ? "" : itemPath);
  };

  return (
    <List>
      {items.map((item) => (
        <React.Fragment key={item.text}>
          <ListItem
            component={item.subItems ? "div" : Link}
            to={item.subItems ? undefined : item.path}
            onClick={() => item.subItems ? handleSubMenuClick(item.path) : onItemClick()}
            sx={{
              px: collapsed ? 2 : 3,
              py: 1.5,
              transition: "all 0.3s ease",
              borderRadius: "8px",
              mx: 1,
              mb: 0.5,
              "&:hover": {
                backgroundColor: "rgba(255, 167, 38, 0.1)",
              },
              ...(location.pathname === item.path && {
                background: "linear-gradient(90deg, #ff9800 0%, #ed6c02 100%)",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "&:hover": {
                  background: "linear-gradient(90deg, #ff9800 0%, #ed6c02 100%)",
                },
              }),
            }}
          >
            <Tooltip title={collapsed ? item.text : ""} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    },
                  }}
                />
                {item.subItems && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubMenuClick(item.path);
                    }}
                  >
                    {openSubMenu === item.path ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </IconButton>
                )}
              </>
            )}
          </ListItem>

          {!collapsed && item.subItems && (
            <Collapse in={openSubMenu === item.path} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <ListItemButton
                    key={subItem.text}
                    component={Link}
                    to={subItem.path}
                    onClick={() => onItemClick()}
                    sx={{
                      pl: 6,
                      py: 1,
                      transition: "all 0.3s ease",
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(255, 167, 38, 0.1)",
                      },
                      ...(location.pathname === subItem.path && {
                        backgroundColor: "rgba(255, 167, 38, 0.2)",
                        color: "#ff9800",
                      }),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 35, color: "inherit" }}>
                      <ChevronRightIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.text}
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
});

// Les éléments du menu principal avec sous-menus
const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { 
    text: "Gestion", 
    icon: <StoreIcon />, 
    path: "/admin/gestion",
    subItems: [
      { text: "Restaurants", path: "/admin/restaurants" },
      { text: "Plats", path: "/admin/plats" },
    ]
  },
  { text: "Clients", icon: <PeopleIcon />, path: "/admin/client" },
  { text: "Commandes", icon: <ReceiptIcon />, path: "/admin/commandes" },
];

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const { darkMode, toggleTheme } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const [adminName, setAdminName] = useState(() => localStorage.getItem("adminName") || null);
  const [adminImage, setAdminImage] = useState(() => localStorage.getItem("adminImage") || null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Gestion des notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://tchopshap.onrender.com/notifications/${localStorage.getItem("userId")}`);
        const newNotifs = response.data.filter(notif => !notif.read);
        if (newNotifs.length > unreadCount) {
          toast.custom((t) => (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              sx={{
                background: "white",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <NotificationsIcon sx={{ color: "orange" }} />
              <Typography>Nouvelle notification</Typography>
            </Box>
          ));
        }
        setNotifications(response.data);
        setUnreadCount(newNotifs.length);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      }
    };

    const interval = setInterval(fetchNotifications, 30000);
    fetchNotifications();

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notifId) => {
    try {
      await axios.patch(`https://tchopshap.onrender.com/notifications/${notifId}`, { read: true });
      setNotifications(prevNotifs =>
        prevNotifs.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      handleCloseNotifications();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la notification:", error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Implémentez votre logique de recherche ici
  };

  const handleLogout = useCallback(() => {
    toast.success("Déconnexion réussie", { duration: 2000 });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminImage");
    navigate("/admin/login");
  }, [navigate]);

  const toggleDarkMode = () => {
    toggleTheme();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      handleLogout();
      return;
    }

    if (userId && (!adminName || !adminImage)) {
      axios
        .get(`https://tchopshap.onrender.com/utilisateurs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
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
  }, [adminName, adminImage, navigate, handleLogout]);

  const toggleDrawer = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const drawerContent = useMemo(() => (
    <Box sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      bgcolor: theme.palette.background.paper,
      color: theme.palette.text.primary
    }}>
      <Toolbar sx={{ px: 3, py: 2 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <img
            src="/Img/Tchopshap.png"
            alt="Logo"
            style={{
              width: collapsed ? "30px" : "40px",
              height: "auto",
              transition: "width 0.3s ease"
            }}
          />
          {!collapsed && (
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(45deg, #ff9800 30%, #ed6c02 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              TchôpShap
            </Typography>
          )}
        </motion.div>
      </Toolbar>

      <Divider sx={{ mb: 2 }} />

      {/* Barre de recherche */}
      {!collapsed && (
        <Box sx={{ px: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.text.primary, 0.03),
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <MenuItems
          items={menuItems}
          location={location}
          collapsed={collapsed}
          onItemClick={() => setMobileOpen(false)}
        />
      </Box>

      <Divider sx={{ mt: 2 }} />

      {/* Paramètres et thème */}
      <List sx={{ py: 0 }}>
        <ListItem
          sx={{
            px: collapsed ? 2 : 3,
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
            {darkMode ? (
              <DarkModeIcon sx={{ color: "text.secondary" }} />
            ) : (
              <LightModeIcon sx={{ color: "text.secondary" }} />
            )}
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText primary="Thème sombre" />
              <Switch
                checked={darkMode}
                onChange={toggleTheme}
                color="warning"
              />
            </>
          )}
        </ListItem>
      </List>
    </Box>
  ), [collapsed, darkMode, location, searchQuery, theme.palette, toggleTheme]);

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh",
      bgcolor: theme.palette.background.default,
      color: theme.palette.text.primary 
    }}>
      <CssBaseline />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }} 
      />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH}px)` },
          ml: { sm: `${collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH}px` },
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          color: theme.palette.text.primary,
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(20px)",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{
                display: { sm: "none" },
                color: "text.primary",
              }}
            >
              <MenuIcon />
            </IconButton>

            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleCollapse}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                color: "text.primary",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotifications}
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      animation: unreadCount
                        ? "pulse 1.5s infinite"
                        : "none",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.2)" },
                        "100%": { transform: "scale(1)" },
                      },
                    },
                  }}
                >
                  <NotificationsIcon color="action" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Menu Profile */}
            <Box
              onClick={handleMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <Avatar
                src={adminImage || "/default-avatar.png"}
                alt="Admin Avatar"
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid",
                  borderColor: "orange",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
              <Box display={{ xs: "none", md: "block" }}>
                <Typography variant="body2" color="text.secondary">
                  Bonjour,
                </Typography>
                <Typography fontWeight="bold" color="text.primary">
                  {adminName || "Admin"}
                </Typography>
              </Box>
              <ExpandMoreIcon sx={{ color: "text.secondary" }} />
            </Box>

            {/* Menu Profil Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem
                onClick={handleClose}
                sx={{
                  py: 1,
                  px: 2,
                  "&:hover": { bgcolor: "rgba(255,167,38,0.08)" },
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                Mon Profil
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{
                  py: 1,
                  px: 2,
                  "&:hover": { bgcolor: "rgba(255,167,38,0.08)" },
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                Paramètres
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1,
                  px: 2,
                  color: "error.main",
                  "&:hover": { bgcolor: "error.lighter" },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                </ListItemIcon>
                Se déconnecter
              </MenuItem>
            </Menu>

            {/* Menu Notifications */}
            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleCloseNotifications}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 320,
                  maxHeight: 400,
                  overflow: "auto",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <MenuItem
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: 3,
                      borderColor: notif.read ? "transparent" : "warning.main",
                      "&:hover": { bgcolor: "rgba(255,167,38,0.08)" },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notif.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {new Date(notif.date).toLocaleString("fr-FR")}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <NotificationsIcon
                    sx={{ fontSize: 40, color: "text.disabled" }}
                  />
                  <Typography color="text.secondary">
                    Aucune notification
                  </Typography>
                </Box>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH },
          flexShrink: { sm: 0 },
          transition: "width 0.3s ease",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: FULL_DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH,
              border: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              transition: "width 0.3s ease",
              overflowX: "hidden",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            xs: "100%",
            sm: `calc(100% - ${collapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH}px)`,
          },
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 0 24px rgba(0,0,0,0.05)",
            bgcolor: theme.palette.background.paper,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(AdminLayout);