import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Otp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  // Récupère l'email passé depuis la page d'inscription
  const email = location.state?.email || ''; 

  useEffect(() => {
    // Si l'email n'est pas fourni (ex: accès direct à la page OTP), affiche un message
    if (!email) {
      setMessage('Email non fourni. Veuillez vous inscrire d\'abord.');
      // Optionnel: rediriger vers la page d'inscription si l'email est manquant
      // navigate('/inscription');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setMessage('L\'email est requis pour la vérification OTP.');
      return;
    }

    try {
      const response = await fetch('https://tchopshap.onrender.com/verifier-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Stocke le jeton JWT et le rôle dans le localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role); 
        // Redirige vers un tableau de bord ou une page d'accueil après la vérification
        navigate('/admin'); 
      } else {
        setMessage(data.message || 'Erreur lors de la vérification OTP.');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage('Problème de connexion au serveur.');
    }
  };

  return (
    <div>
      <h2>Vérification OTP</h2>
      {email ? (
        <p>Un code OTP a été envoyé à : <strong>{email}</strong></p>
      ) : (
        <p>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp">Code OTP :</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="4" // Assuming a 4-digit OTP
            required
          />
        </div>
        <button type="submit">Vérifier</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Otp;