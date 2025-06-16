import { getCurrentUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

/**
 * Page Dashboard - Redirection automatique côté serveur
 * Redirige silencieusement selon l'état de connexion et le rôle utilisateur
 */
export default async function DashboardRedirect() {
  // Vérifier l'authentification côté serveur
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  // Redirection selon le rôle
  switch (user.role) {
    case 'gestionnaire':
    case 'admin':
      redirect('/dashboard/gestionnaire');
    case 'proprietaire':
      redirect('/dashboard/proprietaire');
    default:
      redirect('/login');
  }

  // Cette ligne ne sera jamais atteinte grâce aux redirections
  return null;
} 