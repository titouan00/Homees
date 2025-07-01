'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface BienEnGestion {
  id: string;
  adresse: string;
  ville: string;
  type_bien: string;
  surface_m2: number;
  loyer_indicatif: number;
  statut_occupation: 'libre' | 'occupe' | 'en_travaux' | null;
  nb_pieces?: number;
  nb_chambres?: number;
  etage?: number;
  balcon?: boolean;
  parking?: boolean;
  charges_mensuelles?: number;
  proprietaire: {
    nom: string;
    email: string;
    telephone?: string;
  };
  contrat?: {
    montant: number;
    date_debut: string;
  };
  demande: {
    statut: string;
    date_creation: string;
  };
  rentabilite?: number;
  taux_occupation?: number;
  prochaine_echeance?: string;
  created_at: string;
  supprime?: boolean;
  date_suppression?: string;
  notes_gestion?: string;
  revenue_mensuel_custom?: number;
}

interface StatistiquesGestion {
  total_biens: number;
  biens_occupes: number;
  biens_libres: number;
  biens_travaux: number;
  revenus_mensuels: number;
  taux_occupation_global: number;
  rentabilite_moyenne: number;
}

export const useBiensEnGestion = (gestionnaireId: string) => {
  const [biens, setBiens] = useState<BienEnGestion[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesGestion>({
    total_biens: 0,
    biens_occupes: 0,
    biens_libres: 0,
    biens_travaux: 0,
    revenus_mensuels: 0,
    taux_occupation_global: 0,
    rentabilite_moyenne: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBiensEnGestion = useCallback(async () => {
    if (!gestionnaireId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Récupérer les biens en gestion via les demandes acceptées
      const { data: demandesData, error: demandesError } = await supabase
        .from('demande')
        .select(`
          id,
          statut,
          "créé_le",
          propriete:propriete_id (
            id,
            adresse,
            ville,
            type_bien,
            surface_m2,
            loyer_indicatif,
            statut_occupation,
            nb_pieces,
            nb_chambres,
            etage,
            balcon,
            parking,
            charges_mensuelles,
            "créé_le"
          ),
          proprietaire:proprietaire_id (
            nom,
            email
          )
        `)
        .eq('gestionnaire_id', gestionnaireId)
        .eq('statut', 'acceptee')
        .not('propriete_id', 'is', null);

      if (demandesError) {
        console.error('Erreur requête demandes:', demandesError);
        throw demandesError;
      }

      if (!demandesData || demandesData.length === 0) {
        console.log('Aucun bien en gestion trouvé pour le gestionnaire:', gestionnaireId);
        setBiens([]);
        setStatistiques({
          total_biens: 0,
          biens_occupes: 0,
          biens_libres: 0,
          biens_travaux: 0,
          revenus_mensuels: 0,
          taux_occupation_global: 0,
          rentabilite_moyenne: 0
        });
        return;
      }

      // Récupérer les téléphones des propriétaires
      const proprietaireIds = demandesData.map(d => (d.proprietaire as any)?.id).filter(Boolean);
      const { data: profilsData } = await supabase
        .from('profil_proprietaire')
        .select('utilisateur_id, telephone')
        .in('utilisateur_id', proprietaireIds);

      // Créer un map des téléphones par utilisateur
      const telephoneMap = new Map(
        profilsData?.map(p => [p.utilisateur_id, p.telephone]) || []
      );

      // Transformer les données en format BienEnGestion
      const biensTransformes: BienEnGestion[] = demandesData
        .filter(demande => demande.propriete) // S'assurer que la propriété existe
        .map(demande => {
          const propriete = demande.propriete as any;
          const proprietaire = demande.proprietaire as any;
          
          const bien = {
            id: propriete.id,
            adresse: propriete.adresse,
            ville: propriete.ville || '',
            type_bien: propriete.type_bien,
            surface_m2: propriete.surface_m2 || 0,
            loyer_indicatif: Number(propriete.loyer_indicatif) || 0,
            statut_occupation: propriete.statut_occupation,
            nb_pieces: propriete.nb_pieces,
            nb_chambres: propriete.nb_chambres,
            etage: propriete.etage,
            balcon: propriete.balcon || false,
            parking: propriete.parking || false,
            charges_mensuelles: Number(propriete.charges_mensuelles) || 0,
            proprietaire: {
              nom: proprietaire?.nom || 'Propriétaire inconnu',
              email: proprietaire?.email || '',
              telephone: telephoneMap.get(proprietaire?.id) || undefined
            },
            demande: {
              statut: demande.statut,
              date_creation: demande["créé_le"] || ''
            },
            // Calculer la rentabilité (exemple simple)
            rentabilite: propriete.loyer_indicatif ? 
              Math.round(((Number(propriete.loyer_indicatif) * 12) / (Number(propriete.loyer_indicatif) * 12 * 20)) * 100 * 10) / 10 : 0,
            taux_occupation: propriete.statut_occupation === 'occupe' ? 100 : 0,
            created_at: propriete["créé_le"] || '',
            supprime: false,
            date_suppression: undefined,
            notes_gestion: '',
            revenue_mensuel_custom: 0
          };

          // Appliquer les modifications localStorage
          const bienModifications = JSON.parse(localStorage.getItem('bienModifications') || '{}');
          const modifications = bienModifications[bien.id];
          if (modifications) {
            Object.assign(bien, modifications);
          }

          return bien;
        });

      setBiens(biensTransformes);

      // Calculer les statistiques (exclure les biens supprimés)
      const biensActifs = biensTransformes.filter(b => !b.supprime);
      const stats: StatistiquesGestion = {
        total_biens: biensActifs.length,
        biens_occupes: biensActifs.filter(b => b.statut_occupation === 'occupe').length,
        biens_libres: biensActifs.filter(b => b.statut_occupation === 'libre').length,
        biens_travaux: biensActifs.filter(b => b.statut_occupation === 'en_travaux').length,
        revenus_mensuels: biensActifs.reduce((sum, b) => {
          // Utiliser le revenu personnalisé s'il existe, sinon le loyer indicatif
          const revenu = b.revenue_mensuel_custom && b.revenue_mensuel_custom > 0 
            ? b.revenue_mensuel_custom 
            : (b.loyer_indicatif || 0);
          return sum + revenu;
        }, 0),
        taux_occupation_global: biensActifs.length > 0 ? 
          Math.round((biensActifs.filter(b => b.statut_occupation === 'occupe').length / biensActifs.length) * 100 * 10) / 10 : 0,
        rentabilite_moyenne: biensActifs.length > 0 ?
          Math.round((biensActifs.reduce((sum, b) => sum + (b.rentabilite || 0), 0) / biensActifs.length) * 10) / 10 : 0
      };

      setStatistiques(stats);

      console.log(`✅ Chargé ${biensTransformes.length} biens en gestion pour le gestionnaire`);

    } catch (err) {
      console.error('Erreur lors du chargement des biens en gestion:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // En cas d'erreur, utiliser des données par défaut
      setBiens([]);
      setStatistiques({
        total_biens: 0,
        biens_occupes: 0,
        biens_libres: 0,
        biens_travaux: 0,
        revenus_mensuels: 0,
        taux_occupation_global: 0,
        rentabilite_moyenne: 0
      });
    } finally {
      setLoading(false);
    }
  }, [gestionnaireId]);

  useEffect(() => {
    if (gestionnaireId) {
      fetchBiensEnGestion();
    }
  }, [fetchBiensEnGestion, gestionnaireId]);

  const refreshBiens = () => {
    fetchBiensEnGestion();
  };

  // Fonction pour modifier un bien
  const modifierBien = async (bienId: string, modifications: Partial<BienEnGestion>) => {
    try {
      // Mettre à jour localement d'abord
      setBiens(prev => prev.map(bien => 
        bien.id === bienId ? { ...bien, ...modifications } : bien
      ));

      // Ici on pourrait ajouter une vraie mise à jour en base de données
      // Pour l'instant, on stocke en localStorage comme cache local
      const bienModifications = JSON.parse(localStorage.getItem('bienModifications') || '{}');
      bienModifications[bienId] = { ...bienModifications[bienId], ...modifications };
      localStorage.setItem('bienModifications', JSON.stringify(bienModifications));

      console.log('✅ Bien modifié avec succès:', bienId, modifications);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la modification du bien:', error);
      // Recharger les données en cas d'erreur
      fetchBiensEnGestion();
      return false;
    }
  };

  // Fonction pour supprimer un bien (soft delete)
  const supprimerBien = async (bienId: string) => {
    try {
      const dateSuppression = new Date().toISOString();
      
      // Mettre à jour localement
      setBiens(prev => prev.map(bien => 
        bien.id === bienId ? { 
          ...bien, 
          supprime: true, 
          date_suppression: dateSuppression 
        } : bien
      ));

      // Stocker en localStorage
      const bienModifications = JSON.parse(localStorage.getItem('bienModifications') || '{}');
      bienModifications[bienId] = { 
        ...bienModifications[bienId], 
        supprime: true, 
        date_suppression: dateSuppression 
      };
      localStorage.setItem('bienModifications', JSON.stringify(bienModifications));

      console.log('✅ Bien supprimé avec succès:', bienId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du bien:', error);
      fetchBiensEnGestion();
      return false;
    }
  };

  // Fonction pour restaurer un bien supprimé
  const restaurerBien = async (bienId: string) => {
    try {
      // Mettre à jour localement
      setBiens(prev => prev.map(bien => 
        bien.id === bienId ? { 
          ...bien, 
          supprime: false, 
          date_suppression: undefined 
        } : bien
      ));

      // Stocker en localStorage
      const bienModifications = JSON.parse(localStorage.getItem('bienModifications') || '{}');
      bienModifications[bienId] = { 
        ...bienModifications[bienId], 
        supprime: false, 
        date_suppression: undefined 
      };
      localStorage.setItem('bienModifications', JSON.stringify(bienModifications));

      console.log('✅ Bien restauré avec succès:', bienId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la restauration du bien:', error);
      fetchBiensEnGestion();
      return false;
    }
  };

  return {
    biens,
    statistiques,
    loading,
    error,
    refreshBiens,
    modifierBien,
    supprimerBien,
    restaurerBien
  };
}; 