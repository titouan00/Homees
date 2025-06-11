'use client';

import Link from 'next/link';
import { House, ChartBar, Users, Lightning } from 'phosphor-react';
import StepCard from '@/components/ui/StepCard';

/**
 * Données des étapes du processus
 */
const stepsData = [
  {
    number: "1",
    icon: <House className="h-6 w-6" />,
    title: "Décrivez vos besoins",
    description: "Indiquez le type de bien, sa localisation et vos attentes spécifiques en matière de gestion locative."
  },
  {
    number: "2", 
    icon: <ChartBar className="h-6 w-6" />,
    title: "Comparez les offres",
    description: "Recevez des propositions personnalisées et comparez les services, tarifs et avis en toute transparence."
  },
  {
    number: "3",
    icon: <Users className="h-6 w-6" />,
    title: "Choisissez votre gestionnaire", 
    description: "Sélectionnez le gestionnaire qui correspond parfaitement à vos besoins et à votre budget."
  }
];

/**
 * Section "Comment ça marche"
 * Explique le processus en 3 étapes simples
 */
export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden" data-animate>
      {/* Éléments d'arrière-plan */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* En-tête de section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-6 inline-block">
            Processus simple et efficace
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Trouvez votre gestionnaire idéal en seulement 3 étapes simples et rapides
          </p>
        </div>
        
        {/* Grille des étapes avec lignes de connexion */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Lignes de connexion (masquées sur mobile) */}
          <div className="hidden lg:block absolute top-32 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          
          {/* Cartes des étapes */}
          {stepsData.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
        
        {/* Bouton d'action */}
        <div className="text-center mt-16">
          <Link 
            href="/signup" 
            className="bg-white text-purple-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold inline-flex items-center text-lg"
          >
            Commencer maintenant - C'est gratuit
            <Lightning className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  );
} 