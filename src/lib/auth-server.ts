import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export interface UserProfile {
  id: string;
  nom: string;
  email: string;
  role: 'proprietaire' | 'gestionnaire' | 'admin';
}

/**
 * Crée un client Supabase pour les Server Components
 */
async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Les cookies ne peuvent pas être définis dans les Server Components
            // C'est normal pour les opérations de lecture
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Les cookies ne peuvent pas être supprimés dans les Server Components
            // C'est normal pour les opérations de lecture
          }
        },
      },
    }
  );
}

/**
 * Récupère l'utilisateur actuel côté serveur
 * Retourne null si non connecté
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Vérifier l'utilisateur authentifié (plus sécurisé que getSession)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    // Récupérer les données utilisateur
    const { data: userData, error: profileError } = await supabase
      .from('utilisateurs')
      .select('id, nom, email, "rôle"')
      .eq('id', user.id)
      .single();

    if (profileError || !userData) {
      return null;
    }

    return {
      id: userData.id,
      nom: userData.nom,
      email: userData.email,
      role: userData.rôle as UserProfile['role']
    };

  } catch (error) {
    console.error('Erreur getCurrentUser:', error);
    return null;
  }
}

/**
 * Vérifie l'authentification et redirige si nécessaire
 * À utiliser dans les layouts/pages protégées
 */
export async function requireAuth(requiredRole?: UserProfile['role']): Promise<UserProfile> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirection selon le rôle
    switch (user.role) {
      case 'proprietaire':
        redirect('/dashboard/proprietaire');
      case 'gestionnaire':
      case 'admin':
        redirect('/dashboard/gestionnaire');
      default:
        redirect('/login');
    }
  }
  
  return user;
}

/**
 * Vérifie l'authentification sans redirection
 * Utile pour les composants conditionnels
 */
export async function checkAuth(): Promise<{ user: UserProfile | null; isAuthenticated: boolean }> {
  const user = await getCurrentUser();
  return {
    user,
    isAuthenticated: !!user
  };
} 