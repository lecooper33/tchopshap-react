import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages utilisateurs
import Home from "./pages/Home.jsx";
import Resto from "./pages/Restaurant.jsx";
import Profil from "./pages/Profil.jsx";
import Panier from "./pages/Cart.jsx";
import Paiement from "./pages/Paiement.jsx";
import Confirmation from "./pages/Confirmation.jsx";

import Otp from "./pages/Otp.jsx"

// Pages administrateur

import Admin from "./admin/pages/Admin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Plats from "./admin/pages/Plats.jsx";
import Commandes from "./admin/pages/Commandes.jsx";
import Livraisons from "./admin/pages/Livraisons.jsx";
import Livreurs from "./admin/pages/Livreurs.jsx";
import Restaurants from "./admin/pages/Restaurants.jsx";
import Categories from "./admin/pages/Categories.jsx";
import LoginAdmin from "./admin/pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Client from "./admin/pages/Clients.jsx";
import PlatCard from "./components/PlatCard.jsx";
function App() {
  return (
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
        {/* Routes administrateur */}
        
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/Login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/plats" element={<Plats />} />
        <Route path="/admin/restaurants" element={<Restaurants />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/commandes" element={<Commandes />} />
        <Route path="/admin/livraisons" element={<Livraisons />} />
        <Route path="/admin/livreurs" element={<Livreurs />} />
         <Route path="/admin/client" element={<Client />} />
      </Routes>
    </Router>
  );
}

export default App;