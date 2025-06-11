interface SectionFinanciereProps {
  loyerIndicatif?: number;
  chargesMensuelles?: number;
  rendementMensuel?: number | null;
  formatPrix: (prix: number | undefined) => string;
}

/**
 * Composant pour afficher les informations financières
 */
export function SectionFinanciere({ 
  loyerIndicatif, 
  chargesMensuelles, 
  rendementMensuel, 
  formatPrix 
}: SectionFinanciereProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-2xl font-bold text-emerald-600">
            {formatPrix(loyerIndicatif)}
          </div>
          <div className="text-xs text-gray-500">
            /mois {chargesMensuelles && `+ ${formatPrix(chargesMensuelles)} charges`}
          </div>
        </div>
        {rendementMensuel && (
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {rendementMensuel}€/m²
            </div>
            <div className="text-xs text-gray-500">par mois</div>
          </div>
        )}
      </div>
    </div>
  );
} 