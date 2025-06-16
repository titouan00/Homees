import { MapPin } from '@phosphor-icons/react/dist/ssr';
import { Propriete } from '@/types/propriete';
import Badge from '@/components/ui/Badge';
import { MenuActions } from './MenuActions';

interface CarteHeaderProps {
  propriete: Propriete;
  typeBienInfo?: { value: string; label: string; icon: string };
  dpeClasse?: { value: string; label: string; color: string };
  statutInfo?: { value: string; label: string; color: string };
  onModifier: (propriete: Propriete) => void;
  onSupprimer: (id: string) => void;
}

/**
 * Composant en-tête de carte propriété
 */
export function CarteHeader({ 
  propriete, 
  typeBienInfo, 
  dpeClasse, 
  statutInfo, 
  onModifier, 
  onSupprimer 
}: CarteHeaderProps) {
  return (
    <div className="relative">
      {/* Badge DPE en overlay */}
      {dpeClasse && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="warning" size="sm">
            DPE {dpeClasse.value}
          </Badge>
        </div>
      )}

      {/* Badge statut en overlay */}
      <div className="absolute top-3 right-12 z-10">
        <Badge 
          status={propriete.statut_occupation as any} 
          size="sm"
        >
          {statutInfo?.label}
        </Badge>
      </div>

      {/* Menu actions */}
      <MenuActions 
        propriete={propriete}
        onSupprimer={onSupprimer}
      />

      {/* Header principal */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-5 pb-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{typeBienInfo?.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
              {typeBienInfo?.label}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {propriete.adresse}
                {propriete.ville && `, ${propriete.ville}`}
                {propriete.code_postal && ` (${propriete.code_postal})`}
              </span>
            </div>
            {propriete.arrondissement && (
              <div className="text-xs text-gray-500 mt-0.5">
                {propriete.arrondissement}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 