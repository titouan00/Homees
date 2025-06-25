'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { UserProfile } from '@/lib/auth-server';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  userProfile: UserProfile | null;
  title?: string;
  subtitle?: string;
}

/**
 * Détermine le titre de la page en fonction de l'URL actuelle
 */
function getPageTitle(pathname: string, userRole: string): { title: string; subtitle?: string } {
  // Nettoyer le pathname
  const path = pathname.toLowerCase();
  
  if (path.includes('/messages')) {
    return {
      title: 'Messages',
      subtitle: `Gérez vos conversations avec les ${userRole === 'proprietaire' ? 'gestionnaires' : 'propriétaires'}`
    };
  }
  
  if (path.includes('/profil')) {
    return {
      title: 'Mon Profil',
      subtitle: 'Gérez vos informations personnelles et préférences'
    };
  }
  
  if (path.includes('/biens')) {
    return {
      title: 'Mes Biens',
      subtitle: 'Gérez votre portefeuille immobilier'
    };
  }
  
  if (path.includes('/demandes')) {
    return {
      title: 'Demandes',
      subtitle: userRole === 'proprietaire' ? 'Vos demandes de gestion' : 'Demandes reçues'
    };
  }
  
  if (path.includes('/gestionnaires')) {
    return {
      title: 'Gestionnaires',
      subtitle: 'Trouvez et comparez les gestionnaires immobiliers'
    };
  }
  
  if (path.includes('/comparateur')) {
    return {
      title: 'Comparateur',
      subtitle: 'Comparez les gestionnaires et leurs services'
    };
  }
  
  if (path.includes('/parametres')) {
    return {
      title: 'Paramètres',
      subtitle: 'Configurez vos préférences et notifications'
    };
  }
  
  // Pages spécifiques au rôle
  if (path.includes('/proprietaire')) {
    if (path === '/dashboard/proprietaire' || path === '/dashboard/proprietaire/') {
      return {
        title: 'Tableau de Bord Propriétaire',
        subtitle: 'Vue d\'ensemble de vos biens et activités'
      };
    }
  }
  
  if (path.includes('/gestionnaire')) {
    if (path === '/dashboard/gestionnaire' || path === '/dashboard/gestionnaire/') {
      return {
        title: 'Tableau de Bord Gestionnaire',
        subtitle: 'Gérez vos clients et propriétés'
      };
    }
  }
  
  // Titre par défaut
  return {
    title: 'Tableau de Bord',
    subtitle: 'Bienvenue sur votre espace personnel'
  };
}

/**
 * Layout Dashboard - Structure avec sidebar moderne + topbar horizontale
 * Replique le design exact de l'image fournie
 */
export default function DashboardLayout({ 
  children, 
  userProfile, 
  title, 
  subtitle 
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Si pas de profil utilisateur, ne pas afficher
  if (!userProfile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Déterminer le titre automatiquement si pas fourni
  const pageInfo = title ? { title, subtitle } : getPageTitle(pathname, userProfile.role);
  const finalTitle = pageInfo.title;
  const finalSubtitle = pageInfo.subtitle;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <DashboardSidebar userProfile={userProfile} />
        </div>
      </div>

      {/* Sidebar Navigation - Mobile (Overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-64 bg-white">
            <DashboardSidebar userProfile={userProfile} />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barre horizontale du haut */}
        <DashboardTopBar 
          title={finalTitle}
          subtitle={finalSubtitle}
          userProfile={userProfile}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Zone de contenu */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 