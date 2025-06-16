import { requireAuth } from '@/lib/auth-server';
import DashboardLayout from '@/components/navigation/DashboardLayout';

/**
 * Layout Dashboard Propriétaire avec authentification côté serveur
 */
export default async function ProprietaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentification côté serveur avec redirection automatique
  const user = await requireAuth('proprietaire');

  return (
    <DashboardLayout userProfile={user}>
      {children}
    </DashboardLayout>
  );
}