'use client';

import DashboardLayout from '@/components/navigation/DashboardLayout';
import MessageCenter from '@/components/messaging/MessageCenter';
import { useAuth } from '@/hooks/useAuth';

/**
 * Page principale des messages dans le dashboard
 */
export default function MessagesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout 
      userProfile={user}
      title="Messages"
      subtitle={`Gérez vos conversations avec les ${user.role === 'proprietaire' ? 'gestionnaires' : 'propriétaires'}`}
    >
      <div className="h-full p-6">
        <MessageCenter 
          userId={user.id} 
          userRole={user.role as 'proprietaire' | 'gestionnaire'} 
        />
      </div>
    </DashboardLayout>
  );
} 