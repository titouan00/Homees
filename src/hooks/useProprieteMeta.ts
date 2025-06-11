import { useMemo } from 'react';
import { Propriete, TYPES_BIEN, DPE_CLASSES, STATUTS_OCCUPATION } from '@/types/propriete';

/**
 * Hook pour extraire et calculer les métadonnées d'une propriété
 */
export function useProprieteMeta(propriete: Propriete) {
  return useMemo(() => {
    const typeBienInfo = TYPES_BIEN.find(t => t.value === propriete.type_bien);
    const dpeClasse = DPE_CLASSES.find(d => d.value === propriete.dpe_classe);
    const statutInfo = STATUTS_OCCUPATION.find(s => s.value === propriete.statut_occupation);

    // Calculer le rendement au m² si données disponibles
    const rendementMensuel = propriete.loyer_indicatif && propriete.surface_m2 
      ? Math.round(propriete.loyer_indicatif / propriete.surface_m2)
      : null;

    // Formatters réutilisables
    const formatPrix = (prix: number | undefined) => {
      if (!prix) return 'Non renseigné';
      return `${prix.toLocaleString()}€`;
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('fr-FR');
    };

    return {
      typeBienInfo,
      dpeClasse,
      statutInfo,
      rendementMensuel,
      formatPrix,
      formatDate
    };
  }, [propriete]);
} 