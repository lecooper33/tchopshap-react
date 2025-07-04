# TchopShap React

TchopShap est une application web de commande de plats et de gestion de restaurants, développée avec React. Elle permet aux utilisateurs de parcourir des restaurants, de commander des plats, de gérer leur panier, de suivre leurs commandes et d'administrer les données côté back-office.

## Fonctionnalités principales

- Parcours et recherche de restaurants et de plats
- Ajout de plats au panier et gestion du panier
- Authentification et gestion de profil utilisateur
- Suivi des commandes et historique
- Paiement en ligne et gestion des erreurs de paiement
- Espace administrateur pour la gestion des restaurants, plats, catégories, livreurs et livraisons

## Structure du projet

```
public/           # Fichiers statiques et images
src/
  components/     # Composants réutilisables (Header, Footer, Cart, etc.)
  context/        # Contexts React (authentification, panier)
  pages/          # Pages principales (Accueil, Profil, Paiement, etc.)
  admin/          # Espace d'administration (pages et composants)
  theme/          # Thème et styles globaux
  App.js          # Point d'entrée principal de l'application
  index.js        # Point d'entrée ReactDOM
```

## Installation

1. **Cloner le dépôt**

```bash
git clone <url-du-repo>
cd tchopshap-react
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer l'application**

```bash
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

- `npm start` : Démarre le serveur de développement
- `npm run build` : Crée une version optimisée pour la production
- `npm test` : Lance les tests unitaires

## Technologies utilisées

- React
- React Router
- Context API
- CSS Modules
- (Ajouter ici toute autre librairie ou technologie utilisée)

## Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Auteur

-Garland brel Projet réalisé dans le cadre de l'école 241

## Licence

Ce projet est sous licence MIT.
