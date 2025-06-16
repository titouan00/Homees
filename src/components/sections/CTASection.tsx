'use client';

import Link from 'next/link';
import { Phone, Envelope, ChatCircle, Sparkle, PlayCircle } from '@phosphor-icons/react';

/**
 * Données des options de contact
 */
const contactOptions = [
  {
    icon: Phone,
    title: "Par téléphone",
    value: "01 23 45 67 89"
  },
  {
    icon: Envelope,
    title: "Par email", 
    value: "contact@homees.fr"
  },
  {
    icon: ChatCircle,
    title: "Chat en direct",
    value: "Disponible 24h/7j"
  }
];

/**
 * Composant pour une option de contact
 */
interface ContactOptionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}

function ContactOption({ icon: Icon, title, value }: ContactOptionProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
      <Icon className="h-8 w-8 text-white mx-auto mb-4" />
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-blue-100">{value}</p>
    </div>
  );
}

/**
 * Section d'appel à l'action final
 * Encourage l'utilisateur à s'inscrire avec différentes options de contact
 */
export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-20 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Titre principal */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Prêt à transformer votre gestion immobilière ?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Rejoignez plus de 5000 propriétaires satisfaits qui ont trouvé leur gestionnaire immobilier idéal grâce à Homees.
          </p>
          
          {/* Options de contact */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {contactOptions.map((option, index) => (
              <ContactOption key={index} {...option} />
            ))}
          </div>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="/signup" 
              className="bg-white text-blue-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold text-lg inline-flex items-center justify-center"
            >
              Commencer gratuitement
              <Sparkle className="ml-3 h-6 w-6" />
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg inline-flex items-center justify-center"
            >
              Contacter un conseiller
              <Phone className="ml-3 h-6 w-6" />
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold text-lg inline-flex items-center justify-center"
            >
              Voir la démo
              <PlayCircle className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 