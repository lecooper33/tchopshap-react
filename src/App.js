import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

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
// Pages administrateur

import Admin from "./admin/pages/Admin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Plats from "./admin/pages/Plats.jsx";
import LoginAdmin from "./admin/pages/Login.jsx";
import Client from "./admin/pages/Clients.jsx";
import Restaurants from "./admin/pages/Restaurants.jsx"
// pour la protection des routes admin
import PrivateRoutes from "./admin/components/PrivateRoutes.jsx";
function App() {
  return (
    <CartProvider>
    <Router>
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
        <Route path="/otp" element={<Otp />} />
        <Route path="/editprofil" element={<EditProfil/>}/>
        {/* Routes administrateur */}
        
        <Route path="/admin" element={<PrivateRoutes><Admin /></PrivateRoutes>} />
        <Route path="/admin/Login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
        <Route path="/admin/plats" element={<PrivateRoutes><Plats /></PrivateRoutes>} />
        <Route path="/admin/restaurants" element={<PrivateRoutes><Restaurants /></PrivateRoutes>} />
        <Route path="/admin/client" element={<PrivateRoutes><Client /></PrivateRoutes>} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;