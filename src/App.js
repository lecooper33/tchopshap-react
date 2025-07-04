import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import LoadingScreen from "./components/LoadingScreen";

// Pages utilisateurs
import Home from "./pages/Home.jsx";
import Resto from "./pages/Restaurant.jsx";
import Profil from "./pages/Profil.jsx";
import Panier from "./pages/Cart.jsx";
import Paiement from "./pages/Paiement.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Otp from "./pages/Otp.jsx"
import PlatCard from "./components/PlatCard.jsx";
import SignUp from "./pages/SignUp.jsx";
import EditProfil from "./pages/ProfilUpload.jsx";
import PaymentError from "./pages/PaymentError.jsx";
// Pages administrateur
import Admin from "./admin/pages/Admin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Plats from "./admin/pages/Plats.jsx";
import LoginAdmin from "./admin/pages/Login.jsx";
import Restaurants from "./admin/pages/Restaurants.jsx"
import User from "./admin/pages/User.jsx";
import Commandes from "./admin/pages/Commandes.jsx";
// pour la protection des routes admin
import PrivateRoutes from "./admin/components/PrivateRoutes.jsx";

// Composant wrapper pour gérer le LoadingScreen
const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSeenLoading = localStorage.getItem('hasSeenLoading');
    const isHomePage = location.pathname === '/';
    
    if (!hasSeenLoading && isHomePage) {
      setLoading(true);
      localStorage.setItem('hasSeenLoading', 'true');
    }
  }, [location]);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Routes>
        {/* Routes utilisateurs */}
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp/>} />
        <Route path="/restaurants" element={<Resto />} />
        <Route path="/profil" element={<Profil />} /> 
        <Route path="/cart" element={<Panier />} />
        <Route path="/PlatCard/:idRestaurant?" element={<PlatCard />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment-error" element={<PaymentError />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/editprofil" element={<EditProfil/>}/>
        <Route path="/user" element={<User />} />
        
        {/* Routes administrateur */}
        <Route path="/admin" element={<PrivateRoutes><Admin /></PrivateRoutes>} />
        <Route path="/admin/Login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
        <Route path="/admin/plats" element={<PrivateRoutes><Plats /></PrivateRoutes>} />
        <Route path="/admin/restaurants" element={<PrivateRoutes><Restaurants /></PrivateRoutes>} />
        <Route path="/admin/user" element={<PrivateRoutes><User /></PrivateRoutes>} />
        <Route path="/admin/commandes" element={<PrivateRoutes><Commandes /></PrivateRoutes>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;