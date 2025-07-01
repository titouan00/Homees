'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import MessageCenter from '@/components/messaging/MessageCenter';

/**
 * Page Messages Gestionnaire
 * L'authentification est gérée par le layout.tsx
 */
export default function MessagesGestionnaire() {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserId();
  }, []);

  if (loading) {
  return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <MessageCenter 
        userId={userId}
        userRole="gestionnaire"
                      />
    </div>
  );
}