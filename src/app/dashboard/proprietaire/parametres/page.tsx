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

interface Settings {
  notifications: {
    new_tenant_requests: boolean;
    maintenance_alerts: boolean;
    payment_reminders: boolean;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      new_tenant_requests: true,
      maintenance_alerts: true,
      payment_reminders: true
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
      // Charger uniquement les paramètres de notification
      const { data: notificationData, error: notificationError } = await supabase
        .from('parametres_notification')
        .select('*')
        .eq('utilisateur_id', user.id)
        .maybeSingle();
      if (notificationError && notificationError.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres de notification:', notificationError);
      }
      setSettings({
        notifications: {
          new_tenant_requests: notificationData?.new_tenant_requests ?? true,
          maintenance_alerts: notificationData?.maintenance_alerts ?? true,
          payment_reminders: notificationData?.payment_reminders ?? true
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
      // Sauvegarder uniquement les paramètres de notification
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
      setSaveStatus('success');
    } catch (error) {
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <NotificationSettings
          settings={settings.notifications}
          onChange={(notif) => setSettings((prev) => ({ ...prev, notifications: notif }))}
        />
        <div className="mt-8 flex justify-end gap-4">
          {saveStatus === 'success' && (
            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-5 w-5" /> Sauvegardé !</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600 flex items-center gap-1"><XCircle className="h-5 w-5" /> Erreur lors de la sauvegarde</span>
          )}
          <Button onClick={handleSave} loading={isSaving}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
} 