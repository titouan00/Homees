'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import AnimationStyles from '@/components/ui/AnimationStyles';

/**
 * Page d'accueil principale de Homees
 * Version refactorisée complète avec tous les composants modulaires
 */
export default function Landing() {
  // Hook pour les animations au scroll
  useScrollAnimation();

  return (
    <>
      {/* Section Hero */}
      <HeroSection />

      {/* Section des statistiques */}
      <StatsSection />

      {/* Section des fonctionnalités */}
      <FeaturesSection />

      {/* Section "Comment ça marche" */}
      <HowItWorksSection />

      {/* Section des avantages */}
      <BenefitsSection />

      {/* Section des témoignages */}
      <TestimonialsSection />

      {/* Section d'appel à l'action final */}
      <CTASection />

      {/* Styles d'animation globaux */}
      <AnimationStyles />
    </>
  );
}