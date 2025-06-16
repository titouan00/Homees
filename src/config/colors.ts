/**
 * Configuration centralisée des couleurs du projet
 * Utilise les variables CSS définies dans globals.css
 */

export const colors = {
  // Couleurs primaires (Emerald/Vert)
  primary: {
    50: 'var(--primary-50)',
    100: 'var(--primary-100)',
    200: 'var(--primary-200)',
    300: 'var(--primary-300)',
    400: 'var(--primary-400)',
    500: 'var(--primary-500)',
    600: 'var(--primary-600)',
    700: 'var(--primary-700)',
    800: 'var(--primary-800)',
    900: 'var(--primary-900)',
  },
  
  // Couleurs secondaires (Blue/Bleu)
  secondary: {
    50: 'var(--secondary-50)',
    100: 'var(--secondary-100)',
    200: 'var(--secondary-200)',
    300: 'var(--secondary-300)',
    400: 'var(--secondary-400)',
    500: 'var(--secondary-500)',
    600: 'var(--secondary-600)',
    700: 'var(--secondary-700)',
    800: 'var(--secondary-800)',
    900: 'var(--secondary-900)',
  },
  
  // Couleurs neutres (Gray)
  neutral: {
    50: 'var(--neutral-50)',
    100: 'var(--neutral-100)',
    200: 'var(--neutral-200)',
    300: 'var(--neutral-300)',
    400: 'var(--neutral-400)',
    500: 'var(--neutral-500)',
    600: 'var(--neutral-600)',
    700: 'var(--neutral-700)',
    800: 'var(--neutral-800)',
    900: 'var(--neutral-900)',
  },
  
  // Couleurs d'état
  success: {
    50: 'var(--success-50)',
    100: 'var(--success-100)',
    500: 'var(--success-500)',
    600: 'var(--success-600)',
    700: 'var(--success-700)',
  },
  
  warning: {
    50: 'var(--warning-50)',
    100: 'var(--warning-100)',
    500: 'var(--warning-500)',
    600: 'var(--warning-600)',
    700: 'var(--warning-700)',
  },
  
  error: {
    50: 'var(--error-50)',
    100: 'var(--error-100)',
    500: 'var(--error-500)',
    600: 'var(--error-600)',
    700: 'var(--error-700)',
  },
  
  info: {
    50: 'var(--info-50)',
    100: 'var(--info-100)',
    500: 'var(--info-500)',
    600: 'var(--info-600)',
    700: 'var(--info-700)',
  },
} as const;

/**
 * Classes CSS prédéfinies pour les couleurs les plus utilisées
 */
export const colorClasses = {
  // Boutons primaires
  button: {
    primary: 'bg-primary-600 text-white hover-primary focus-primary',
    secondary: 'bg-secondary-600 text-white hover-secondary focus-secondary',
    success: 'bg-success text-white hover:bg-success-600',
    warning: 'bg-warning text-white hover:bg-warning-600',
    error: 'bg-error text-white hover:bg-error-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  },
  
  // Badges et étiquettes
  badge: {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    error: 'bg-error-light text-error',
    info: 'bg-info-light text-info',
    neutral: 'bg-gray-100 text-gray-800',
  },
  
  // Champs de formulaire
  input: {
    default: 'border-gray-300 focus-primary',
    error: 'border-error focus:ring-error-500 focus:border-error-500',
    success: 'border-success focus:ring-success-500 focus:border-success-500',
  },
  
  // Alertes et notifications
  alert: {
    success: 'bg-success-light border-success text-success-light',
    warning: 'bg-warning-light border-warning text-warning-light',
    error: 'bg-error-light border-error text-error-light',
    info: 'bg-info-light border-info text-info-light',
  },
  
  // Textes
  text: {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
    muted: 'text-gray-600',
  },
  
  // Bordures
  border: {
    primary: 'border-primary-200 hover:border-primary-500',
    secondary: 'border-secondary-200 hover:border-secondary-500',
    default: 'border-gray-200',
    muted: 'border-gray-100',
  },
} as const;

/**
 * Utilitaires pour générer des classes CSS dynamiquement
 */
export const getColorClass = {
  /**
   * Génère une classe de couleur de fond
   */
  bg: (color: keyof typeof colors, shade: string = '500') => {
    return `bg-${color}-${shade}`;
  },
  
  /**
   * Génère une classe de couleur de texte
   */
  text: (color: keyof typeof colors, shade: string = '600') => {
    return `text-${color}-${shade}`;
  },
  
  /**
   * Génère une classe de couleur de bordure
   */
  border: (color: keyof typeof colors, shade: string = '200') => {
    return `border-${color}-${shade}`;
  },
  
  /**
   * Génère un badge coloré
   */
  badge: (type: keyof typeof colorClasses.badge) => {
    return colorClasses.badge[type];
  },
  
  /**
   * Génère un bouton coloré
   */
  button: (type: keyof typeof colorClasses.button) => {
    return colorClasses.button[type];
  },
} as const;

/**
 * Mapping des statuts vers les couleurs
 */
export const statusColors = {
  libre: 'success',
  occupe: 'info', 
  en_travaux: 'warning',
  actif: 'success',
  inactif: 'neutral',
  en_attente: 'warning',
  rejete: 'error',
  valide: 'success',
} as const;

export type StatusType = keyof typeof statusColors;
export type ColorType = keyof typeof colors;
export type BadgeType = keyof typeof colorClasses.badge;
export type ButtonType = keyof typeof colorClasses.button; 