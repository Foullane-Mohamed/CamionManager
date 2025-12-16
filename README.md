# Gestion de Flotte – CamionManager

## Contexte du projet
Une entreprise de transport routier dispose d’une flotte de camions et de remorques utilisée pour le transport de marchandises entre différents sites (entrepôts, clients, fournisseurs, ports, etc.).  
Aujourd’hui, la gestion de cette flotte est réalisée de manière essentiellement manuelle (fichiers Excel, appels téléphoniques, documents papier), ce qui entraîne :

- Un manque de visibilité en temps réel sur les trajets en cours et les véhicules disponibles.
- Des difficultés à suivre le kilométrage des camions et remorques.
- Un suivi peu fiable de la consommation de gasoil et des coûts associés.
- Une gestion approximative des pneus (usure, remplacement) et des opérations de maintenance (vidange, révision, etc.).
- Une absence de centralisation des informations sur les chauffeurs, leurs trajets et leurs performances.

---

## Fonctionnalités

### Application web de gestion de flotte
- Suivi des ressources : camions, remorques, pneus, carburant.
- Gestion des trajets et assignation aux chauffeurs.
- Suivi du kilométrage, de la consommation de gasoil et de l’état des pneus.
- Planification et notifications pour la maintenance périodique (pneus, vidange, etc.).
- Permettre au chauffeur de télécharger son trajet en PDF et de mettre à jour le statut.

### Rôles utilisateurs
#### Admin
- Crée et gère les camions, remorques et pneus.
- Crée les trajets et les assigne aux chauffeurs.
- Consulte les rapports : consommation, kilométrage, maintenance.
- Configure les règles de maintenance (périodicité pneus, vidange, révision, etc.).

#### Chauffeur
- Visualise ses trajets assignés.
- Télécharge un trajet en PDF (ordre de mission).
- Met à jour le statut du trajet : « à faire », « en cours », « terminé ».
- Saisie/validation : kilométrage départ/arrivée, volume gasoil, remarques sur l’état du véhicule.

---

## Partie Back-end
- Node.js avec Express.js et MongoDB.
- Mongoose comme ODM pour la connexion et la gestion des données.
- Tests unitaires pour chaque fonctionnalité (services ou contrôleurs).
- Middleware pour la gestion des erreurs.
- Authentification sécurisée avec JWT ou HttpBasic.
- Protection des routes sensibles selon le rôle de l’utilisateur.

---

## Partie Front-end
- React.js avec hooks (useState, useEffect).
- Routes définies avec Nested Routes.
- Protection des routes selon rôle Admin/Chauffeur.
- Gestion de l’état global avec Redux ou Context API.

---


---

## Comment lancer le projet

### Prérequis
- Node.js >= 18
- npm ou yarn
- Docker et Docker Compose (si utilisation du conteneur)

### Back-end
1. Se placer dans le dossier `backend` :  
   ```bash
   cd backend
### Installer les dépendances
npm install
### Créer un fichier .env avec la configuration suivante
PORT=5000
MONGO_URI=<votre_uri_mongodb>
JWT_SECRET=<votre_cle_jwt>
### Lancer le serveur
npm run div