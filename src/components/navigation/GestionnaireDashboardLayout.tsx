'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/auth-server';
import GestionnaireSidebar from './GestionnaireSidebar';
import DashboardTopBar from './DashboardTopBar';

interface GestionnaireDashboardLayoutProps {
  children: React.ReactNode;
  userProfile: UserProfile;
}

/**
 * Layout Dashboard spécialisé pour les gestionnaires
 * Intègre la sidebar gestionnaire et la topbar avec fonctionnalités métier
 */
export default function GestionnaireDashboardLayout({ 
  children, 
  userProfile 
}: GestionnaireDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <GestionnaireSidebar userProfile={userProfile} />
        </div>
      </div>

      {/* Sidebar Mobile - Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col flex-1 w-0 max-w-xs bg-white">
            <GestionnaireSidebar userProfile={userProfile} />
          </div>
        </div>
      )}

      {/* Zone de contenu principal */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar avec fonctionnalités gestionnaire */}
        <DashboardTopBar 
          title="Dashboard Gestionnaire"
          subtitle="Gérez votre portefeuille immobilier"
          userProfile={userProfile}
          onMobileMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Contenu principal */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 