'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Chatbot from "@/components/Chatbot";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
  children: ReactNode;
}

// Fonction pour vérifier si on est sur le dashboard
function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

/**
 * Layout conditionnel qui masque header/footer sur le dashboard
 */
export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isOnDashboard = isDashboardRoute(pathname);

  return (
    <>
      {/* Header et Footer masqués sur le dashboard */}
      {!isOnDashboard && <Header />}
      
      <main className={isOnDashboard ? "flex-grow" : "flex-grow pt-20"}>
        {children}
      </main>
      
      {!isOnDashboard && <Footer />}
      
      {/* Chatbot uniquement hors dashboard */}
      {!isOnDashboard && <Chatbot />}
    </>
  );
} 