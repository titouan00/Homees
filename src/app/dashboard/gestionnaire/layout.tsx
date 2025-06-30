import { requireAuth } from '@/lib/auth-server';
import GestionnaireDashboardLayout from '@/components/navigation/GestionnaireDashboardLayout';

/**
 * Layout Dashboard Gestionnaire avec authentification côté serveur
 */
export default async function GestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentification côté serveur avec redirection automatique
  const user = await requireAuth('gestionnaire');

  return (
    <GestionnaireDashboardLayout userProfile={user}>
      {children}
    </GestionnaireDashboardLayout>
  );
} 