'use client';

import { useState } from 'react';
import { MagnifyingGlass, Bell, CaretDown, List } from '@phosphor-icons/react';
import { UserProfile } from '@/lib/auth-server';

interface DashboardTopBarProps {
  title: string;
  subtitle?: string;
  userProfile?: UserProfile;
  onMobileMenuClick?: () => void;
}

/**
 * Barre horizontale du dashboard - Design de l'image
 * Contient la recherche, notifications et profil utilisateur
 */
export default function DashboardTopBar({ 
  title, 
  subtitle, 
  userProfile,
  onMobileMenuClick 
}: DashboardTopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Partie gauche - Titre + List mobile */}
        <div className="flex items-center space-x-4">
          {/* Bouton menu mobile */}
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <List className="h-5 w-5 text-gray-600" />
          </button>

          {/* Titre et sous-titre */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Partie droite - Recherche + Actions */}
        <div className="flex items-center space-x-4">
          {/* Barre de recherche */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlass className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher biens, gestionnaires, demandes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-96 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Bouton recherche mobile */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100">
            <MagnifyingGlass className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {/* Badge de notification */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Profil utilisateur - simplifié car déjà dans sidebar */}
          {userProfile && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userProfile.nom.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:inline font-medium">
                {userProfile.nom}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barre de recherche mobile */}
      <div className="sm:hidden mt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
} 