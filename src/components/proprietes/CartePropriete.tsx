'use client';

import { Propriete } from '@/types/propriete';
import { useProprieteMeta, useCaracteristiques, useEquipements } from '@/hooks';
import { 
  CarteHeader, 
  CaracteristiqueItem, 
  EquipementBadge, 
  SectionFinanciere, 
  SectionNotes, 
  CarteFooter 
} from './components';

interface CarteProprieteProps {
  propriete: Propriete;
  onModifier: (propriete: Propriete) => void;
  onSupprimer: (id: string) => void;
}

/**
 * Composant carte pour afficher une propriété - Version refactorisée modulaire
 */
export default function CartePropriete({ propriete, onModifier, onSupprimer }: CarteProprieteProps) {
  // Hooks personnalisés pour extraire la logique
  const { typeBienInfo, dpeClasse, statutInfo, rendementMensuel, formatPrix, formatDate } = useProprieteMeta(propriete);
  const caracteristiques = useCaracteristiques(propriete);
  const equipements = useEquipements(propriete);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 overflow-hidden">
      {/* Header avec badges et actions */}
      <CarteHeader
        propriete={propriete}
        typeBienInfo={typeBienInfo}
        dpeClasse={dpeClasse}
        statutInfo={statutInfo}
        onModifier={onModifier}
        onSupprimer={onSupprimer}
      />

      {/* Corps de la carte */}
      <div className="p-5 space-y-4">
        {/* Caractéristiques principales */}
        {caracteristiques.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {caracteristiques.slice(0, 4).map((carac, index) => (
              <CaracteristiqueItem key={index} caracteristique={carac} />
            ))}
          </div>
        )}

        {/* Équipements disponibles */}
        {equipements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Équipements</h4>
            <div className="flex flex-wrap gap-2">
              {equipements.map((equip, index) => (
                <EquipementBadge key={index} equipement={equip} />
              ))}
            </div>
          </div>
        )}

        {/* Section financière */}
        <SectionFinanciere
          loyerIndicatif={propriete.loyer_indicatif}
          chargesMensuelles={propriete.charges_mensuelles}
          rendementMensuel={rendementMensuel}
          formatPrix={formatPrix}
        />

        {/* Notes si présentes */}
        <SectionNotes notes={propriete.notes} />
      </div>

      {/* Footer avec dates */}
      <CarteFooter
        createdAt={propriete.créé_le}
        updatedAt={propriete.mis_a_jour_le}
        formatDate={formatDate}
      />
    </div>
  );
} 