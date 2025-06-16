// Types centralisés pour l'authentification
export type UserRole = 'proprietaire' | 'gestionnaire' | 'admin';

export interface UserProfile {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
} 