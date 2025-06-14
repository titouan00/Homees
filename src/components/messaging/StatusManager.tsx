'use client';

import React, { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { DemandeWithDetails } from '@/types/messaging';
import { MESSAGES_AUTO, canChangeStatus, handleMessagingError } from '@/lib/messaging';
import { CheckCircle, XCircle, Clock, ArrowCounterClockwise } from 'phosphor-react';

interface StatusManagerProps {
  demande: DemandeWithDetails;
  userRole: 'proprietaire' | 'gestionnaire';
  onStatusUpdate: () => void;
  currentUserId: string;
}

/**
 * Composant optimisé pour gérer les statuts des demandes
 */
const StatusManager = React.memo<StatusManagerProps>(({ 
  demande, 
  userRole, 
  onStatusUpdate,
  currentUserId
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Gestionnaire de changement de statut optimisé
  const handleStatusChange = useCallback(async (
    newStatus: 'acceptee' | 'rejetee' | 'ouverte' | 'terminee',
    messageType: keyof typeof MESSAGES_AUTO
  ) => {
    try {
      setIsUpdating(true);

      // 1. Mettre à jour le statut de la demande
      const { error: updateError } = await supabase
        .from('demande')
        .update({ 
          statut: newStatus,
          mis_a_jour_le: new Date().toISOString()
        })
        .eq('id', demande.id);

      if (updateError) throw updateError;

      // 2. Envoyer un message automatique
      const automaticMessage = MESSAGES_AUTO[messageType](userRole);
      const { error: messageError } = await supabase
        .from('message')
        .insert({
          demande_id: demande.id,
          emetteur_id: currentUserId,
          contenu: automaticMessage
        });

      if (messageError) throw messageError;

      // 3. Créer une notification pour l'autre partie
      const destinataireId = userRole === 'gestionnaire' 
        ? demande.proprietaire_id 
        : demande.gestionnaire_id;

      if (destinataireId) {
        await supabase
          .from('notification')
          .insert({
            destinataire_id: destinataireId,
            type: 'status_change',
            payload: {
              demande_id: demande.id,
              nouveau_statut: newStatus
            }
          });
      }

      // 4. Déclencher la mise à jour
      onStatusUpdate();

    } catch (error) {
      const messagingError = handleMessagingError(error, `changement de statut vers ${newStatus}`);
      alert(`Erreur: ${messagingError.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [demande.id, demande.proprietaire_id, demande.gestionnaire_id, userRole, currentUserId, onStatusUpdate]);

  // Vérifier si l'utilisateur peut changer le statut
  if (!canChangeStatus(demande, userRole)) {
    return null;
  }

  // Interface pour gestionnaire sur demande ouverte
  if (userRole === 'gestionnaire' && demande.statut === 'ouverte') {
    return (
      <div className="border-t border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Nouvelle demande en attente
                </h4>
                <p className="text-sm text-gray-600">
                  Une demande de gestion attend votre réponse
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => handleStatusChange('acceptee', 'acceptation')}
                loading={isUpdating}
                icon={CheckCircle}
                disabled={isUpdating}
              >
                Accepter
              </Button>
              
              <Button
                variant="danger"
                onClick={() => handleStatusChange('rejetee', 'rejet')}
                loading={isUpdating}
                icon={XCircle}
                disabled={isUpdating}
              >
                Refuser
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface pour propriétaire sur demande rejetée
  if (userRole === 'proprietaire' && demande.statut === 'rejetee') {
    return (
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-700">
                  Demande refusée
                </h4>
                <p className="text-sm text-gray-500">
                  Vous pouvez relancer cette demande si vous le souhaitez
                </p>
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={() => handleStatusChange('ouverte', 'relance')}
              loading={isUpdating}
              icon={ArrowCounterClockwise}
              disabled={isUpdating}
            >
              Relancer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Interface pour gestionnaire sur demande acceptée
  if (userRole === 'gestionnaire' && demande.statut === 'acceptee') {
    return (
      <div className="border-t border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Demande acceptée
                </h4>
                <p className="text-sm text-gray-600">
                  Prochaine étape : proposer un contrat de gestion
                </p>
              </div>
            </div>
            
            <Button
              variant="primary"
              onClick={() => {
                // TODO: Ouvrir modal de création de contrat
                alert('Fonctionnalité de création de contrat à venir');
              }}
              disabled={isUpdating}
            >
              Créer un contrat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

StatusManager.displayName = 'StatusManager';

export default StatusManager; 