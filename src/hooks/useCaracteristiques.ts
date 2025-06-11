import { useMemo } from 'react';
import { Ruler, Home, BedDouble, Droplets } from 'lucide-react';
import { Propriete } from '@/types/propriete';

export interface Caracteristique {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  priority: number;
}

/**
 * Hook pour extraire les caractéristiques principales d'une propriété
 */
export function useCaracteristiques(propriete: Propriete): Caracteristique[] {
  return useMemo(() => {
    const caracteristiques: (Caracteristique | null)[] = [
      {
        icon: Ruler,
        label: 'Surface',
        value: propriete.surface_m2 ? `${propriete.surface_m2} m²` : '',
        priority: 1
      },
      {
        icon: Home,
        label: 'Pièces',
        value: propriete.nb_pieces ? `${propriete.nb_pieces} pièces` : '',
        priority: 2
      },
      {
        icon: BedDouble,
        label: 'Chambres',
        value: propriete.nb_chambres ? `${propriete.nb_chambres} ch.` : '',
        priority: 3
      },
      {
        icon: Droplets,
        label: 'SdB',
        value: propriete.nb_salles_bain ? `${propriete.nb_salles_bain} SdB` : '',
        priority: 4
      }
    ];

    // Filtrer seulement celles qui ont une valeur
    return caracteristiques.filter((c): c is Caracteristique => 
      c !== null && c.value !== ''
    );
  }, [propriete.surface_m2, propriete.nb_pieces, propriete.nb_chambres, propriete.nb_salles_bain]);
} 