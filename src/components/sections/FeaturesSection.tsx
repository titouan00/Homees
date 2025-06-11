'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlass, Star, Shield, CaretRight } from 'phosphor-react';
import FeatureCard from '@/components/ui/FeatureCard';

/**
 * Données des onglets et fonctionnalités
 */
const tabsData = ['Comparaison', 'Avis', 'Certification'];

const featuresData = [
  {
    icon: <MagnifyingGlass className="h-8 w-8 text-white" />,
    title: "Comparaison transparente",
    description: "Comparez facilement les services, tarifs et avis des gestionnaires immobiliers certifiés en quelques clics.",
    color: "bg-gradient-to-br from-blue-500 to-blue-700"
  },
  {
    icon: <Star className="h-8 w-8 text-white" />,
    title: "Avis authentiques vérifiés",
    description: "Consultez les évaluations authentiques de propriétaires ayant déjà fait appel à nos gestionnaires partenaires.",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700"
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: "Gestionnaires certifiés",
    description: "Tous nos partenaires sont rigoureusement sélectionnés et certifiés pour garantir un service de qualité exceptionnelle.",
    color: "bg-gradient-to-br from-amber-500 to-amber-700"
  }
];

/**
 * Section des fonctionnalités avec navigation par onglets
 * Présente les avantages clés de la plateforme
 */
export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden" data-animate>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* En-tête de section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full text-sm font-medium mb-6 inline-block">
            Pourquoi nous choisir
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            La solution complète pour vos biens immobiliers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment Homees révolutionne la recherche de gestionnaires immobiliers avec une approche transparente et innovative
          </p>
        </div>

        {/* Navigation par onglets */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabsData.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === index 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenu des onglets - Cartes de fonctionnalités */}
        <div className="grid lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div 
              key={index}
              className={`transition-all duration-500 ${activeTab === index ? 'opacity-100' : 'opacity-50'}`}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Bouton d'action */}
        <div className="text-center mt-12">
          <Link 
            href="/signup" 
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            Découvrir tous nos gestionnaires
            <CaretRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
} 