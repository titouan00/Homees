'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkle, ArrowRight, PlayCircle, TrendUp, Users } from 'phosphor-react';
import HeroSearchBar from '@/components/HeroSearchBar';

/**
 * Section Hero de la page d'accueil
 * Comprend le titre principal, la barre de recherche et l'image
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
      {/* Éléments d'arrière-plan animés */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Motif de grille */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-8 animate-pulse">
              <Sparkle className="h-4 w-4 mr-2" />
              300+ Gestionnaires Immobiliers Certifiés
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 animate-fade-in">
              Transforming places,<br/>
              <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                Realizing Dreams
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl animate-fade-in-delayed">
              Trouvez le gestionnaire immobilier parfait pour vos biens. Comparez les offres, consultez les avis authentiques et réalisez vos rêves immobiliers.
            </p>
            
            {/* Barre de recherche améliorée avec Google Places */}
            <HeroSearchBar className="mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-delayed-2" />
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delayed-3">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center"
              >
                Comparer les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center">
                <PlayCircle className="mr-2 h-5 w-5" />
                Voir la démo
              </button>
            </div>
          </div>
          
          {/* Image et cartes flottantes */}
          <div className="relative lg:block hidden">
            <div className="relative">
              <Image
                src="/images/modern-house.jpg"
                alt="Maison moderne avec jardin"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80";
                }}
              />
              
              {/* Cartes flottantes */}
              <div className="absolute -top-8 -left-8 bg-white p-4 rounded-xl shadow-xl animate-float">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Rentabilité</p>
                    <p className="text-emerald-600 font-bold">+15%</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-xl shadow-xl animate-float-delayed">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Clients satisfaits</p>
                    <p className="text-blue-600 font-bold">5000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bas courbé */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-white">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
} 