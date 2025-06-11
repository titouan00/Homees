'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CircleNotch } from 'phosphor-react';

/**
 * Page Dashboard - Redirection automatique
 * Redirige silencieusement selon l'état de connexion et le rôle utilisateur
 */
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/login');
        return;
      }

      // Utilisateur connecté → récupérer son rôle
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('"rôle"')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        router.push('/login');
        return;
      }

      // Redirection selon le rôle
      const userRole = userData.rôle;
      
      switch (userRole) {
        case 'gestionnaire':
          router.push('/dashboard/gestionnaire');
          break;
        case 'proprietaire':
          router.push('/dashboard/proprietaire');
          break;
        case 'admin':
          router.push('/dashboard/gestionnaire');
          break;
        default:
          router.push('/login');
          break;
      }

    } catch (err) {
      router.push('/login');
    }
  };

  // Chargement minimal
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <CircleNotch className="h-8 w-8 text-emerald-600 animate-spin" />
    </div>
  );
} 