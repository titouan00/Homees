export interface Demande {
  id: string;
  proprietaire_id: string;
  gestionnaire_id: string | null;
  statut: 'ouverte' | 'acceptee' | 'rejetee' | 'terminee';
  message_initial: string | null;
  créé_le: string;
  mis_a_jour_le: string;
}

export interface Message {
  id: string;
  demande_id: string;
  emetteur_id: string;
  contenu: string;
  envoye_le: string;
}

export interface DemandeWithDetails extends Demande {
  proprietaire: {
    id: string;
    nom: string;
    email: string;
  };
  gestionnaire?: {
    id: string;
    nom: string;
    email: string;
  };
  dernierMessage?: Message;
  nombreMessagesNonLus?: number;
}

export interface MessageWithSender extends Message {
  emetteur: {
    id: string;
    nom: string;
    rôle: 'proprietaire' | 'gestionnaire';
  };
}

export interface ConversationState {
  demande: DemandeWithDetails;
  messages: MessageWithSender[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateDemandeData {
  proprietaire_id: string;
  gestionnaire_id: string;
  message_initial: string;
}

export interface SendMessageData {
  demande_id: string;
  emetteur_id: string;
  contenu: string;
} 