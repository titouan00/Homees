import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

interface GestionnaireStats {
  biens: number;
  demandes: number;
  revenus: number;
  note: number;
  nbAvis: number;
  loading: boolean;
}

export function useGestionnaireStats(gestionnaireId: string | null) {
  const [stats, setStats] = useState<GestionnaireStats>({
    biens: 0,
    demandes: 0,
    revenus: 0,
    note: 0,
    nbAvis: 0,
    loading: true,
  });

  useEffect(() => {
    if (!gestionnaireId) return;

    async function fetchStats() {
      setStats((s) => ({ ...s, loading: true }));
      // 1. Biens gérés (propriétés avec une demande acceptée pour ce gestionnaire)
      const { data: biensData } = await supabase
        .from('demande')
        .select('propriete_id')
        .eq('gestionnaire_id', gestionnaireId)
        .eq('statut', 'acceptee');
      const biensIds = biensData ? Array.from(new Set(biensData.map((d: any) => d.propriete_id))) : [];
      const biensCount = biensIds.length;

      // 2. Demandes reçues
      const { count: demandesCount } = await supabase
        .from('demande')
        .select('*', { count: 'exact', head: true })
        .eq('gestionnaire_id', gestionnaireId);

      // 3. Revenus mensuels (somme des loyers des biens gérés * taux gestion locative)
      // a. Récupérer le taux de gestion locative du gestionnaire
      let tauxGestion = 0;
      const { data: profilData } = await supabase
        .from('profil_gestionnaire')
        .select('tarif_gestion_locative')
        .eq('utilisateur_id', gestionnaireId)
        .single();
      if (profilData && profilData.tarif_gestion_locative) {
        tauxGestion = Number(profilData.tarif_gestion_locative);
      }
      // b. Récupérer les loyers des biens gérés
      let totalLoyers = 0;
      if (biensIds.length > 0) {
        const { data: biensInfos } = await supabase
          .from('propriete')
          .select('loyer_indicatif')
          .in('id', biensIds);
        if (biensInfos && biensInfos.length > 0) {
          totalLoyers = biensInfos.reduce((sum: number, b: any) => sum + (Number(b.loyer_indicatif) || 0), 0);
        }
      }
      const revenus = totalLoyers * (tauxGestion / 100);

      // 4. Note moyenne et nombre d'avis
      const { data: avisData } = await supabase
        .from('avis')
        .select('note')
        .eq('gestionnaire_id', gestionnaireId);
      const notes = avisData?.map((a: any) => a.note) || [];
      const noteMoyenne = notes.length ? (notes.reduce((a: number, b: number) => a + b, 0) / notes.length) : 0;

      setStats({
        biens: biensCount,
        demandes: demandesCount || 0,
        revenus,
        note: noteMoyenne,
        nbAvis: notes.length,
        loading: false,
      });
    }

    fetchStats();
  }, [gestionnaireId]);

  return stats;
} 