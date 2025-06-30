'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface DemandeGestionnaire {
  id: string;
  statut: 'ouverte' | 'acceptee' | 'rejetee' | 'terminee';
  message_initial: string;
  created_at: string;
  updated_at: string;
  proprietaire: {
    nom: string;
    email: string;
    telephone?: string;
  };
  bien: {
    adresse: string;
    ville: string;
    type_bien: string;
    surface_m2: number;
    loyer_indicatif: number;
  } | null;
  priorite: 'haute' | 'moyenne' | 'basse';
  derniere_interaction: string;
  notes?: string;
  montant_proposition?: number;
  raison_refus?: string;
  nombre_messages: number;
}

export const useDemandes = (gestionnaireId: string) => {
  const [demandes, setDemandes] = useState<DemandeGestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemandes = useCallback(async () => {
    if (!gestionnaireId) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer les demandes avec les informations liées
      const { data, error } = await supabase
        .from('demande')
        .select(`
          id,
          statut,
          message_initial,
          "créé_le",
          "mis_a_jour_le",
          proprietaire_id,
          propriete_id
        `)
        .eq('gestionnaire_id', gestionnaireId)
        .order('"créé_le"', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setDemandes([]);
        return;
      }

      // Récupérer les informations des propriétaires
      const proprietaireIds = [...new Set(data.map(d => d.proprietaire_id))];
      const { data: proprietaires } = await supabase
        .from('utilisateurs')
        .select('id, nom, email')
        .in('id', proprietaireIds);

      // Récupérer les profils propriétaires pour les téléphones
      const { data: profilesData } = await supabase
        .from('profil_proprietaire')
        .select('utilisateur_id, telephone')
        .in('utilisateur_id', proprietaireIds);

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
      const demandesFormatees: DemandeGestionnaire[] = data.map(demande => {
        const proprietaire = proprietaires?.find(p => p.id === demande.proprietaire_id);
        const proprietaireProfile = profilesData?.find(p => p.utilisateur_id === demande.proprietaire_id);
        const propriete = proprietes.find(p => p.id === demande.propriete_id);

        // Calculer la priorité basée sur l'âge de la demande et le type de bien
        const joursDepuisCreation = Math.floor(
          (new Date().getTime() - new Date(demande["créé_le"]).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        let priorite: 'haute' | 'moyenne' | 'basse' = 'moyenne';
        if (joursDepuisCreation <= 1 || (propriete?.loyer_indicatif && parseFloat(propriete.loyer_indicatif) > 2000)) {
          priorite = 'haute';
        } else if (joursDepuisCreation > 7) {
          priorite = 'basse';
        }

        return {
          id: demande.id,
          statut: demande.statut as 'ouverte' | 'acceptee' | 'rejetee' | 'terminee',
          message_initial: demande.message_initial || '',
          created_at: demande["créé_le"],
          updated_at: demande["mis_a_jour_le"],
          proprietaire: {
            nom: proprietaire?.nom || '',
            email: proprietaire?.email || '',
            telephone: proprietaireProfile?.telephone
          },
          bien: propriete ? {
            adresse: propriete.adresse || '',
            ville: propriete.ville || '',
            type_bien: propriete.type_bien || '',
            surface_m2: propriete.surface_m2 || 0,
            loyer_indicatif: parseFloat(propriete.loyer_indicatif) || 0
          } : null,
          priorite,
          derniere_interaction: demande["mis_a_jour_le"],
          nombre_messages: messageCountByDemande[demande.id] || 0,
          notes: '',
          montant_proposition: undefined,
          raison_refus: undefined
        };
      });

      setDemandes(demandesFormatees);
    } catch (err) {
      console.error('Erreur lors du chargement des demandes:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [gestionnaireId]);

  // Mettre à jour le statut d'une demande
  const updateStatutDemande = useCallback(async (demandeId: string, nouveauStatut: string) => {
    try {
      const { error } = await supabase
        .from('demande')
        .update({ 
          statut: nouveauStatut,
          "mis_a_jour_le": new Date().toISOString()
        })
        .eq('id', demandeId);

      if (error) throw error;

      // Recharger les demandes
      await fetchDemandes();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur inconnue' 
      };
    }
  }, [fetchDemandes]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  return {
    demandes,
    loading,
    error,
    refetch: fetchDemandes,
    updateStatutDemande
  };
}; 