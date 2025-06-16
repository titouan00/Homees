'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useConversation } from '@/hooks/useConversation';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import StatusManager from './StatusManager';
import { DemandeWithDetails } from '@/types/messaging';
import { getOtherParticipantName, getStatutInfo } from '@/lib/messaging';
import { House, ArrowLeft } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

interface ConversationViewProps {
  demande: DemandeWithDetails;
  currentUserId: string;
  userRole: 'proprietaire' | 'gestionnaire';
  onBack?: () => void;
  showBackButton?: boolean;
}

/**
 * Composant optimisé pour afficher une conversation complète
 */
const ConversationView = React.memo<ConversationViewProps>(({ 
  demande, 
  currentUserId, 
  userRole,
  onBack,
  showBackButton = false
}) => {
  const { messages, isLoading, error, sendMessage, refetch } = useConversation(demande.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mémoïsation des valeurs calculées
  const otherParticipantName = React.useMemo(
    () => getOtherParticipantName(demande, userRole),
    [demande, userRole]
  );

  const statutInfo = React.useMemo(
    () => getStatutInfo(demande.statut),
    [demande.statut]
  );

  const conversationSubtitle = React.useMemo(
    () => `Conversation ${userRole === 'proprietaire' ? 'avec votre gestionnaire' : 'avec un propriétaire'}`,
    [userRole]
  );

  // Scroll automatique vers le bas - optimisé
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Gestion de l'envoi de message - mémoïsée
  const handleSendMessage = useCallback(async (content: string) => {
    try {
      await sendMessage({
        emetteur_id: currentUserId,
        contenu: content
      });
    } catch (err) {
      console.error('Erreur envoi message:', err);
    }
  }, [sendMessage, currentUserId]);

  // Gestion du retour - mémoïsée
  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  // Composant d'erreur
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">❌</div>
          <p className="text-gray-600">Erreur lors du chargement de la conversation</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header de la conversation */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {/* Bouton retour mobile */}
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="md:hidden"
              aria-label="Retour à la liste des conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Avatar */}
          <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <House className="h-5 w-5 text-white" />
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {otherParticipantName}
            </h3>
            <p className="text-sm text-gray-500">
              {conversationSubtitle}
            </p>
          </div>

          {/* Statut */}
          <div className="flex items-center space-x-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statutInfo.color}`}>
              {statutInfo.label}
            </span>
          </div>
        </div>
      </header>

      {/* Zone des messages */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-gray-600">Aucun message pour l'instant</p>
              <p className="text-sm text-gray-500 mt-1">
                Commencez la conversation ci-dessous
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.emetteur_id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Gestion des statuts de demande */}
      <StatusManager
        demande={demande}
        userRole={userRole}
        currentUserId={currentUserId}
        onStatusUpdate={refetch}
      />

      {/* Zone de saisie */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={isLoading || demande.statut === 'terminee'}
        placeholder={
          demande.statut === 'terminee' 
            ? "Cette conversation est terminée" 
            : "Tapez votre message..."
        }
      />
    </div>
  );
});

ConversationView.displayName = 'ConversationView';

export default ConversationView; 