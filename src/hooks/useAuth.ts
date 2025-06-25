import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import type { UserProfile } from '@/lib/auth-server';

/**
 * Hook d'authentification centralisé
 * Gère l'état de l'utilisateur et les redirections automatiques
 */
export function useAuth(redirectOnError: boolean = true) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    if (redirectOnError) {
      router.push('/login');
    }
  }, [router, redirectOnError]);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérifier l'utilisateur authentifié
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }

        if (!authUser) {
          handleRedirect();
          return;
        }
        
        // Récupérer le profil utilisateur depuis la table utilisateurs
        const { data: userData, error: userError } = await supabase
          .from('utilisateurs')
          .select('id, nom, email, "rôle"')
          .eq('id', authUser.id)
          .single();
          
        if (userError) {
          throw userError;
        }

        if (!userData) {
          handleRedirect();
          return;
        }

        setUser({
          id: userData.id,
          nom: userData.nom,
          email: userData.email,
          role: userData.rôle as UserProfile['role']
        });

      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        setError(error instanceof Error ? error.message : 'Erreur d\'authentification');
        handleRedirect();
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        handleRedirect();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [handleRedirect]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return {
    user,
    isLoading,
    error,
    logout,
    isAuthenticated: !!user
  };
} 