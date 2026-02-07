# EventMa - Plateforme de Gestion d'Événements au Maroc

Application web complète de gestion événementielle développée avec React et TypeScript, conçue pour le marché marocain.

## 🎯 Fonctionnalités

### Pour les Visiteurs/Clients
- **Découverte d'événements** : Navigation par région, catégorie, période
- **Recherche avancée** : Filtres multiples (région, catégorie, prix, date)
- **Détails complets** : Informations détaillées, localisation, offres disponibles
- **Réservation en ligne** : Processus en 3 étapes avec confirmation
- **Gestion des réservations** : Historique et suivi de toutes les réservations

### Pour les Organisateurs
- **Dashboard complet** : KPIs en temps réel (vues, réservations, chiffre d'affaires)
- **Gestion des événements** : CRUD complet avec statuts (Brouillon, Publié, Annulé, Terminé)
- **Gestion des offres** : Types de billets, prix, places, dates d'expiration
- **Statistiques détaillées** : Analyse par événement avec graphiques
- **Alertes intelligentes** : Stock bas, offres expirées

### Pour les Administrateurs
- **Gestion des utilisateurs** : Activation/désactivation, attribution de rôles
- **Gestion des régions** : CRUD des régions marocaines
- **Gestion des catégories** : CRUD des catégories d'événements

## 🏗️ Architecture

### Entités de la Base de Données
- **users** : Gestion des utilisateurs (nom, prénom, email, téléphone, statut)
- **roles** : Rôles système (CLIENT, ORGANISATEUR, ADMIN)
- **user_roles** : Association users ↔ roles
- **regions** : Régions du Maroc (12 régions)
- **categories** : Catégories d'événements (Concert, Sport, Conférence, etc.)
- **events** : Événements avec toutes leurs informations
- **offers** : Offres de billetterie liées aux événements
- **reservations** : Réservations des clients
- **statistics** : Statistiques par événement (vues, réservations, CA)

### Stack Technique
- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS v4 + Design System personnalisé
- **UI Components** : Radix UI + Shadcn/ui
- **Icons** : Lucide React
- **Forms** : React Hook Form
- **Notifications** : Sonner (Toast)
- **État** : React Context API

## 🎨 Design System

### Couleurs
- **Primary** : Bleu (#0066cc) - Actions principales, liens
- **Secondary** : Vert (#10b981) - Succès, confirmations
- **Muted** : Gris (#f3f4f6) - Arrière-plans secondaires
- **Destructive** : Rouge (#dc2626) - Erreurs, suppressions

### Composants Réutilisables
- **EventCard** : Carte d'événement avec image, infos, badges
- **OfferCard** : Carte d'offre avec prix, places, alertes
- **StatusBadge** : Badge de statut (événement/réservation)
- **EmptyState** : État vide avec illustration
- **LoadingState** : Skeletons de chargement

### États UI
- ✅ Loading (skeleton loaders)
- ✅ Empty (illustrations + actions)
- ✅ Error (messages + codes HTTP)
- ✅ Success (confirmations animées)

## 🔐 Authentification

### Comptes de Test
```
Client:
  Email: client@example.ma
  Mot de passe: password123

Organisateur:
  Email: organisateur@example.ma
  Mot de passe: password123

Admin:
  Email: admin@example.ma
  Mot de passe: password123
```

### Rôles et Permissions
- **CLIENT** : Consulter, réserver, gérer ses réservations
- **ORGANISATEUR** : Tout client + créer/gérer événements et offres
- **ADMIN** : Tout organisateur + gestion système

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints optimisés :
- **Mobile** : < 768px (390px de référence)
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px (1440px de référence)

### Adaptations Mobile
- Menu burger pour la navigation
- Filtres dans un drawer latéral
- Cards empilées au lieu de grilles
- Dashboard avec sidebar coulissante

## 🌍 Multi-langue

Structure prête pour le français (FR) et l'arabe (AR) :
- Context de langue avec switch FR/AR
- Traductions centralisées
- Support RTL prévu

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build Production
```bash
npm run build
```

## 📂 Structure du Projet

```
src/
├── app/
│   ├── App.tsx                 # Point d'entrée principal
│   └── components/ui/          # Composants UI de base
├── components/                 # Composants métier
│   ├── EventCard.tsx
│   ├── OfferCard.tsx
│   ├── StatusBadge.tsx
│   ├── EmptyState.tsx
│   ├── LoadingState.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/                   # Contexts React
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── data/
│   └── mockData.ts            # Données mockées
├── pages/
│   ├── public/                # Pages publiques
│   │   ├── Landing.tsx
│   │   ├── EventsList.tsx
│   │   ├── EventDetails.tsx
│   │   └── Checkout.tsx
│   ├── auth/                  # Authentification
│   │   └── Login.tsx
│   ├── client/                # Espace client
│   │   ├── Profile.tsx
│   │   └── MyReservations.tsx
│   ├── organizer/             # Dashboard organisateur
│   │   ├── DashboardLayout.tsx
│   │   ├── Overview.tsx
│   │   ├── MyEvents.tsx
│   │   ├── MyOffers.tsx
│   │   └── Statistics.tsx
│   └── admin/                 # Interface admin
│       └── AdminPanel.tsx
└── styles/
    ├── theme.css              # Thème et couleurs
    ├── fonts.css              # Fonts
    └── tailwind.css           # Tailwind config
```

## 🔄 Flux Utilisateur

### Parcours Client
1. Landing page → Découverte d'événements
2. Recherche/Filtres → Liste d'événements
3. Détails événement → Consultation des offres
4. Sélection offre → Processus de réservation
5. Confirmation → Code de réservation
6. Mon compte → Historique des réservations

### Parcours Organisateur
1. Dashboard → Vue d'ensemble (KPIs)
2. Mes événements → Créer/Modifier des événements
3. Mes offres → Créer/Modifier des offres
4. Statistiques → Analyser les performances
5. Réservations → Gérer les réservations clients

### Parcours Admin
1. Gestion utilisateurs → Activer/Désactiver, Rôles
2. Gestion régions → CRUD des régions
3. Gestion catégories → CRUD des catégories

## 🎭 Données Mock

L'application utilise des données mockées incluant :
- **7 régions** du Maroc (Casablanca, Rabat, Marrakech, etc.)
- **8 catégories** d'événements
- **6 événements** de démonstration avec images Unsplash
- **13 offres** de billetterie variées
- **3 utilisateurs** de test (un par rôle)
- **3 réservations** exemples
- **Statistiques** sur 5 jours

## 🔮 Intégration API (Future)

L'application est conçue pour consommer une API REST Spring Boot. Les points d'API prévus :

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

### Événements
- `GET /events?region=&category=&from=&to=&sort=` - Liste filtrée
- `GET /events/{id}` - Détails
- `POST /organizer/events` - Créer (organisateur)
- `PUT /organizer/events/{id}` - Modifier
- `DELETE /organizer/events/{id}` - Supprimer

### Offres
- `GET /events/{id}/offers` - Offres d'un événement
- `POST /organizer/offers` - Créer
- `PUT /organizer/offers/{id}` - Modifier
- `DELETE /organizer/offers/{id}` - Supprimer

### Réservations
- `POST /reservations` - Créer une réservation
- `GET /me/reservations` - Mes réservations
- `GET /organizer/reservations` - Réservations (organisateur)

### Admin
- `GET /admin/users` - Liste utilisateurs
- `PUT /admin/users/{id}` - Modifier utilisateur
- `GET /admin/regions` - CRUD régions
- `GET /admin/categories` - CRUD catégories

## 🎨 Personnalisation

### Couleurs du Thème
Modifier `/src/styles/theme.css` :
```css
:root {
  --primary: #0066cc;      /* Couleur principale */
  --secondary: #10b981;    /* Couleur secondaire */
  --destructive: #dc2626;  /* Couleur erreur */
}
```

### Régions
Ajouter des régions dans `/src/data/mockData.ts` :
```typescript
export const regions: Region[] = [
  { id: 8, nom: 'Nouvelle Région', code: 'NR' },
  // ...
];
```

## 📝 Notes Importantes

- Les images utilisent Unsplash pour la démo
- Les données sont persistées en localStorage (auth)
- Les statistiques sont simulées avec des données mock
- Le multi-langue est préparé mais seul FR est complet
- Les graphiques utilisent des placeholders (à implémenter avec recharts)

## 🤝 Contribution

Cette application est une démo complète prête pour la production. Pour l'adapter :
1. Remplacer mockData par des appels API réels
2. Implémenter les graphiques avec recharts
3. Ajouter les traductions AR complètes
4. Configurer un vrai système d'authentification (JWT)
5. Ajouter le paiement en ligne

## 📄 Licence

© 2026 EventMa - Plateforme de gestion événementielle au Maroc
