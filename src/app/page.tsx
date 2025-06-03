'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, CheckCircle2, ArrowRight, Star, Shield, Sparkles, ChevronRight, Building, Home, Users, Clock, MapPin, TrendingUp, Award, Phone, Mail, MessageCircle, PlayCircle, BookOpen, Settings, BarChart, Zap, Target, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeroSearchBar from '@/components/HeroSearchBar';

// Hook pour les animations au scroll
function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !visibleElements.has(index)) {
          setVisibleElements(prev => new Set([...prev, index]));
          element.classList.add('animate-slide-up');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleElements]);

  return visibleElements;
}

export default function Landing() {
  useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* Hero Section with Enhanced Visuals */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-8 animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
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
              
              {/* Enhanced Search Bar with Google Places */}
              <HeroSearchBar className="mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-delayed-2" />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delayed-3">
                <Link href="/signup" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center">
                  Comparer les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
                <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Voir la démo
                </button>
              </div>
            </div>
            
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
                
                {/* Floating Cards */}
                <div className="absolute -top-8 -left-8 bg-white p-4 rounded-xl shadow-xl animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
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

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section Enhanced */}
      <section className="py-16 bg-white relative overflow-hidden" data-animate>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">Des chiffres qui parlent d'eux-mêmes</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">300+</p>
              <p className="text-gray-600 font-medium">Gestionnaires</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-emerald-600 mb-2">5000+</p>
              <p className="text-gray-600 font-medium">Propriétaires</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="h-16 w-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-amber-600 mb-2">98%</p>
              <p className="text-gray-600 font-medium">Satisfaction</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">25+</p>
              <p className="text-gray-600 font-medium">Villes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden" data-animate>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-6 relative z-10">
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

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Comparaison', 'Avis', 'Certification'].map((tab, index) => (
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

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className={`transition-all duration-500 ${activeTab === 0 ? 'opacity-100' : 'opacity-50'}`}>
              <FeatureCard 
                icon={<Search className="h-8 w-8 text-white" />} 
                title="Comparaison transparente" 
                description="Comparez facilement les services, tarifs et avis des gestionnaires immobiliers certifiés en quelques clics." 
                color="bg-gradient-to-br from-blue-500 to-blue-700"
              />
            </div>
            <div className={`transition-all duration-500 ${activeTab === 1 ? 'opacity-100' : 'opacity-50'}`}>
              <FeatureCard 
                icon={<Star className="h-8 w-8 text-white" />} 
                title="Avis authentiques vérifiés" 
                description="Consultez les évaluations authentiques de propriétaires ayant déjà fait appel à nos gestionnaires partenaires." 
                color="bg-gradient-to-br from-emerald-500 to-emerald-700"
              />
            </div>
            <div className={`transition-all duration-500 ${activeTab === 2 ? 'opacity-100' : 'opacity-50'}`}>
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-white" />} 
                title="Gestionnaires certifiés" 
                description="Tous nos partenaires sont rigoureusement sélectionnés et certifiés pour garantir un service de qualité exceptionnelle." 
                color="bg-gradient-to-br from-amber-500 to-amber-700"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/signup" className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
              Découvrir tous nos gestionnaires
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
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
          
          <div className="grid lg:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-32 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            
            <StepCard 
              number="1" 
              icon={<Home className="h-6 w-6" />}
              title="Décrivez vos besoins" 
              description="Indiquez le type de bien, sa localisation et vos attentes spécifiques en matière de gestion locative." 
            />
            <StepCard 
              number="2" 
              icon={<BarChart className="h-6 w-6" />}
              title="Comparez les offres" 
              description="Recevez des propositions personnalisées et comparez les services, tarifs et avis en toute transparence." 
            />
            <StepCard 
              number="3" 
              icon={<Users className="h-6 w-6" />}
              title="Choisissez votre gestionnaire" 
              description="Sélectionnez le gestionnaire qui correspond parfaitement à vos besoins et à votre budget." 
            />
          </div>
          
          <div className="text-center mt-16">
            <Link href="/signup" className="bg-white text-purple-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold inline-flex items-center text-lg">
              Commencer maintenant - C'est gratuit
              <Zap className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section id="benefits" className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-amber-100 text-amber-700 px-6 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                Pour les propriétaires
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Des avantages exclusifs qui font la différence
          </h2>
              
              <div className="space-y-6 mb-10">
                <BenefitItem icon={<Clock className="h-6 w-6" />} text="Économisez du temps précieux en comparant toutes les offres en un seul endroit" />
                <BenefitItem icon={<Shield className="h-6 w-6" />} text="Accédez à des gestionnaires certifiés et rigoureusement évalués" />
                <BenefitItem icon={<Target className="h-6 w-6" />} text="Bénéficiez de tarifs négociés et d'une transparence totale" />
                <BenefitItem icon={<MessageCircle className="h-6 w-6" />} text="Communiquez facilement via notre messagerie intégrée sécurisée" />
                <BenefitItem icon={<BarChart className="h-6 w-6" />} text="Suivez vos demandes et mandats depuis votre tableau de bord personnalisé" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center">
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/signup" className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 shadow-md hover:shadow-lg font-semibold inline-flex items-center justify-center">
                  Explorer les gestionnaires
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gain de temps</h3>
                <p className="text-gray-600">Trouvez le bon gestionnaire en quelques minutes au lieu de plusieurs jours de recherche</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurité garantie</h3>
                <p className="text-gray-600">Tous nos partenaires sont vérifiés, certifiés et régulièrement évalués</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="h-16 w-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transparence totale</h3>
                <p className="text-gray-600">Avis authentiques et vérifiés de clients réels pour vous aider à choisir</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="h-16 w-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Économies réelles</h3>
                <p className="text-gray-600">Comparez les tarifs et économisez jusqu'à 30% sur vos frais de gestion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden" data-animate>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="bg-purple-100 text-purple-700 px-6 py-2 rounded-full text-sm font-medium mb-6 inline-block">
              Témoignages clients
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que disent nos clients
          </h2>
            <p className="text-xl text-gray-600">
              Plus de 5000 propriétaires nous font confiance
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-gray-900">Michel Dubois</h4>
                  <p className="text-gray-600">Propriétaire de 3 biens</p>
                  <div className="flex text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic text-lg leading-relaxed">"J'ai trouvé un excellent gestionnaire pour mes trois appartements en moins d'une semaine. Le processus était simple, transparent et très efficace."</p>
              <div className="mt-6 flex items-center text-sm text-blue-600">
                <Heart className="h-4 w-4 mr-2" />
                Économie de 25% sur les frais
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-emerald-100">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-gray-900">Sophie Laurent</h4>
                  <p className="text-gray-600">Investisseuse immobilière</p>
                  <div className="flex text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic text-lg leading-relaxed">"La comparaison des offres m'a permis d'économiser près de 30% sur mes frais de gestion. Je recommande vivement Homees à tous les propriétaires!"</p>
              <div className="mt-6 flex items-center text-sm text-emerald-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                Rentabilité augmentée de 15%
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl">
                  P
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-gray-900">Pierre Moreau</h4>
                  <p className="text-gray-600">Propriétaire bailleur</p>
                  <div className="flex text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic text-lg leading-relaxed">"Interface intuitive et service client réactif. J'apprécie particulièrement la transparence des avis clients et la facilité de comparaison."</p>
              <div className="mt-6 flex items-center text-sm text-amber-600">
                <Award className="h-4 w-4 mr-2" />
                Service 5 étoiles garanti
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with Contact Options */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Prêt à transformer votre gestion immobilière ?
          </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Rejoignez plus de 5000 propriétaires satisfaits qui ont trouvé leur gestionnaire immobilier idéal grâce à Homees.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <Phone className="h-8 w-8 text-white mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Par téléphone</h3>
                <p className="text-blue-100">01 23 45 67 89</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <Mail className="h-8 w-8 text-white mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Par email</h3>
                <p className="text-blue-100">contact@homees.fr</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 md:col-span-2 lg:col-span-1">
                <MessageCircle className="h-8 w-8 text-white mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Chat en direct</h3>
                <p className="text-blue-100">Disponible 24h/7j</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/signup" className="bg-white text-blue-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold text-lg inline-flex items-center justify-center">
                Commencer gratuitement
                <Sparkles className="ml-3 h-6 w-6" />
              </Link>
              <Link href="/contact" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg inline-flex items-center justify-center">
                Contacter un conseiller
                <Phone className="ml-3 h-6 w-6" />
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold text-lg inline-flex items-center justify-center">
                Voir la démo
                <PlayCircle className="ml-3 h-6 w-6" />
          </Link>
            </div>
          </div>
        </div>
      </section>
       
      {/* Enhanced CSS for animations */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes blob {
          0% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(120deg); }
          66% { transform: scale(0.9) rotate(240deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-blob {
          animation: blob 8s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delayed-2 {
          animation: fadeIn 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delayed-3 {
          animation: fadeIn 1s ease-out 0.9s forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        [data-animate] {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        [data-animate].animate-slide-up {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}

function FeatureCard({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
}) {
  return (
    <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
      <div className={`${color} p-8 flex items-center justify-center`}>
        <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <div className="bg-white p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center relative group">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-white to-gray-100 text-purple-600 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
            {number}
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm h-12 w-12 rounded-full flex items-center justify-center">
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-purple-100 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function BenefitItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]">
      <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <div className="text-emerald-600">
          {icon}
        </div>
      </div>
      <span className="text-gray-700 font-medium leading-relaxed">{text}</span>
    </div>
  );
}
