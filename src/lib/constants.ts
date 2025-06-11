/**
 * Constantes et configurations globales pour l'application Homees
 */

/**
 * Configuration de l'API Google Maps
 */
export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places'],
  // Région prioritaire pour les suggestions
  region: 'fr',
  language: 'fr'
};

/**
 * Limites géographiques pour Paris
 * Utilisées pour restreindre les suggestions d'adresses
 */
export const PARIS_BOUNDS = {
  north: 48.9020,   // Limite nord de Paris
  south: 48.8155,   // Limite sud de Paris
  east: 2.4699,     // Limite est de Paris
  west: 2.2241,     // Limite ouest de Paris
} as const;

/**
 * Codes postaux parisiens valides
 * Pattern RegEx pour validation
 */
export const PARIS_POSTAL_CODES = {
  // Codes postaux de 75001 à 75020
  pattern: /^750(0[1-9]|1[0-9]|20)$/,
  list: Array.from({ length: 20 }, (_, i) => `750${(i + 1).toString().padStart(2, '0')}`)
} as const;

/**
 * Messages d'information pour les utilisateurs
 */
export const MESSAGES = {
  parisOnly: {
    title: "Service disponible à Paris uniquement",
    description: "Nous ne desservons actuellement que Paris et ses arrondissements. Nous étendrons bientôt notre service à d'autres villes.",
    futureExpansion: "Prochainement : Lyon, Marseille, Toulouse..."
  },
  loading: {
    googleMaps: "Chargement de la carte...",
    suggestions: "Recherche d'adresses...",
    search: "Recherche en cours..."
  },
  errors: {
    apiKeyMissing: "Clé API Google Maps manquante",
    mapLoadFailed: "Erreur lors du chargement de la carte",
    invalidAddress: "Adresse invalide",
    noSuggestions: "Aucune suggestion trouvée"
  }
} as const;

/**
 * Configuration des champs Google Places
 * Optimise les requêtes API en limitant les données retournées
 */
export const PLACES_FIELDS = [
  'formatted_address',
  'geometry',
  'address_components',
  'place_id',
  'name'
];

/**
 * Types d'adresses acceptés par Google Places
 */
export const PLACES_TYPES = [
  'address'
];

/**
 * Configuration des restrictions géographiques
 */
export const LOCATION_RESTRICTIONS = {
  country: 'fr',
  strictBounds: false, // Permet les suggestions hors bounds mais les filtre ensuite
  bias: true // Favorise les résultats dans les bounds
} as const;

/**
 * Zones de service actuelles et futures
 */
export const SERVICE_AREAS = {
  current: ['Paris'],
  planned: {
    'Q2 2024': ['Lyon'],
    'Q3 2024': ['Marseille'],
    'Q4 2024': ['Toulouse', 'Nice', 'Nantes']
  }
} as const;

/**
 * Délais et timeouts
 */
export const TIMEOUTS = {
  mapLoad: 10000,      // 10 secondes pour charger Google Maps
  searchDebounce: 300, // 300ms de délai pour l'autocomplétion
  warningDisplay: 5000 // 5 secondes d'affichage pour les avertissements
} as const;

/**
 * Options pour les filtres du comparateur
 */
export const LANGUES_DISPONIBLES = [
  { code: 'français', label: 'Français', flag: '🇫🇷' },
  { code: 'anglais', label: 'Anglais', flag: '🇬🇧' },
  { code: 'espagnol', label: 'Espagnol', flag: '🇪🇸' },
  { code: 'italien', label: 'Italien', flag: '🇮🇹' },
  { code: 'allemand', label: 'Allemand', flag: '🇩🇪' },
  { code: 'chinois', label: 'Chinois', flag: '🇨🇳' },
  { code: 'arabe', label: 'Arabe', flag: '🇸🇦' },
  { code: 'portugais', label: 'Portugais', flag: '🇵🇹' },
  { code: 'russe', label: 'Russe', flag: '🇷🇺' },
  { code: 'japonais', label: 'Japonais', flag: '🇯🇵' }
] as const;

export const TYPES_GESTIONNAIRE = [
  { 
    code: 'independant', 
    label: 'Gestionnaire Indépendant',
    description: 'Professionnel indépendant ou petite structure',
    icon: '👤'
  },
  { 
    code: 'agence_locale', 
    label: 'Agence Locale',
    description: 'Agence immobilière de quartier',
    icon: '🏠'
  },
  { 
    code: 'agence_nationale', 
    label: 'Agence Nationale',
    description: 'Réseau national (Foncia, Orpi...)',
    icon: '🏢'
  },
  { 
    code: 'syndic', 
    label: 'Syndic de Copropriété',
    description: 'Spécialisé en gestion de copropriétés',
    icon: '🏘️'
  },
  { 
    code: 'cabinet_expertise', 
    label: 'Cabinet d\'Expertise',
    description: 'Expertise et conseil immobilier',
    icon: '📊'
  }
] as const; 