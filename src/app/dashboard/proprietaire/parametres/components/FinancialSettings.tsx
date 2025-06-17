import { CurrencyEur } from '@phosphor-icons/react';

interface FinancialSettingsProps {
  settings: {
    preferred_payment_method: string;
    currency: string;
  };
  onChange: (settings: {
    preferred_payment_method: string;
    currency: string;
  }) => void;
}

export default function FinancialSettings({ settings, onChange }: FinancialSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Paramètres financiers</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de paiement préférée
          </label>
          <select
            value={settings.preferred_payment_method}
            onChange={(e) => onChange({
              ...settings,
              preferred_payment_method: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="bank_transfer">Virement bancaire</option>
            <option value="check">Chèque</option>
            <option value="cash">Espèces</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise
          </label>
          <select
            value={settings.currency}
            onChange={(e) => onChange({
              ...settings,
              currency: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar américain ($)</option>
            <option value="GBP">Livre sterling (£)</option>
          </select>
        </div>
      </div>
    </div>
  );
} 