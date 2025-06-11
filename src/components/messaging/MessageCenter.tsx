'use client';

import { useState, useMemo } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import ConversationItem from './ConversationItem';
import ConversationView from './ConversationView';
import MessagesNavigation from './MessagesNavigation';
import { DemandeWithDetails } from '@/types/messaging';
import { ChatCentered } from 'phosphor-react';

interface MessageCenterProps {
  userId: string;
  userRole: 'proprietaire' | 'gestionnaire';
}

/**
 * Composant principal du centre de messagerie
 */
export default function MessageCenter({ userId, userRole }: MessageCenterProps) {
  const { demandes, isLoading, error } = useMessaging(userId, userRole);
  const [selectedDemande, setSelectedDemande] = useState<DemandeWithDetails | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Gestion de la sélection d'une conversation
  const handleSelectConversation = (demande: DemandeWithDetails) => {
    setSelectedDemande(demande);
    setShowMobileChat(true);
  };

  // Retour à la liste sur mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedDemande(null);
  };

  // Filtrage et recherche des conversations
  const filteredDemandes = useMemo(() => {
    let filtered = demandes;

    // Filtre par statut
    if (activeFilter !== 'all') {
      filtered = filtered.filter(demande => demande.statut === activeFilter);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(demande => {
        const otherParticipant = userRole === 'proprietaire' 
          ? demande.gestionnaire?.nom || ''
          : demande.proprietaire.nom || '';
        
        return (
          otherParticipant.toLowerCase().includes(query) ||
          demande.propriete?.adresse?.toLowerCase().includes(query) ||
          demande.dernierMessage?.contenu?.toLowerCase().includes(query) ||
          demande.message_initial?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [demandes, activeFilter, searchQuery, userRole]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">❌</div>
          <p className="text-gray-600">Erreur lors du chargement des conversations</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Navigation supérieure */}
      <MessagesNavigation
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userRole={userRole}
        conversationsCount={demandes.length}
      />

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Liste des conversations */}
        <div className={`w-full md:w-1/3 bg-white border-r border-gray-200 ${
          showMobileChat ? 'hidden md:block' : 'block'
        }`}>

          {/* Liste */}
          <div className="overflow-y-auto h-full">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : filteredDemandes.length === 0 ? (
              <div className="flex items-center justify-center p-8 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-gray-600">
                    {searchQuery ? 'Aucun résultat trouvé' : 'Aucune conversation'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchQuery 
                      ? 'Essayez un autre terme de recherche'
                      : userRole === 'proprietaire' 
                        ? 'Contactez des gestionnaires pour commencer'
                        : 'Les propriétaires vous contacteront ici'
                    }
                  </p>
                </div>
              </div>
            ) : (
              filteredDemandes.map((demande) => (
                <ConversationItem
                  key={demande.id}
                  demande={demande}
                  isSelected={selectedDemande?.id === demande.id}
                  onClick={() => handleSelectConversation(demande)}
                  userRole={userRole}
                />
              ))
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className={`flex-1 ${
          showMobileChat ? 'block' : 'hidden md:block'
        }`}>
          {selectedDemande ? (
            <ConversationView
              demande={selectedDemande}
              currentUserId={userId}
              userRole={userRole}
              onBack={handleBackToList}
              showBackButton={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 text-lg">Sélectionnez une conversation</p>
                <p className="text-sm text-gray-500 mt-1">
                  Choisissez une conversation dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 