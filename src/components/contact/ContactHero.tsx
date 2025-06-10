'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Composant Hero de la page contact - Design préservé exactement
 */
const ContactHero: React.FC = () => {
  return (
    <div className="text-center lg:text-left">
      <Link 
        href="/" 
        className="inline-flex items-center text-white/80 hover:text-white transition-colors font-medium mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
      >
        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
        Retour à l'accueil
      </Link>
      
      <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
        Une question ?<br/>
        <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
          Nous sommes là
        </span>
      </h1>
      
      <p className="text-xl lg:text-2xl text-blue-100 mb-6 max-w-2xl mx-auto lg:mx-0">
        Notre équipe d'experts est disponible pour répondre à toutes vos questions 
        et vous accompagner dans votre projet immobilier.
      </p>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-md mx-auto lg:mx-0">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <h3 className="text-white font-semibold">Plateforme de mise en relation</h3>
        </div>
        <p className="text-blue-100 text-sm leading-relaxed">
          Homees connecte propriétaires et gestionnaires immobiliers certifiés 
          avec transparence et simplicité.
        </p>
      </div>
    </div>
  );
};

export default ContactHero;