'use client';

import { ReactNode, useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  rôle: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  userProfile: UserProfile;
  title?: string;
  subtitle?: string;
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
          title={title || "Tableau de bord"}
          subtitle={subtitle}
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