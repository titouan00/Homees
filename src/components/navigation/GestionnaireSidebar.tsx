'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useUnreadMessages } from '@/hooks';
import { NavigationItem } from './NavigationItem';
import { UserProfile } from '@/lib/auth-server';
import {
  SquaresFour,
  Funnel,
  Buildings,
  ChatCircle,
  User,
  Gear,
  Question,
  SignOut,
  House,
  CaretDown,
  Globe
} from '@phosphor-icons/react';

interface GestionnaireSidebarProps {
  userProfile: UserProfile;
}

/**
 * Sidebar Dashboard Gestionnaire - Navigation spécialisée
 * Adaptée aux besoins métier des gestionnaires immobiliers
 */
export default function GestionnaireSidebar({ userProfile }: GestionnaireSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Hook pour récupérer le nombre de messages non lus
  const { unreadCount: messagesCount, isLoading: messagesLoading } = useUnreadMessages(
    userProfile.id,
    'gestionnaire'
  );

  // Navigation Général - Section principale pour les fonctionnalités métier
  const generalNavigation = [
    {
      name: 'Tableau de bord',
      href: `/dashboard/gestionnaire`,
      icon: SquaresFour,
      current: pathname === `/dashboard/gestionnaire`,
      description: 'Vue d\'ensemble de votre activité'
    },
    {
      name: 'Mes biens',
      href: `/dashboard/gestionnaire/biens`,
      icon: Buildings,
      current: pathname.includes('/biens'),
      description: 'Portefeuille immobilier'
    },
    {
      name: 'Demandes',
      href: `/dashboard/gestionnaire/demandes`,
      icon: Funnel,
      current: pathname.includes('/demandes'),
      description: 'Pipeline de prospects'
    },
    {
      name: 'Messages',
      href: `/dashboard/gestionnaire/messages`,
      icon: ChatCircle,
      current: pathname.includes('/messages'),
      description: 'Centre de messagerie unifié'
    }
  ];

  // Navigation Personnel - Section paramètres et profil
  const personnelNavigation = [
    {
      name: 'Profil public',
      href: `/dashboard/gestionnaire/profil`,
      icon: Globe,
      current: pathname.includes('/profil'),
      description: 'Optimiser votre visibilité'
    },
    {
      name: 'Paramètres',
      href: `/dashboard/gestionnaire/parametres`,
      icon: Gear,
      current: pathname.includes('/parametres'),
      description: 'Configuration et préférences'
    },
    {
      name: 'Support',
      href: '/contact',
      icon: Question,
      current: pathname.includes('/contact'),
      description: 'Aide et assistance'
    }
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo avec badge gestionnaire */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/dashboard/gestionnaire" className="flex items-center space-x-2">
          <img
            src="/images/Logo_Homees_Noir.png"
            alt="Logo Homees"
            className="h-14 w-14 object-contain"
          />
          <div>
            <span className="text-xl font-bold text-gray-900">Homees</span>
            <span className="block text-xs text-emerald-600 font-medium">Gestionnaire</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-8">
          {/* Section Général */}
          <div>
            <div className="flex items-center px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Général
              </h3>
            </div>
            <div className="space-y-1">
              {generalNavigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  current={item.current}
                />
              ))}
            </div>
          </div>

          {/* Section Personnel */}
          <div>
            <div className="flex items-center px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Personnel
              </h3>
            </div>
            <div className="space-y-1">
              {personnelNavigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  current={item.current}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Profil utilisateur en bas */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userProfile.nom.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userProfile.nom}
                  </p>
                  <p className={`text-xs font-bold truncate mt-0.5 ${
                    userProfile.abonnement === 'pro' && userProfile.abonnement_expiration && new Date(userProfile.abonnement_expiration) > new Date()
                      ? 'text-emerald-600'
                      : 'text-gray-400'
                  }`}>
                    {userProfile.abonnement === 'pro' && userProfile.abonnement_expiration && new Date(userProfile.abonnement_expiration) > new Date()
                      ? 'Gestionnaire Pro'
                      : 'Gestionnaire Free'}
                  </p>
                </div>
              </div>
              <CaretDown className={`h-4 w-4 text-gray-400 transition-transform ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Menu déroulant profil */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <SignOut className="mr-3 h-4 w-4 text-red-400" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 