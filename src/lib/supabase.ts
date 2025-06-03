import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour l'authentification
export type AuthUser = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    first_name?: string
    last_name?: string
  }
}

export type UserRole = 'proprietaire' | 'gestionnaire' | 'admin'

export type Profile = {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
} 