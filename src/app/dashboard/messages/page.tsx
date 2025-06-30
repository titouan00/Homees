'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/navigation/DashboardLayout';
import MessageCenter from '@/components/messaging/MessageCenter';
import { useAuth } from '@/hooks/useAuth';
import { useCreateDemande } from '@/hooks/useCreateDemande';
import { supabase } from '@/lib/supabase-client';

/**
 * Page principale des messages dans le dashboard
 */
export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  
  const gestionnaireParam = searchParams.get('gestionnaire');
  const { createDemande } = useCreateDemande(user?.id || '');

  // Effet pour créer automatiquement une conversation si paramètre gestionnaire présent
  useEffect(() => {
    const handleAutoCreateConversation = async () => {
      if (!gestionnaireParam || !user || user.role !== 'proprietaire' || isCreatingConversation) {
        return;
      }

      try {
        setIsCreatingConversation(true);

        // Vérifier si une conversation existe déjà avec ce gestionnaire
        const { data: existingDemande } = await supabase
          .from('demande')
          .select('id')
          .eq('proprietaire_id', user.id)
          .eq('gestionnaire_id', gestionnaireParam)
          .maybeSingle();

        if (existingDemande) {
          // Conversation existe déjà, nettoyer l'URL
          router.replace('/dashboard/messages');
          return;
        }

        // Récupérer les infos du gestionnaire pour le message
        const { data: gestionnaire } = await supabase
          .from('profil_gestionnaire')
          .select('nom_agence, utilisateur_id')
          .eq('gestionnaire_id', gestionnaireParam)
          .single();

        // Créer une nouvelle demande/conversation
        const result = await createDemande({
          gestionnaire_id: gestionnaireParam,
          message_initial: `Bonjour ${gestionnaire?.nom_agence || 'Gestionnaire'},

Je souhaiterais discuter avec vous concernant la gestion de mes biens immobiliers.

Pourriez-vous me présenter vos services et vos tarifs ?

Cordialement`
        });

        if (result.success) {
          // Nettoyer l'URL après création réussie
          router.replace('/dashboard/messages');
        } else {
          console.error('Erreur lors de la création de la conversation:', result.error);
        }
      } catch (error) {
        console.error('Erreur lors de la création automatique de conversation:', error);
      } finally {
        setIsCreatingConversation(false);
      }
    };

    handleAutoCreateConversation();
  }, [gestionnaireParam, user, createDemande, router, isCreatingConversation]);

  if (isLoading || isCreatingConversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isCreatingConversation ? 'Création de la conversation...' : 'Chargement...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout 
      userProfile={user}
      title="Messages"
      subtitle={`Gérez vos conversations avec les ${user.role === 'proprietaire' ? 'gestionnaires' : 'propriétaires'}`}
    >
      <div className="h-full p-6">
        <MessageCenter 
          userId={user.id} 
          userRole={user.role as 'proprietaire' | 'gestionnaire'} 
        />
      </div>
    </DashboardLayout>
  );
} 