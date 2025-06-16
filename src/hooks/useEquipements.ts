import { useMemo } from 'react';
import { Buildings, Car, Tree, Armchair, Thermometer, Lightning } from '@phosphor-icons/react';
import { Propriete } from '@/types/propriete';

export interface Equipement {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}

/**
 * Hook pour extraire les équipements disponibles d'une propriété
 */
export function useEquipements(propriete: Propriete): Equipement[] {
  return useMemo(() => {
    const tousEquipements: (Equipement | null)[] = [
      propriete.ascenseur ? {
        icon: Buildings,
        label: 'Ascenseur',
        color: 'bg-blue-50 text-blue-700'
      } : null,
      
      propriete.parking ? {
        icon: Car,
        label: 'Parking',
        color: 'bg-purple-50 text-purple-700'
      } : null,
      
      propriete.balcon ? {
        icon: Tree,
        label: 'Balcon',
        color: 'bg-green-50 text-green-700'
      } : null,
      
      propriete.terrasse ? {
        icon: Tree,
        label: 'Terrasse',
        color: 'bg-emerald-50 text-emerald-700'
      } : null,
      
      propriete.meuble ? {
        icon: Armchair,
        label: 'Meublé',
        color: 'bg-orange-50 text-orange-700'
      } : null,
      
      propriete.chauffage_type === 'pompe_chaleur' ? {
        icon: Thermometer,
        label: 'Pompe à chaleur',
        color: 'bg-red-50 text-red-700'
      } : null,
      
      propriete.chauffage_type === 'individuel_electrique' ? {
        icon: Lightning,
        label: 'Électrique',
        color: 'bg-yellow-50 text-yellow-700'
      } : null
    ];

    return tousEquipements.filter((eq): eq is Equipement => eq !== null);
  }, [
    propriete.ascenseur,
    propriete.parking,
    propriete.balcon,
    propriete.terrasse,
    propriete.meuble,
    propriete.chauffage_type
  ]);
} 