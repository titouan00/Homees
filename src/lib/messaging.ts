/**
 * Utilitaires centralisés pour la messagerie
 */

import { DemandeWithDetails } from '@/types/messaging';

// ==================== FORMATAGE ====================

/**
 * Formate un timestamp en temps relatif
 */
export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  return messageDate.toLocaleDateString('fr-FR');
};

/**
 * Formate une date complète
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ==================== STATUTS ====================

/**
 * Configuration des statuts de demande
 */
export const STATUT_CONFIG = {
  ouverte: {
    label: 'En attente',
    color: 'bg-orange-100 text-orange-800',
    icon: '🕐',
    description: 'En attente de réponse du gestionnaire'
  },
  acceptee: {
    label: 'Acceptée',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    description: 'Demande acceptée par le gestionnaire'
  },
  rejetee: {
    label: 'Rejetée',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    description: 'Demande rejetée par le gestionnaire'
  },
  terminee: {
    label: 'Terminée',
    color: 'bg-gray-100 text-gray-800',
    icon: '✓',
    description: 'Conversation terminée'
  }
} as const;

export type StatutType = keyof typeof STATUT_CONFIG;

/**
 * Récupère la configuration d'un statut
 */
export const getStatutInfo = (statut: string) => {
  return STATUT_CONFIG[statut as StatutType] || STATUT_CONFIG.ouverte;
};

// ==================== MESSAGES AUTOMATIQUES ====================

/**
 * Messages automatiques prédéfinis
 */
export const MESSAGES_AUTO = {
  acceptation: (userRole: string) => 
    `✅ J'accepte votre demande ! Je suis intéressé par la gestion de votre bien. Je vais vous préparer une proposition détaillée dans les plus brefs délais.`,
  
  rejet: () => 
    `❌ Merci pour votre demande. Malheureusement, je ne peux pas prendre en charge ce mandat actuellement (zone d'intervention, planning complet, etc.).`,
  
  relance: () => 
    `🔄 Je relance ma demande. Avez-vous maintenant la possibilité de prendre en charge la gestion de mon bien ?`,
  
  termination: () => 
    `📋 Cette conversation a été marquée comme terminée. Merci pour ces échanges !`
};

// ==================== VALIDATION ====================

/**
 * Valide le contenu d'un message
 */
export const validateMessageContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Le message ne peut pas être vide' };
  }
  
  if (content.length > 2000) {
    return { isValid: false, error: 'Le message ne peut pas dépasser 2000 caractères' };
  }
  
  return { isValid: true };
};

// ==================== HELPERS ====================

/**
 * Détermine le nom de l'autre participant dans une conversation
 */
export const getOtherParticipantName = (
  demande: DemandeWithDetails, 
  userRole: 'proprietaire' | 'gestionnaire'
): string => {
  return userRole === 'proprietaire' 
    ? demande.gestionnaire?.nom || 'Gestionnaire'
    : demande.proprietaire.nom;
};

/**
 * Détermine si l'utilisateur peut modifier le statut de la demande
 */
export const canChangeStatus = (
  demande: DemandeWithDetails,
  userRole: 'proprietaire' | 'gestionnaire'
): boolean => {
  // Gestionnaire peut accepter/refuser les demandes ouvertes
  if (userRole === 'gestionnaire' && demande.statut === 'ouverte') {
    return true;
  }
  
  // Propriétaire peut relancer les demandes rejetées
  if (userRole === 'proprietaire' && demande.statut === 'rejetee') {
    return true;
  }
  
  return false;
};

/**
 * Génère un ID de canal unique pour Supabase Realtime
 */
export const getChannelId = (prefix: string, id: string): string => {
  return `${prefix}:${id}`;
};

// ==================== GESTION D'ERREURS ====================

/**
 * Classe d'erreur personnalisée pour la messagerie
 */
export class MessagingError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'MessagingError';
  }
}

/**
 * Gestionnaire d'erreur centralisé
 */
export const handleMessagingError = (error: unknown, context: string): MessagingError => {
  console.error(`[${context}] Erreur:`, error);
  
  if (error instanceof MessagingError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new MessagingError(
      `Erreur lors de ${context}: ${error.message}`,
      'MESSAGING_ERROR',
      error
    );
  }
  
  return new MessagingError(
    `Erreur inconnue lors de ${context}`,
    'UNKNOWN_ERROR',
    error
  );
}; 