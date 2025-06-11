import { Equipement } from '@/hooks/useEquipements';

interface EquipementBadgeProps {
  equipement: Equipement;
}

/**
 * Composant pour afficher un badge d'équipement
 */
export function EquipementBadge({ equipement }: EquipementBadgeProps) {
  const Icon = equipement.icon;
  
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${equipement.color}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{equipement.label}</span>
    </div>
  );
} 