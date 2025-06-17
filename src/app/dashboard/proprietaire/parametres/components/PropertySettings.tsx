import { House } from '@phosphor-icons/react';

interface PropertySettingsProps {
  settings: {
    default_rental_period: number;
    maintenance_threshold: number;
  };
  onChange: (settings: {
    default_rental_period: number;
    maintenance_threshold: number;
  }) => void;
}

export default function PropertySettings({ settings, onChange }: PropertySettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Paramètres des propriétés</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée de location par défaut (mois)
          </label>
          <input
            type="number"
            value={settings.default_rental_period}
            onChange={(e) => onChange({
              ...settings,
              default_rental_period: parseInt(e.target.value)
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="36"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seuil de maintenance (€)
          </label>
          <div className="relative">
            <input
              type="number"
              value={settings.maintenance_threshold}
              onChange={(e) => onChange({
                ...settings,
                maintenance_threshold: parseInt(e.target.value)
              })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              min="0"
            />
            <span className="absolute left-3 top-2 text-gray-500">€</span>
          </div>
        </div>
      </div>
    </div>
  );
} 