import { Caracteristique } from '@/hooks/useCaracteristiques';

interface CaracteristiqueItemProps {
  caracteristique: Caracteristique;
}

/**
 * Composant pour afficher une caractéristique de propriété
 */
export function CaracteristiqueItem({ caracteristique }: CaracteristiqueItemProps) {
  const Icon = caracteristique.icon;
  
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-gray-100 rounded-lg">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{caracteristique.value}</div>
        <div className="text-xs text-gray-500">{caracteristique.label}</div>
      </div>
    </div>
  );
} 