import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Charger le panier depuis le localStorage
    const savedCart = JSON.parse(localStorage.getItem('panier'));
    if (savedCart) {
      // Convertir en tableau si ce n'est pas déjà le cas
      const items = Array.isArray(savedCart) ? savedCart : [savedCart];
      setCartItems(items);
      // Calculer le nombre total d'articles
      const totalCount = items.reduce((sum, item) => sum + (item.quantite || 0), 0);
      setCartCount(totalCount);
    }
  }, []);

  const addToCart = (newItem) => {
    setCartItems(prevItems => {
      // Vérifier si le plat existe déjà dans le panier
      const existingItemIndex = prevItems.findIndex(
        item => item.plat.idPlat === newItem.plat.idPlat
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Si le plat existe, mettre à jour la quantité
        updatedItems = prevItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantite: item.quantite + (newItem.quantite || 1)
            };
          }
          return item;
        });
      } else {
        // Si le plat n'existe pas, l'ajouter au panier
        updatedItems = [...prevItems, newItem];
      }

      // Mettre à jour le localStorage
      localStorage.setItem('panier', JSON.stringify(updatedItems));
      
      // Mettre à jour le compteur
      const newCount = updatedItems.reduce((sum, item) => sum + (item.quantite || 0), 0);
      setCartCount(newCount);

      return updatedItems;
    });
  };

  const updateCartItem = (idPlat, newQuantite) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.plat.idPlat === idPlat) {
          return { ...item, quantite: newQuantite };
        }
        return item;
      });

      // Supprimer l'article si la quantité est 0
      const filteredItems = updatedItems.filter(item => item.quantite > 0);
      
      // Mettre à jour le localStorage
      localStorage.setItem('panier', JSON.stringify(filteredItems));
      
      // Mettre à jour le compteur
      const newCount = filteredItems.reduce((sum, item) => sum + (item.quantite || 0), 0);
      setCartCount(newCount);

      return filteredItems;
    });
  };

  const removeFromCart = (idPlat) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.plat.idPlat !== idPlat);
      localStorage.setItem('panier', JSON.stringify(updatedItems));
      
      const newCount = updatedItems.reduce((sum, item) => sum + (item.quantite || 0), 0);
      setCartCount(newCount);
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('panier');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      clearCart,
      totalAmount: cartItems.reduce((sum, item) => sum + (item.plat.prix * item.quantite), 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
