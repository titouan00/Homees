'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash, Envelope, Lock, ArrowRight, House, Sparkle } from 'phosphor-react';
import AuthBackground from '@/components/ui/AuthBackground';
import AuthCard from '@/components/ui/AuthCard';
import AuthInput from '@/components/ui/AuthInput';
import AuthButton from '@/components/ui/AuthButton';
import ErrorMessage from '@/components/ui/ErrorMessage';

/**
 * Page Login - Design original restauré avec architecture optimisée
 * Logique Supabase préservée à 100%
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Récupérer le rôle de l'utilisateur depuis la base de données
        const { data: userData, error: userError } = await supabase
          .from('utilisateurs')
          .select('"rôle"')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Erreur récupération rôle:', userError);
          setError('Erreur lors de la connexion');
        } else {
          // Redirection intelligente selon le rôle
          const role = (userData as any)?.rôle;
          
          if (!role) {
            setError('Rôle utilisateur non trouvé');
            return;
          }
          
          // Vérifier s'il y a un paramètre redirect dans l'URL
          const urlParams = new URLSearchParams(window.location.search);
          const redirectPath = urlParams.get('redirect');
          
          if (redirectPath) {
            // Redirection vers la page demandée (si autorisée pour ce rôle)
            if (
              (role === 'proprietaire' && redirectPath === '/dashboard/proprietaire') ||
              (role === 'gestionnaire' && redirectPath === '/dashboard/gestionnaire')
            ) {
              router.push(redirectPath);
            } else {
              // Redirection vers le bon dashboard pour ce rôle
              router.push(`/dashboard/${role}`);
            }
          } else {
            // Redirection par défaut selon le rôle
            router.push(`/dashboard/${role}`);
          }
        }
      }
    } catch (err) {
      console.error('Erreur login:', err);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />

      {/* Main Container - Design original */}
      <div className="w-full max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
        
        {/* Welcome Section - Left Side - DESIGN ORIGINAL */}
        <div className="hidden lg:block text-white space-y-6">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8">
            <House className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="space-y-4">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              <Sparkle className="h-4 w-4 mr-2" />
              Connexion sécurisée
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Bon retour sur <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Homees
              </span>
            </h1>
            
            <p className="text-xl text-purple-100 leading-relaxed">
              Retrouvez votre tableau de bord et gérez vos biens immobiliers en toute simplicité.
            </p>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-purple-100">Accès à votre tableau de bord personnel</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-purple-100">Messagerie sécurisée avec vos gestionnaires</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-purple-100">Suivi en temps réel de vos biens</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-purple-100">Comparaison transparente des gestionnaires</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form - Right Side */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          {/* Mobile Header - Design original */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center text-white hover:text-gray-200 transition-colors mb-4">
              <House className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-purple-200 text-sm">
              Accédez à votre espace personnel
            </p>
          </div>

          <AuthCard>
            <ErrorMessage message={error} className="mb-4" />

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <AuthInput
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Envelope}
                placeholder="votre.email@exemple.com"
                required
              />

              <AuthInput
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                placeholder="••••••••"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              {/* Actions Row */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center text-purple-200">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                  />
                  Se souvenir de moi
                </label>
                <Link href="/forgot-password" className="text-purple-200 hover:text-white transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Login Button */}
              <AuthButton
                type="submit"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Se connecter
              </AuthButton>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-3 text-purple-200 text-xs">ou</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-purple-200 mb-3 text-sm">
                Vous n'avez pas encore de compte ?
              </p>
              <AuthButton
                variant="secondary"
                onClick={() => router.push('/signup')}
                fullWidth
              >
                Créer un compte
              </AuthButton>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
} 