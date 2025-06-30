'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface DemandeWithDetails {
  id: string;
  statut: 'ouverte' | 'acceptee' | 'rejetee' | 'terminee';
  message_initial: string;
  créé_le: string;
  mis_a_jour_le: string;
  proprietaire: {
    nom: string;
    email: string;
    telephone?: string;
  };
  gestionnaire: {
    id: string;
    nom: string;
    email: string;
    nom_agence?: string;
  } | null;
  propriete: {
    id: string;
    adresse: string;
    ville: string;
    type_bien: string;
    surface_m2: number;
    loyer_indicatif: number;
  } | null;
  nombre_messages: number;
}

import { FiltresDemandes } from '@/types/messaging';

interface SearchParams {
  proprietaireId?: string;
  filtres: FiltresDemandes;
  recherche?: string;
  page: number;
  limit: number;
}

export const useDemandesProprietaire = (searchParams: SearchParams) => {
  const [demandes, setDemandes] = useState<DemandeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDemandes = useCallback(async () => {
    if (!searchParams.proprietaireId) {
      setDemandes([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Construction de la requête de base
      let query = supabase
        .from('demande')
        .select(`
          id,
          statut,
          message_initial,
          "créé_le",
          "mis_a_jour_le",
          gestionnaire_id,
          propriete_id
        `)
        .eq('proprietaire_id', searchParams.proprietaireId);

      // Appliquer les filtres
      if (searchParams.filtres.statut && searchParams.filtres.statut.length > 0) {
        query = query.in('statut', searchParams.filtres.statut);
      }

      // Appliquer le tri
      const triColonne = searchParams.filtres.tri_par === 'date' ? '"créé_le"' : 
                        searchParams.filtres.tri_par === 'statut' ? 'statut' : '"créé_le"';
      
      query = query.order(triColonne, { ascending: searchParams.filtres.ordre === 'asc' });

      // Compter le total d'abord
      let countQuery = supabase
        .from('demande')
        .select('*', { count: 'exact', head: true })
        .eq('proprietaire_id', searchParams.proprietaireId);

      // Appliquer les mêmes filtres pour le comptage
      if (searchParams.filtres.statut && searchParams.filtres.statut.length > 0) {
        countQuery = countQuery.in('statut', searchParams.filtres.statut);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Appliquer la pagination
      const offset = (searchParams.page - 1) * searchParams.limit;
      query = query.range(offset, offset + searchParams.limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        setDemandes([]);
        return;
      }

      // Récupérer les informations des gestionnaires
      const gestionnaireIds = [...new Set(data.map(d => d.gestionnaire_id).filter(Boolean))];
      let gestionnaires: any[] = [];
      let profilesGestionnaires: any[] = [];
      
      if (gestionnaireIds.length > 0) {
        const { data: gestionnairesData } = await supabase
          .from('utilisateurs')
          .select('id, nom, email')
          .in('id', gestionnaireIds);
        gestionnaires = gestionnairesData || [];

        const { data: profilesData } = await supabase
          .from('profil_gestionnaire')
          .select('utilisateur_id, nom_agence')
          .in('utilisateur_id', gestionnaireIds);
        profilesGestionnaires = profilesData || [];
      }

      // Récupérer les informations des propriétés
      const proprieteIds = data.map(d => d.propriete_id).filter(Boolean);
      let proprietes: any[] = [];
      if (proprieteIds.length > 0) {
        const { data: proprietesData } = await supabase
          .from('propriete')
          .select('id, adresse, ville, type_bien, surface_m2, loyer_indicatif')
          .in('id', proprieteIds);
        proprietes = proprietesData || [];
      }

      // Récupérer les informations du propriétaire
      const { data: proprietaireData } = await supabase
        .from('utilisateurs')
        .select('id, nom, email')
        .eq('id', searchParams.proprietaireId)
        .single();

      const { data: proprietaireProfile } = await supabase
        .from('profil_proprietaire')
        .select('telephone')
        .eq('utilisateur_id', searchParams.proprietaireId)
        .single();

      // Compter les messages pour chaque demande
      const { data: messagesCount } = await supabase
        .from('message')
        .select('demande_id')
        .in('demande_id', data.map(d => d.id));

      const messageCountByDemande = messagesCount?.reduce((acc: any, msg) => {
        acc[msg.demande_id] = (acc[msg.demande_id] || 0) + 1;
        return acc;
      }, {}) || {};

      // Transformer les données
      const demandesFormatees: DemandeWithDetails[] = data.map(demande => {
        const gestionnaire = gestionnaires.find(g => g.id === demande.gestionnaire_id);
        const profileGestionnaire = profilesGestionnaires.find(p => p.utilisateur_id === demande.gestionnaire_id);
        const propriete = proprietes.find(p => p.id === demande.propriete_id);

        return {
          id: demande.id,
          statut: demande.statut as 'ouverte' | 'acceptee' | 'rejetee' | 'terminee',
          message_initial: demande.message_initial || '',
          créé_le: demande["créé_le"],
          mis_a_jour_le: demande["mis_a_jour_le"],
          proprietaire: {
            nom: proprietaireData?.nom || '',
            email: proprietaireData?.email || '',
            telephone: proprietaireProfile?.telephone
          },
          gestionnaire: gestionnaire ? {
            id: gestionnaire.id,
            nom: profileGestionnaire?.nom_agence || gestionnaire.nom,
            email: gestionnaire.email,
            nom_agence: profileGestionnaire?.nom_agence
          } : null,
          propriete: propriete ? {
            id: propriete.id,
            adresse: propriete.adresse || '',
            ville: propriete.ville || '',
            type_bien: propriete.type_bien || '',
            surface_m2: propriete.surface_m2 || 0,
            loyer_indicatif: parseFloat(propriete.loyer_indicatif) || 0
          } : null,
          nombre_messages: messageCountByDemande[demande.id] || 0
        };
      });

      setDemandes(demandesFormatees);
    } catch (err) {
      console.error('Erreur lors du chargement des demandes proprietaire:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  return {
    demandes,
    loading,
    error,
    totalCount,
    refetch: fetchDemandes
  };
}; 