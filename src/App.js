import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Resto from "./pages/Restaurant.jsx"; // OK !
import Profil from "./pages/Profil.jsx";
import Detail from "./pages/RestaurantDetail.jsx";
import Panier from "./pages/Cart.jsx";
import Paiement from "./pages/Paiement.jsx";
import Confirmation from "./pages/Confirmation.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Resto />} />
        <Route path="/Profil" element={<Profil />} />
        <Route path="/RestaurantsDetail" element={<Detail />} />
        <Route path="/Cart" element={<Panier />} />
        <Route path="/Paiement" element={<Paiement />} />
        <Route path="/Confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
}
export default App;
