'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/navigation/DashboardLayout';
import MessageCenter from '@/components/messaging/MessageCenter';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  rôle: string;
}

/**
 * Page principale des messages dans le dashboard
 */
export default function MessagesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          router.push('/login');
          return;
        }
        
        // Récupérer le profil utilisateur depuis la table utilisateurs
        const { data: userData } = await supabase
          .from('utilisateurs')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (userData) {
          setUser({
            id: userData.id,
            nom: userData.nom,
            email: userData.email,
            rôle: userData.rôle
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router]);

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
      subtitle={`Gérez vos conversations avec les ${user.rôle === 'proprietaire' ? 'gestionnaires' : 'propriétaires'}`}
    >
      <div className="h-full p-6">
        <MessageCenter 
          userId={user.id} 
          userRole={user.rôle as 'proprietaire' | 'gestionnaire'} 
        />
      </div>
    </DashboardLayout>
  );
} 