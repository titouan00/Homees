'use client'

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageSquare, 
  BarChart3, 
  House, 
  Shield, 
  ArrowRight, 
  Play,
  Star,
  Clock,
  UserPlus,
  Eye,
  Timer,
} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header clair et impactant */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden pt-16">
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
              Comparez. Choisissez.<br/>
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Déléguez votre bien en toute confiance.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              La première plateforme qui met en relation propriétaires et gestionnaires immobiliers avec transparence totale.
            </p>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center group text-lg"
              >
                Je trouve mon gestionnaire
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/signup" 
                className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center group text-lg"
              >
                Tester gratuitement
                <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 – Ce que vous résolvez */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La gestion locative ne devrait pas être un casse-tête.
            </h2>
            <p className="text-xl text-gray-600">
              Pourtant, plus de 50% des propriétaires rencontrent les mêmes difficultés
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Difficulté de comparer les agences</h3>
              <p className="text-gray-600">Chaque gestionnaire a ses propres grilles tarifaires et services. Impossible de s'y retrouver.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Manque de transparence</h3>
              <p className="text-gray-600">Frais cachés, services flous, pas d'avis clients vérifiés. Vous signez à l'aveugle.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Timer className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Perte de temps pour les proprios</h3>
              <p className="text-gray-600">Des heures passées à chercher, appeler, comparer... sans garantie de faire le bon choix.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 – Comment ça marche ? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              En 3 étapes simples, trouvez le gestionnaire parfait pour votre bien
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-6">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-full text-white font-bold text-sm mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Créez votre compte en 2 minutes</h3>
              <p className="text-gray-600">Renseignez votre bien et vos critères de gestion. C'est rapide et gratuit.</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-full text-white font-bold text-sm mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comparez les gestionnaires selon vos critères</h3>
              <p className="text-gray-600">Prix, services, avis clients, zone géographique... Tout est transparent.</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-full mb-6">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-full text-white font-bold text-sm mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Discutez et choisissez en confiance</h3>
              <p className="text-gray-600">Échangez directement avec les gestionnaires et signez avec celui qui vous convient.</p>
            </div>
          </div>

          {/* CTA milieu de page */}
          <div className="text-center mt-16">
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center group text-lg"
            >
              Trouver mon gestionnaire maintenant
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3 – Les bénéfices */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi utiliser HOMEES ?
            </h2>
            <p className="text-xl text-gray-600">
              Les avantages qui font la différence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ Gagnez du temps</h3>
                  <p className="text-gray-600">Fini les recherches interminables. Tous les gestionnaires qualifiés au même endroit.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ Comparez en toute transparence</h3>
                  <p className="text-gray-600">Tarifs clairs, services détaillés, aucun frais caché. Vous savez exactement ce que vous payez.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ Lisez des avis réels</h3>
                  <p className="text-gray-600">Témoignages vérifiés de vrais propriétaires. Pas de faux avis, que de l'authentique.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ Gardez le contrôle</h3>
                  <p className="text-gray-600">Dashboard en temps réel pour suivre votre bien. Vous restez informé de tout.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot placeholder */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
              <Image
                src="/non.jpg"
                alt="Aperçu du dashboard HOMEES"
                fill
                className="object-cover rounded-xl"
                style={{ objectPosition: 'center' }}
                priority
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-500 font-medium">Aperçu du dashboard HOMEES</p>
              <p className="text-gray-400 text-sm">Interface de comparaison des gestionnaires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 – Témoignages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Les premiers retours de nos bêta testeurs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-emerald-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 mb-4">
                "Grâce à HOMEES, j'ai enfin pu déléguer mon bien sans stress. La comparaison était claire et j'ai trouvé le gestionnaire parfait en 2 jours !"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-700 font-semibold">C</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Claire M.</p>
                  <p className="text-gray-600 text-sm">Propriétaire à Lyon</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-blue-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 mb-4">
                "Enfin une plateforme qui met de la transparence dans ce secteur ! Les tarifs sont clairs et les avis m'ont aidé à faire le bon choix."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-semibold">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marc D.</p>
                  <p className="text-gray-600 text-sm">Propriétaire à Paris</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-gray-100 px-6 py-3 rounded-full">
              <span className="text-gray-600 mr-2">Bientôt disponible sur</span>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">Trustpilot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 – Bloc gestionnaire */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white p-12 rounded-2xl shadow-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <House className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Vous êtes gestionnaire immobilier ?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rejoignez la plateforme et développez votre portefeuille client avec des propriétaires qualifiés.
              </p>
              <Link 
                href="/gestionnaire-signup" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center group text-lg"
              >
                Créer mon profil gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à déléguer votre bien en toute confiance ?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les propriétaires qui ont déjà trouvé leur gestionnaire idéal sur HOMEES.
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-emerald-700 px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center group text-lg"
          >
            Trouver mon gestionnaire maintenant
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}