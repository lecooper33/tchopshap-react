import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Nécessite React Router pour la navigation

function SignUp() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Rôle par défaut
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Réinitialise les messages précédents

    try {
      const response = await fetch('https://tchopshap.onrender.com/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.requiresOtpVerification) {
          // Redirige vers la page de vérification OTP en passant l'email
          navigate('/otp', { state: { email: email } });
        }
      } else {
        // Affiche le message d'erreur du backend ou un message générique
        setMessage(data.message || 'Erreur lors de l\'inscription.');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage('Problème de connexion au serveur.');
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Rôle :</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">client</option>
            <option value="administrateur">administrateur</option>
            {/* Ajoutez d'autres rôles si nécessaire */}
          </select>
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUp;

