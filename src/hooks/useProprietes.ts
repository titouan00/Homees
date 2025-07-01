'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Propriete, ProprieteAvecGestion, NouvelleProprieteForme, FiltresProprietes } from '@/types/propriete';

interface UseProprietesReturn {
  proprietes: ProprieteAvecGestion[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  ajouterPropriete: (propriete: NouvelleProprieteForme) => Promise<boolean>;
  modifierPropriete: (id: string, propriete: Partial<NouvelleProprieteForme>) => Promise<boolean>;
  supprimerPropriete: (id: string) => Promise<boolean>;
  refetch: () => void;
}

interface UseProprietesParams {
  proprietaireId?: string;
  filtres?: FiltresProprietes;
  recherche?: string;
  page?: number;
  limit?: number;
}

/**
 * Hook pour gérer les propriétés d'un propriétaire avec informations de gestion
 */
export function useProprietes(params: UseProprietesParams): UseProprietesReturn {
  const [proprietes, setProprietes] = useState<ProprieteAvecGestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Mémoriser les paramètres pour éviter les re-rendus inutiles
  const { proprietaireId, filtres, recherche, page = 1, limit = 10 } = params;

  const fetchProprietes = useCallback(async () => {
    if (!proprietaireId) {
      setLoading(false);
      setProprietes([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // D'abord récupérer les propriétés avec le count total
      let query = supabase
        .from('propriete')
        .select('*', { count: 'exact' })
        .eq('proprietaire_id', proprietaireId);

      // Appliquer la recherche (sur adresse ET ville)
      if (recherche && recherche.trim()) {
        const searchTerm = recherche.trim();
        query = query.or(`adresse.ilike.%${searchTerm}%,ville.ilike.%${searchTerm}%`);
      }

      // Appliquer les filtres
      if (filtres) {
        if (filtres.type_bien && filtres.type_bien.length > 0) {
          query = query.in('type_bien', filtres.type_bien);
        }

        if (filtres.statut_occupation && filtres.statut_occupation.length > 0) {
          query = query.in('statut_occupation', filtres.statut_occupation);
        }

        if (filtres.ville) {
          query = query.ilike('ville', `%${filtres.ville}%`);
        }

        if (filtres.surface_min !== undefined) {
          query = query.gte('surface_m2', filtres.surface_min);
        }

        if (filtres.surface_max !== undefined) {
          query = query.lte('surface_m2', filtres.surface_max);
        }

        if (filtres.loyer_min !== undefined) {
          query = query.gte('loyer_indicatif', filtres.loyer_min);
        }

        if (filtres.loyer_max !== undefined) {
          query = query.lte('loyer_indicatif', filtres.loyer_max);
        }

        // Tri
        const orderColumn = filtres.tri_par === 'surface' ? 'surface_m2' :
                           filtres.tri_par === 'loyer' ? 'loyer_indicatif' :
                           filtres.tri_par === 'adresse' ? 'adresse' : 'créé_le';

        query = query.order(orderColumn, {
          ascending: filtres.ordre === 'asc',
          nullsFirst: false
        });
      } else {
        // Tri par défaut par date de création
        query = query.order('créé_le', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data: proprietesData, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!proprietesData || proprietesData.length === 0) {
        setProprietes([]);
        setTotalCount(count || 0);
        return;
      }

      console.log('🚀 Starting useProprietes hook, proprietaireId:', proprietaireId);
      console.log('📦 Proprietes raw data:', proprietesData);

      // Nouvelle approche inspirée de useBiensEnGestion : récupérer toutes les demandes acceptées d'un coup
      console.log('🔍 Querying demandes with proprietaireId:', proprietaireId, 'type:', typeof proprietaireId);
      
      // Test 1: requête simple sans filtre
      const { data: testData, error: testError } = await supabase
        .from('demande')
        .select('id, proprietaire_id, statut')
        .limit(5);
      console.log('🧪 Test simple query result:', { testData, testError });
      
      // Test 2: avec filtre proprietaire seulement
      const { data: testData2, error: testError2 } = await supabase
        .from('demande')
        .select('id, proprietaire_id, statut')
        .eq('proprietaire_id', proprietaireId)
        .limit(5);
      console.log('🧪 Test with proprietaire filter:', { testData2, testError2 });

      const { data: demandesAcceptees, error: demandesError } = await supabase
        .from('demande')
        .select(`propriete_id, gestionnaire_id, "créé_le"`)
        .eq('proprietaire_id', proprietaireId)
        .eq('statut', 'acceptee');

      console.log('🔍 Demandes acceptées trouvées:', { demandesAcceptees, demandesError });
      console.log('🔍 Query params were:', { proprietaire_id: proprietaireId, statut: 'acceptee' });

      // Récupérer les profils gestionnaires pour les demandes trouvées
      let profilsGestionnaires: { utilisateur_id: string; nom_agence: string }[] = [];
      if (demandesAcceptees && demandesAcceptees.length > 0) {
        // Filtrer les demandes qui ont un propriete_id valide
        const demandesValides = demandesAcceptees.filter(d => d.propriete_id !== null);
        console.log('🔍 Demandes valides (avec propriete_id):', demandesValides);
        
        const gestionnaireIds = [...new Set(demandesValides.map(d => d.gestionnaire_id))];
        console.log('👥 Gestionnaire IDs à chercher:', gestionnaireIds);
        
        const { data: profilsData, error: profilsError } = await supabase
          .from('profil_gestionnaire')
          .select('utilisateur_id, nom_agence')
          .in('utilisateur_id', gestionnaireIds);
        
        console.log('👥 Profils gestionnaires trouvés:', { profilsData, profilsError });
        profilsGestionnaires = profilsData || [];
      }

      // Créer un map des demandes par propriété pour un accès rapide
      const demandesMap = new Map();
      const gestionnaireProfilsMap = new Map();
      
      // Map des profils gestionnaires par utilisateur_id
      profilsGestionnaires.forEach(profil => {
        gestionnaireProfilsMap.set(profil.utilisateur_id, profil);
      });
      
      if (demandesAcceptees) {
        // Ne traiter que les demandes avec un propriete_id valide
        demandesAcceptees.filter(d => d.propriete_id !== null).forEach(demande => {
          const profilGestionnaire = gestionnaireProfilsMap.get(demande.gestionnaire_id);
          demandesMap.set(demande.propriete_id, {
            ...demande,
            nom_agence: profilGestionnaire?.nom_agence || 'Agence inconnue'
          });
        });
      }

      // Appliquer les informations de gestion à chaque propriété
      const proprietesAvecGestion: ProprieteAvecGestion[] = proprietesData.map(propriete => {
        const demande = demandesMap.get(propriete.id);
        
        console.log('📋 Processing propriete:', {
          id: propriete.id,
          adresse: propriete.adresse,
          hasDemande: !!demande,
          demande: demande,
          nom_agence: demande?.nom_agence
        });

        return {
          ...propriete,
          gestion: demande ? {
            en_gestion: true,
            nom_agence: demande.nom_agence,
            gestionnaire_id: demande.gestionnaire_id,
            date_debut_gestion: demande["créé_le"]
          } : {
            en_gestion: false
          }
        };
      });

      console.log('🏁 Final result with all proprietes:', proprietesAvecGestion.map(p => ({
        id: p.id,
        adresse: p.adresse,
        en_gestion: p.gestion?.en_gestion || false,
        nom_agence: p.gestion?.nom_agence
      })));

      setProprietes(proprietesAvecGestion);
      setTotalCount(count || 0);

    } catch (err) {
      console.error('Erreur lors de la récupération des propriétés:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProprietes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [proprietaireId, filtres, recherche, page, limit]);

  const ajouterPropriete = useCallback(async (propriete: NouvelleProprieteForme): Promise<boolean> => {
    if (!proprietaireId) {
      setError('ID propriétaire manquant');
      return false;
    }

    try {
      setError(null);

      const nouvellePropriet = {
        ...propriete,
        proprietaire_id: proprietaireId,
        photos: [],
        documents: []
      };

      const { data, error: insertError } = await supabase
        .from('propriete')
        .insert([nouvellePropriet])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Actualiser la liste
      await fetchProprietes();
      return true;

    } catch (err) {
      console.error('Erreur lors de l\'ajout de la propriété:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      return false;
    }
  }, [proprietaireId, fetchProprietes]);

  const modifierPropriete = useCallback(async (id: string, propriete: Partial<NouvelleProprieteForme>): Promise<boolean> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('propriete')
        .update(propriete)
        .eq('id', id)
        .eq('proprietaire_id', proprietaireId);

      if (updateError) {
        throw updateError;
      }

      // Actualiser la liste
      await fetchProprietes();
      return true;

    } catch (err) {
      console.error('Erreur lors de la modification de la propriété:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return false;
    }
  }, [proprietaireId, fetchProprietes]);

  const supprimerPropriete = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('propriete')
        .delete()
        .eq('id', id)
        .eq('proprietaire_id', proprietaireId);

      if (deleteError) {
        throw deleteError;
      }

      // Actualiser la liste
      await fetchProprietes();
      return true;

    } catch (err) {
      console.error('Erreur lors de la suppression de la propriété:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  }, [proprietaireId, fetchProprietes]);

  // Effet pour charger les données
  useEffect(() => {
    fetchProprietes();
  }, [fetchProprietes]);

  return {
    proprietes,
    loading,
    error,
    totalCount,
    ajouterPropriete,
    modifierPropriete,
    supprimerPropriete,
    refetch: fetchProprietes
  };
} 