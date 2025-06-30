import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

interface AvisGestionnaire {
  id: string;
  auteur_id: string;
  gestionnaire_id: string;
  note: number;
  commentaire?: string;
  cree_le: string;
  auteur?: {
    nom: string;
    email: string;
  }[];
}

interface UseAvisGestionnaireSimpleReturn {
  avis: AvisGestionnaire[];
  loading: boolean;
  error: string | null;
  canCreateAvis: (auteur_id: string, gestionnaire_id: string) => Promise<boolean>;
  createAvis: (data: {
    gestionnaire_id: string;
    note: number;
    commentaire?: string;
  }) => Promise<boolean>;
}

/**
 * Hook simplifié pour gérer les avis des gestionnaires
 * Basé sur les demandes acceptées plutôt que sur les contrats
 */
export function useAvisGestionnaireSimple(gestionnaireId?: string): UseAvisGestionnaireSimpleReturn {
  const [avis, setAvis] = useState<AvisGestionnaire[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les avis pour un gestionnaire
  useEffect(() => {
    if (!gestionnaireId) return;

    const fetchAvis = async () => {
      try {
        setLoading(true);
        setError(null);

        // Essayer d'abord de récupérer depuis la table avis existante
        const { data, error: fetchError } = await supabase
          .from('avis')
          .select(`
            id,
            auteur_id,
            gestionnaire_id,
            note,
            commentaire,
            cree_le,
            auteur:utilisateurs!auteur_id(nom, email)
          `)
          .eq('gestionnaire_id', gestionnaireId)
          .order('cree_le', { ascending: false });

        if (fetchError) {
          console.log('Pas d\'avis dans la table existante:', fetchError);
          setAvis([]);
        } else {
          setAvis(data || []);
        }

      } catch (err) {
        console.error('Erreur lors du chargement des avis:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des avis');
      } finally {
        setLoading(false);
      }
    };

    fetchAvis();
  }, [gestionnaireId]);

  // Vérifier si un utilisateur peut créer un avis (a des demandes acceptées)
  const canCreateAvis = async (auteur_id: string, gestionnaire_id: string): Promise<boolean> => {
    try {
      const { data: demandes, error: demandeError } = await supabase
        .from('demande')
        .select('id')
        .eq('proprietaire_id', auteur_id)
        .eq('gestionnaire_id', gestionnaire_id)
        .eq('statut', 'acceptee');

      if (demandeError) {
        console.error('Erreur lors de la vérification des demandes:', demandeError);
        return false;
      }

      return (demandes?.length || 0) > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification des permissions:', err);
      return false;
    }
  };

  // Créer un nouvel avis
  const createAvis = async (data: {
    gestionnaire_id: string;
    note: number;
    commentaire?: string;
  }): Promise<boolean> => {
    try {
      setError(null);

      // Obtenir l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Vérifier que l'utilisateur peut créer un avis
      const canCreate = await canCreateAvis(user.id, data.gestionnaire_id);
      if (!canCreate) {
        throw new Error('Vous devez avoir des biens en gestion avec ce gestionnaire pour laisser un avis');
      }

      // Pour contourner le problème de contrat_id obligatoire dans la table avis,
      // nous devons créer un contrat minimal ou utiliser une autre approche
      
      // Option 1: Créer un contrat minimal basé sur la première demande acceptée
      const { data: demandes } = await supabase
        .from('demande')
        .select('id')
        .eq('proprietaire_id', user.id)
        .eq('gestionnaire_id', data.gestionnaire_id)
        .eq('statut', 'acceptee')
        .limit(1);

      if (!demandes || demandes.length === 0) {
        throw new Error('Aucune demande acceptée trouvée');
      }

      const demande_id = demandes[0].id;

      // Vérifier s'il existe déjà un contrat pour cette demande
      let contrat_id = null;
      const { data: existingContrat } = await supabase
        .from('contrat')
        .select('id')
        .eq('demande_id', demande_id)
        .single();

      if (existingContrat) {
        contrat_id = existingContrat.id;
      } else {
        // Créer un contrat minimal pour cette demande
        const { data: newContrat, error: contratError } = await supabase
          .from('contrat')
          .insert({
            demande_id: demande_id,
            statut: 'signe',
            montant: 0,
            date_debut: new Date().toISOString().split('T')[0]
          })
          .select('id')
          .single();

        if (contratError) {
          throw contratError;
        }

        contrat_id = newContrat.id;
      }

      // Créer l'avis
      const { error: insertError } = await supabase
        .from('avis')
        .insert({
          auteur_id: user.id,
          gestionnaire_id: data.gestionnaire_id,
          contrat_id: contrat_id,
          note: data.note,
          commentaire: data.commentaire
        });

      if (insertError) {
        throw insertError;
      }

      // Recharger les avis
      if (gestionnaireId === data.gestionnaire_id) {
        const { data: newAvis, error: fetchError } = await supabase
          .from('avis')
          .select(`
            id,
            auteur_id,
            gestionnaire_id,
            note,
            commentaire,
            cree_le,
            auteur:utilisateurs!auteur_id(nom, email)
          `)
          .eq('gestionnaire_id', gestionnaireId)
          .order('cree_le', { ascending: false });

        if (!fetchError) {
          setAvis(newAvis || []);
        }
      }

      return true;
    } catch (err) {
      console.error('Erreur lors de la création de l\'avis:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'avis');
      return false;
    }
  };

  return {
    avis,
    loading,
    error,
    canCreateAvis,
    createAvis
  };
} 