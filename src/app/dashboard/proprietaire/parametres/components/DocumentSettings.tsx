import { FileText } from '@phosphor-icons/react';

interface DocumentSettingsProps {
  settings: {
    document_expiry_notification: number;
  };
  onChange: (settings: {
    document_expiry_notification: number;
  }) => void;
}

export default function DocumentSettings({ settings, onChange }: DocumentSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Paramètres des documents</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Délai de notification d'expiration (jours)
        </label>
        <input
          type="number"
          value={settings.document_expiry_notification}
          onChange={(e) => onChange({
            document_expiry_notification: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          min="1"
          max="90"
        />
      </div>
    </div>
  );
} 