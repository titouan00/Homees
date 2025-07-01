'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useProprietesCount, useUnreadMessages, useDemandesCount } from '@/hooks';
import { NavigationItem } from './NavigationItem';
import { UserProfile } from '@/lib/auth-server';
import {
  SquaresFour,
  Scales,
  Buildings,
  FileText,
  ChatCircle,
  User,
  Gear,
  Question,
  SignOut,
  House,
  CaretDown,
  CaretDown as CaretDownIcon
} from '@phosphor-icons/react';

interface SidebarProps {
  userProfile: UserProfile;
}

/**
 * Sidebar Dashboard - Navigation latérale moderne
 * Réplique exacte du design de l'image fournie
 */
export default function DashboardSidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Hook pour récupérer le nombre de biens
  const { count: biensCount, loading: biensLoading } = useProprietesCount(
    userProfile.role === 'proprietaire' ? userProfile.id : undefined
  );

  // Hook pour récupérer le nombre de messages non lus
  const { unreadCount: messagesCount, isLoading: messagesLoading } = useUnreadMessages(
    userProfile.id,
    userProfile.role as 'proprietaire' | 'gestionnaire'
  );

  // Hook pour récupérer le nombre de demandes
  const { count: demandesCount, loading: demandesLoading } = useDemandesCount(
    userProfile.role === 'proprietaire' ? userProfile.id : undefined
  );

  // Navigation principale - Section "Général"
  const generalNavigation = [
    {
      name: 'Tableau de bord',
      href: `/dashboard/${userProfile.role}`,
      icon: SquaresFour,
      current: pathname === `/dashboard/${userProfile.role}`
    },
    {
      name: 'Comparateur',
      href: `/dashboard/${userProfile.role}/comparateur`,
      icon: Scales,
      current: pathname.includes('/comparateur')
    },
    {
      name: 'Mes biens',
      href: `/dashboard/${userProfile.role}/biens`,
      icon: Buildings,
      current: pathname.includes('/biens'),
      isSpecialBadge: userProfile.role === 'proprietaire',
      specialBadgeCount: userProfile.role === 'proprietaire' ? biensCount : undefined,
      specialBadgeLoading: userProfile.role === 'proprietaire' ? biensLoading : false
    },
    {
      name: 'Demandes',
      href: `/dashboard/${userProfile.role}/demandes`,
      icon: FileText,
      current: pathname.includes('/demandes'),
      isSpecialBadge: userProfile.role === 'proprietaire',
      specialBadgeCount: demandesCount,
      specialBadgeLoading: demandesLoading
    },
    {
      name: 'Messages',
      href: `/dashboard/messages`,
      icon: ChatCircle,
      current: pathname.includes('/messages'),
      isSpecialBadge: true,
      specialBadgeCount: messagesCount,
      specialBadgeLoading: messagesLoading
    }
  ];

  // Navigation personnelle - Section "Personnel"
  const personalNavigation = [
    {
      name: 'Mon profil',
      href: `/dashboard/${userProfile.role}/profil`,
      icon: User,
      current: pathname.includes('/profil')
    },
    {
      name: 'Paramètres',
      href: `/dashboard/${userProfile.role}/parametres`,
      icon: Gear,
      current: pathname.includes('/parametres')
    },
    {
      name: 'Support',
      href: '/contact',
      icon: Question,
      current: pathname.includes('/contact')
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
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <House className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-bold text-gray-900">Homees</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-8">
          {/* Section Général */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Général
            </h3>
            <div className="mt-2 space-y-1">
              {generalNavigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  current={item.current}
                  isSpecialBadge={item.isSpecialBadge}
                  specialBadgeCount={item.specialBadgeCount}
                  specialBadgeLoading={item.specialBadgeLoading}
                />
              ))}
            </div>
          </div>

          {/* Section Personnel */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Personnel
            </h3>
            <div className="mt-2 space-y-1">
              {personalNavigation.map((item) => (
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
                <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userProfile.nom.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userProfile.nom}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userProfile.email}
                  </p>
                  {/* Affichage dynamique du statut d'abonnement */}
                  {userProfile.role === 'gestionnaire' && (
                    <span className={`mt-1 inline-block font-bold text-xs rounded px-2 py-0.5 ${
                      userProfile.abonnement === 'pro' && userProfile.abonnement_expiration && new Date(userProfile.abonnement_expiration) > new Date()
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {userProfile.abonnement === 'pro' && userProfile.abonnement_expiration && new Date(userProfile.abonnement_expiration) > new Date()
                        ? 'Gestionnaire Pro'
                        : 'Gestionnaire Free'}
                    </span>
                  )}
                </div>
              </div>
              <CaretDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* List déroulant profil */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
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