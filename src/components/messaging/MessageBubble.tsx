'use client';

import React from 'react';
import { MessageWithSender } from '@/types/messaging';
import { formatTimeAgo } from '@/lib/messaging';

interface MessageBubbleProps {
  message: MessageWithSender;
  isOwn: boolean;
}

/**
 * Composant optimisé pour afficher une bulle de message
 * Mémoïsé pour éviter les re-renders inutiles
 */
const MessageBubble = React.memo<MessageBubbleProps>(({ message, isOwn }) => {
  const hasContent = message.contenu && message.contenu.trim().length > 0;

  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-xs lg:max-w-md">
        {/* Nom de l'expéditeur (seulement pour les messages des autres) */}
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1 ml-3">
            {message.emetteur.nom}
          </div>
        )}
        
        {/* Bulle du message */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {hasContent ? (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.contenu}
            </p>
          ) : (
            <p className="text-xs text-gray-400 italic">
              Message vide
            </p>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right mr-3' : 'ml-3'}`}>
          {formatTimeAgo(message.envoye_le)}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble; 