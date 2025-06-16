'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatCentered, PaperPlaneRight } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface ContactButtonProps {
  gestionnaireId: string;
  gestionnaireNom: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Bouton pour contacter un gestionnaire et créer une conversation
 */
export default function ContactButton({ 
  gestionnaireId, 
  gestionnaireNom,
  className = '',
  variant = 'primary'
}: ContactButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContact = async () => {
    try {
      setIsLoading(true);

      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Vérifier que c'est un propriétaire
      const { data: userData } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!userData || userData.rôle !== 'proprietaire') {
        alert('Seuls les propriétaires peuvent contacter des gestionnaires');
        return;
      }

      // Vérifier si une conversation existe déjà
      const { data: existingDemande } = await supabase
        .from('demande')
        .select('id')
        .eq('proprietaire_id', user.id)
        .eq('gestionnaire_id', gestionnaireId)
        .single();

      if (existingDemande) {
        // Rediriger vers la conversation existante
        router.push('/dashboard/messages');
        return;
      }

      // Créer une nouvelle demande/conversation
      const messageInitial = `Bonjour ${gestionnaireNom},

Je suis intéressé(e) par vos services de gestion immobilière. 

Pourriez-vous me faire une proposition détaillée ?

Cordialement`;

      const { data: newDemande, error } = await supabase
        .from('demande')
        .insert({
          proprietaire_id: user.id,
          gestionnaire_id: gestionnaireId,
          statut: 'ouverte',
          message_initial: messageInitial
        })
        .select()
        .single();

      if (error) throw error;

      // Envoyer le message initial
      await supabase
        .from('message')
        .insert({
          demande_id: newDemande.id,
          emetteur_id: user.id,
          contenu: messageInitial
        });

      // Rediriger vers les messages
      router.push('/dashboard/messages');

    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      alert('Erreur lors de la création de la conversation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleContact}
      variant={variant}
      loading={isLoading}
      icon={variant === 'primary' ? PaperPlaneRight : ChatCentered}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? 'Connexion...' : 'Contacter'}
    </Button>
  );
} 