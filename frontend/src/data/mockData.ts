// Types basés sur les entités de la base de données
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  enabled: boolean;
  date_inscription: string;
  roles: Role[];
}

export interface Role {
  id: number;
  nom: 'ROLE_CLIENT' | 'ROLE_ORGANISATEUR' | 'ROLE_ADMIN';
}

export interface Region {
  id: number;
  nom: string;
  code: string;
}

export interface Category {
  id: number;
  nom: string;
  description: string;
}

export interface Event {
  id: number;
  titre: string;
  description: string;
  date_event: string;
  heure_debut: string;
  lieu: string;
  image_url: string;
  nb_vues: number;
  statut: 'BROUILLON' | 'PUBLIE' | 'ANNULE' | 'TERMINE';
  categorie_id: number;
  region_id: number;
  organisateur_id: number;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: number;
  type_billet: string;
  prix: number;
  places_initial: number;
  places_disponibles: number;
  date_expiration: string;
  event_id: number;
}

export interface Reservation {
  id: number;
  code_reservation: string;
  date_reservation: string;
  nb_places: number;
  montant_total: number;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'EXPIREE';
  user_id: number;
  offer_id: number;
}

export interface Statistic {
  id: number;
  date_consultation: string;
  nb_vues: number;
  nb_reservations: number;
  chiffre_affaires: number;
  event_id: number;
}

// Données mockées
export const roles: Role[] = [
  { id: 1, nom: 'ROLE_CLIENT' },
  { id: 2, nom: 'ROLE_ORGANISATEUR' },
  { id: 3, nom: 'ROLE_ADMIN' },
];

export const regions: Region[] = [
  { id: 1, nom: 'Casablanca-Settat', code: 'CAS' },
  { id: 2, nom: 'Rabat-Salé-Kénitra', code: 'RAB' },
  { id: 3, nom: 'Marrakech-Safi', code: 'MAR' },
  { id: 4, nom: 'Fès-Meknès', code: 'FES' },
  { id: 5, nom: 'Tanger-Tétouan-Al Hoceïma', code: 'TNG' },
  { id: 6, nom: 'Agadir-Ida-Outanane', code: 'AGA' },
  { id: 7, nom: 'Oriental', code: 'ORI' },
];

export const categories: Category[] = [
  { id: 1, nom: 'Concert', description: 'Concerts et spectacles musicaux' },
  { id: 2, nom: 'Sport', description: 'Événements sportifs' },
  { id: 3, nom: 'Conférence', description: 'Conférences et séminaires' },
  { id: 4, nom: 'Festival', description: 'Festivals culturels et artistiques' },
  { id: 5, nom: 'Théâtre', description: 'Pièces de théâtre et one-man shows' },
  { id: 6, nom: 'Exposition', description: 'Expositions et galeries' },
  { id: 7, nom: 'Gastronomie', description: 'Événements culinaires' },
  { id: 8, nom: 'Formation', description: 'Ateliers et formations' },
];

export const users: User[] = [
  {
    id: 1,
    nom: 'Alami',
    prenom: 'Mohammed',
    email: 'client@example.ma',
    password: 'password123',
    telephone: '+212 6 12 34 56 78',
    enabled: true,
    date_inscription: '2024-01-15',
    roles: [roles[0]],
  },
  {
    id: 2,
    nom: 'Benali',
    prenom: 'Fatima',
    email: 'organisateur@example.ma',
    password: 'password123',
    telephone: '+212 6 23 45 67 89',
    enabled: true,
    date_inscription: '2023-06-20',
    roles: [roles[1]],
  },
  {
    id: 3,
    nom: 'Idrissi',
    prenom: 'Youssef',
    email: 'admin@example.ma',
    password: 'password123',
    telephone: '+212 6 34 56 78 90',
    enabled: true,
    date_inscription: '2023-01-01',
    roles: [roles[2]],
  },
];

export const events: Event[] = [
  {
    id: 1,
    titre: 'Festival Mawazine 2026',
    description: 'Le plus grand festival de musique du Maroc avec des artistes internationaux et locaux. Une célébration de la diversité musicale sur plusieurs scènes dans toute la ville.',
    date_event: '2026-06-15',
    heure_debut: '18:00',
    lieu: 'Scène OLM Souissi, Rabat',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
    nb_vues: 15430,
    statut: 'PUBLIE',
    categorie_id: 4,
    region_id: 2,
    organisateur_id: 2,
    created_at: '2026-01-10',
    updated_at: '2026-02-01',
  },
  {
    id: 2,
    titre: 'Match Raja vs Wydad',
    description: 'Le derby casablancais tant attendu entre les deux grands clubs de la ville. Ambiance garantie au stade Mohammed V.',
    date_event: '2026-03-20',
    heure_debut: '20:00',
    lieu: 'Stade Mohammed V, Casablanca',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
    nb_vues: 8920,
    statut: 'PUBLIE',
    categorie_id: 2,
    region_id: 1,
    organisateur_id: 2,
    created_at: '2026-01-05',
    updated_at: '2026-01-15',
  },
  {
    id: 3,
    titre: 'Conférence Tech Morocco 2026',
    description: 'Conférence annuelle sur les technologies et l\'innovation digitale au Maroc. Intervenants de renommée internationale.',
    date_event: '2026-04-10',
    heure_debut: '09:00',
    lieu: 'Sofitel Rabat Jardin des Roses',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    nb_vues: 3240,
    statut: 'PUBLIE',
    categorie_id: 3,
    region_id: 2,
    organisateur_id: 2,
    created_at: '2025-12-20',
    updated_at: '2026-01-20',
  },
  {
    id: 4,
    titre: 'Saad Lamjarred en Concert',
    description: 'Concert exceptionnel de la star marocaine Saad Lamjarred avec tous ses grands succès.',
    date_event: '2026-05-25',
    heure_debut: '21:00',
    lieu: 'Palais des Congrès, Marrakech',
    image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop',
    nb_vues: 12680,
    statut: 'PUBLIE',
    categorie_id: 1,
    region_id: 3,
    organisateur_id: 2,
    created_at: '2026-01-25',
    updated_at: '2026-01-30',
  },
  {
    id: 5,
    titre: 'Exposition Art Contemporain',
    description: 'Exposition d\'art contemporain marocain avec des œuvres d\'artistes émergents et confirmés.',
    date_event: '2026-03-01',
    heure_debut: '10:00',
    lieu: 'Musée Mohammed VI, Rabat',
    image_url: 'https://images.squarespace-cdn.com/content/v1/5e7d4795f666745c5646bc62/1730227171985-P15ZCO4LROX7OKZ2LXK5/PBG-Art+Toronto-Booth-007.jpeg',
    nb_vues: 1850,
    statut: 'PUBLIE',
    categorie_id: 6,
    region_id: 2,
    organisateur_id: 2,
    created_at: '2026-01-12',
    updated_at: '2026-01-18',
  },
  {
    id: 6,
    titre: 'Festival Timitar',
    description: 'Festival de musiques du monde à Agadir, célébrant la musique amazighe et les cultures du monde.',
    date_event: '2026-07-10',
    heure_debut: '19:00',
    lieu: 'Théâtre de verdure, Agadir',
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop',
    nb_vues: 6540,
    statut: 'PUBLIE',
    categorie_id: 4,
    region_id: 6,
    organisateur_id: 2,
    created_at: '2026-01-08',
    updated_at: '2026-02-02',
  },
];

export const offers: Offer[] = [
  // Festival Mawazine
  { id: 1, type_billet: 'Standard', prix: 150, places_initial: 5000, places_disponibles: 2340, date_expiration: '2026-06-14', event_id: 1 },
  { id: 2, type_billet: 'VIP', prix: 500, places_initial: 500, places_disponibles: 120, date_expiration: '2026-06-14', event_id: 1 },
  { id: 3, type_billet: 'Étudiant', prix: 80, places_initial: 1000, places_disponibles: 456, date_expiration: '2026-06-14', event_id: 1 },
  
  // Match Raja vs Wydad
  { id: 4, type_billet: 'Tribune', prix: 100, places_initial: 10000, places_disponibles: 3450, date_expiration: '2026-03-19', event_id: 2 },
  { id: 5, type_billet: 'Loge VIP', prix: 400, places_initial: 200, places_disponibles: 45, date_expiration: '2026-03-19', event_id: 2 },
  
  // Conférence Tech
  { id: 6, type_billet: 'Pass 1 jour', prix: 300, places_initial: 500, places_disponibles: 234, date_expiration: '2026-04-09', event_id: 3 },
  { id: 7, type_billet: 'Pass 3 jours', prix: 750, places_initial: 300, places_disponibles: 178, date_expiration: '2026-04-09', event_id: 3 },
  
  // Saad Lamjarred
  { id: 8, type_billet: 'Carré Or', prix: 600, places_initial: 300, places_disponibles: 89, date_expiration: '2026-05-24', event_id: 4 },
  { id: 9, type_billet: 'Parterre', prix: 350, places_initial: 1000, places_disponibles: 456, date_expiration: '2026-05-24', event_id: 4 },
  { id: 10, type_billet: 'Balcon', prix: 200, places_initial: 800, places_disponibles: 345, date_expiration: '2026-05-24', event_id: 4 },
  
  // Exposition
  { id: 11, type_billet: 'Entrée Générale', prix: 50, places_initial: 2000, places_disponibles: 1876, date_expiration: '2026-03-31', event_id: 5 },
  
  // Timitar
  { id: 12, type_billet: 'Pass Festival', prix: 200, places_initial: 3000, places_disponibles: 1234, date_expiration: '2026-07-09', event_id: 6 },
  { id: 13, type_billet: 'VIP Backstage', prix: 800, places_initial: 100, places_disponibles: 34, date_expiration: '2026-07-09', event_id: 6 },
];

export const reservations: Reservation[] = [
  {
    id: 1,
    code_reservation: 'RES-2026-001234',
    date_reservation: '2026-02-03',
    nb_places: 2,
    montant_total: 300,
    statut: 'CONFIRMEE',
    user_id: 1,
    offer_id: 1,
  },
  {
    id: 2,
    code_reservation: 'RES-2026-001235',
    date_reservation: '2026-02-04',
    nb_places: 4,
    montant_total: 400,
    statut: 'CONFIRMEE',
    user_id: 1,
    offer_id: 4,
  },
  {
    id: 3,
    code_reservation: 'RES-2026-001236',
    date_reservation: '2026-01-28',
    nb_places: 1,
    montant_total: 300,
    statut: 'EN_ATTENTE',
    user_id: 1,
    offer_id: 6,
  },
];

export const statistics: Statistic[] = [
  { id: 1, date_consultation: '2026-02-01', nb_vues: 450, nb_reservations: 23, chiffre_affaires: 12500, event_id: 1 },
  { id: 2, date_consultation: '2026-02-02', nb_vues: 523, nb_reservations: 31, chiffre_affaires: 15800, event_id: 1 },
  { id: 3, date_consultation: '2026-02-03', nb_vues: 612, nb_reservations: 28, chiffre_affaires: 14200, event_id: 1 },
  { id: 4, date_consultation: '2026-02-04', nb_vues: 701, nb_reservations: 35, chiffre_affaires: 18300, event_id: 1 },
  { id: 5, date_consultation: '2026-02-05', nb_vues: 834, nb_reservations: 42, chiffre_affaires: 21400, event_id: 1 },
];

// Fonctions utilitaires
export const getEventById = (id: number): Event | undefined => {
  return events.find(e => e.id === id);
};

export const getCategoryById = (id: number): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const getRegionById = (id: number): Region | undefined => {
  return regions.find(r => r.id === id);
};

export const getOffersByEventId = (eventId: number): Offer[] => {
  return offers.filter(o => o.event_id === eventId);
};

export const getOfferById = (id: number): Offer | undefined => {
  return offers.find(o => o.id === id);
};

export const getUserById = (id: number): User | undefined => {
  return users.find(u => u.id === id);
};

export const getReservationsByUserId = (userId: number): Reservation[] => {
  return reservations.filter(r => r.user_id === userId);
};

export const getStatisticsByEventId = (eventId: number): Statistic[] => {
  return statistics.filter(s => s.event_id === eventId);
};

export const getEventsByOrganisateurId = (organisateurId: number): Event[] => {
  return events.filter(e => e.organisateur_id === organisateurId);
};
