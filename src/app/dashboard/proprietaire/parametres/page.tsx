'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Bell,
  House,
  FileText,
  CurrencyEur,
  CheckCircle,
  XCircle,
  Spinner
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import NotificationSettings from './components/NotificationSettings';
import PropertySettings from './components/PropertySettings';
import DocumentSettings from './components/DocumentSettings';
import FinancialSettings from './components/FinancialSettings';

interface Settings {
  notifications: {
    new_tenant_requests: boolean;
    maintenance_alerts: boolean;
    payment_reminders: boolean;
  };
  properties: {
    default_rental_period: number;
    maintenance_threshold: number;
  };
  documents: {
    document_expiry_notification: number;
  };
  financial: {
    preferred_payment_method: string;
    currency: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      new_tenant_requests: true,
      maintenance_alerts: true,
      payment_reminders: true
    },
    properties: {
      default_rental_period: 12,
      maintenance_threshold: 500
    },
    documents: {
      document_expiry_notification: 30
    },
    financial: {
      preferred_payment_method: 'bank_transfer',
      currency: 'EUR'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Charger les paramètres de notification
      const { data: notificationData, error: notificationError } = await supabase
        .from('parametres_notification')
        .select('*')
        .eq('utilisateur_id', user.id)
        .maybeSingle();

      if (notificationError && notificationError.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres de notification:', notificationError);
      }

      // Charger les paramètres de propriété
      const { data: propertyData, error: propertyError } = await supabase
        .from('parametres_propriete')
        .select('*')
        .eq('utilisateur_id', user.id)
        .maybeSingle();

      if (propertyError && propertyError.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres de propriété:', propertyError);
      }

      // Charger les paramètres de document
      const { data: documentData, error: documentError } = await supabase
        .from('parametres_document')
        .select('*')
        .eq('utilisateur_id', user.id)
        .maybeSingle();

      if (documentError && documentError.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres de document:', documentError);
      }

      // Charger les paramètres financiers
      const { data: financialData, error: financialError } = await supabase
        .from('parametres_financier')
        .select('*')
        .eq('utilisateur_id', user.id)
        .maybeSingle();

      if (financialError && financialError.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres financiers:', financialError);
      }

      // Mettre à jour les paramètres avec les valeurs par défaut si nécessaire
      setSettings({
        notifications: {
          new_tenant_requests: notificationData?.new_tenant_requests ?? true,
          maintenance_alerts: notificationData?.maintenance_alerts ?? true,
          payment_reminders: notificationData?.payment_reminders ?? true
        },
        properties: {
          default_rental_period: propertyData?.default_rental_period ?? 12,
          maintenance_threshold: propertyData?.maintenance_threshold ?? 500
        },
        documents: {
          document_expiry_notification: documentData?.document_expiry_notification ?? 30
        },
        financial: {
          preferred_payment_method: financialData?.preferred_payment_method ?? 'bank_transfer',
          currency: financialData?.currency ?? 'EUR'
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Sauvegarder les paramètres de notification
      const { error: notificationError } = await supabase
        .from('parametres_notification')
        .upsert({
          utilisateur_id: user.id,
          new_tenant_requests: settings.notifications.new_tenant_requests,
          maintenance_alerts: settings.notifications.maintenance_alerts,
          payment_reminders: settings.notifications.payment_reminders,
          updated_at: new Date().toISOString()
        });

      if (notificationError) {
        throw new Error('Erreur lors de la sauvegarde des paramètres de notification');
      }

      // Sauvegarder les paramètres de propriété
      const { error: propertyError } = await supabase
        .from('parametres_propriete')
        .upsert({
          utilisateur_id: user.id,
          default_rental_period: settings.properties.default_rental_period,
          maintenance_threshold: settings.properties.maintenance_threshold,
          updated_at: new Date().toISOString()
        });

      if (propertyError) {
        throw new Error('Erreur lors de la sauvegarde des paramètres de propriété');
      }

      // Sauvegarder les paramètres de document
      const { error: documentError } = await supabase
        .from('parametres_document')
        .upsert({
          utilisateur_id: user.id,
          document_expiry_notification: settings.documents.document_expiry_notification,
          updated_at: new Date().toISOString()
        });

      if (documentError) {
        throw new Error('Erreur lors de la sauvegarde des paramètres de document');
      }

      // Sauvegarder les paramètres financiers
      const { error: financialError } = await supabase
        .from('parametres_financier')
        .upsert({
          utilisateur_id: user.id,
          preferred_payment_method: settings.financial.preferred_payment_method,
          currency: settings.financial.currency,
          updated_at: new Date().toISOString()
        });

      if (financialError) {
        throw new Error('Erreur lors de la sauvegarde des paramètres financiers');
      }

      setSaveStatus('success');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Spinner className="w-5 h-5 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      {saveStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          Les modifications ont été enregistrées avec succès
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <XCircle className="w-5 h-5" />
          Une erreur est survenue lors de l'enregistrement des modifications
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'properties'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <House className="w-5 h-5" />
              Propriétés
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'documents'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'financial'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CurrencyEur className="w-5 h-5" />
              Financier
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <NotificationSettings
              settings={settings.notifications}
              onChange={(newSettings) => setSettings(prev => ({
                ...prev,
                notifications: newSettings
              }))}
            />
          )}

          {activeTab === 'properties' && (
            <PropertySettings
              settings={settings.properties}
              onChange={(newSettings) => setSettings(prev => ({
                ...prev,
                properties: newSettings
              }))}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentSettings
              settings={settings.documents}
              onChange={(newSettings) => setSettings(prev => ({
                ...prev,
                documents: newSettings
              }))}
            />
          )}

          {activeTab === 'financial' && (
            <FinancialSettings
              settings={settings.financial}
              onChange={(newSettings) => setSettings(prev => ({
                ...prev,
                financial: newSettings
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
} 