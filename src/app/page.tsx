import Image from 'next/image'
import Link from 'next/link'
import { Sparkle, ArrowRight, PlayCircle, Star, Medal } from '@phosphor-icons/react/dist/ssr'
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

/**
 * Page d'accueil principale de Homees
 * Version server-side rendering avec contenu intégré
 */
export default function Landing() {
  return (
    <>
      {/* Hero Section intégrée */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
        {/* Éléments d'arrière-plan animés */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkle className="h-4 w-4 mr-2" />
              300+ Gestionnaires Immobiliers Certifiés
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
              Transforming places,<br/>
              <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                Realizing Dreams
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Trouvez le gestionnaire immobilier parfait pour vos biens. Comparez les offres, consultez les avis authentiques et réalisez vos rêves immobiliers.
            </p>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center"
              >
                Comparer les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/demo" 
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Voir la démo
              </Link>
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

      {/* Statistiques intégrées */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">Des chiffres qui parlent d'eux-mêmes</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-blue-600 mb-2">5000+</p>
              <p className="text-gray-600 font-medium">Propriétaires</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-emerald-600 mb-2">300+</p>
              <p className="text-gray-600 font-medium">Gestionnaires</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-amber-600 mb-2">98%</p>
              <p className="text-gray-600 font-medium">Satisfaction</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-purple-600 mb-2">15%</p>
              <p className="text-gray-600 font-medium">Rentabilité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités simplifiées */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full text-sm font-medium mb-6 inline-block">
              Pourquoi nous choisir
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La solution complète pour vos biens immobiliers
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez comment Homees révolutionne la recherche de gestionnaires immobiliers
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="bg-white p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comparaison transparente</h3>
                <p className="text-gray-600 leading-relaxed">Comparez facilement les services, tarifs et avis des gestionnaires immobiliers certifiés.</p>
              </div>
            </div>

            <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="bg-white p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Avis authentiques vérifiés</h3>
                <p className="text-gray-600 leading-relaxed">Consultez les évaluations authentiques de propriétaires ayant déjà fait appel à nos gestionnaires.</p>
              </div>
            </div>

            <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-8 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Medal className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="bg-white p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestionnaires certifiés</h3>
                <p className="text-gray-600 leading-relaxed">Tous nos partenaires sont rigoureusement sélectionnés et certifiés pour garantir un service de qualité.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/signup" 
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              Découvrir tous nos gestionnaires
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section des témoignages - Composant réutilisable */}
      <TestimonialsSection />

      {/* Section d'appel à l'action final - Composant réutilisable */}
      <CTASection />
    </>
  );
}