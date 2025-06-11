'use client';

import { DemandeWithDetails } from '@/types/messaging';
import { House, Clock, CheckCircle, XCircle } from 'phosphor-react';

interface ConversationItemProps {
  demande: DemandeWithDetails;
  isSelected?: boolean;
  onClick: () => void;
  userRole: 'proprietaire' | 'gestionnaire';
}

/**
 * Composant pour afficher un élément de conversation dans la liste
 */
export default function ConversationItem({ 
  demande, 
  isSelected = false, 
  onClick,
  userRole 
}: ConversationItemProps) {
  // Nom de l'autre participant
  const otherParticipant = userRole === 'proprietaire' 
    ? demande.gestionnaire?.nom || 'Gestionnaire'
    : demande.proprietaire.nom;

  // Icône de statut
  const getStatusIcon = () => {
    switch (demande.statut) {
      case 'acceptee':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejetee':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'terminee':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  // Texte du statut
  const getStatusText = () => {
    switch (demande.statut) {
      case 'acceptee': return 'Acceptée';
      case 'rejetee': return 'Rejetée';
      case 'terminee': return 'Terminée';
      default: return 'En attente';
    }
  };

  // Formater le timestamp du dernier message
  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
        isSelected ? 'bg-emerald-50 border-emerald-200' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar ou icône */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
            <House className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {otherParticipant}
            </h4>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              {demande.dernierMessage && (
                <span className="text-xs text-gray-500">
                  {formatLastMessageTime(demande.dernierMessage.envoye_le)}
                </span>
              )}
            </div>
          </div>

          {/* Informations sur la propriété */}
          {demande.propriete && (
            <p className="text-xs text-gray-600 mt-1 truncate">
              📍 {demande.propriete.adresse}
            </p>
          )}

          {/* Dernier message */}
          {demande.dernierMessage ? (
            <p className="text-sm text-gray-600 mt-1 truncate">
              {demande.dernierMessage.contenu}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic mt-1">
              {demande.message_initial || 'Nouvelle conversation'}
            </p>
          )}

          {/* Statut et badge non lu */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {getStatusText()}
            </span>
            {demande.nombreMessagesNonLus && demande.nombreMessagesNonLus > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                {demande.nombreMessagesNonLus}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 