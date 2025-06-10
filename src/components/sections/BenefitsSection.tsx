'use client';

import Link from 'next/link';
import { Clock, Shield, Target, MessageCircle, BarChart, Star, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import BenefitItem from '@/components/ui/BenefitItem';

/**
 * Données des avantages à afficher
 */
const benefitsData = [
  {
    icon: <Clock className="h-6 w-6" />,
    text: "Économisez du temps précieux en comparant toutes les offres en un seul endroit"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    text: "Accédez à des gestionnaires certifiés et rigoureusement évalués"
  },
  {
    icon: <Target className="h-6 w-6" />,
    text: "Bénéficiez de tarifs négociés et d'une transparence totale"
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    text: "Communiquez facilement via notre messagerie intégrée sécurisée"
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    text: "Suivez vos demandes et mandats depuis votre tableau de bord personnalisé"
  }
];

/**
 * Données des cartes d'avantages (grille droite)
 */
const benefitCardsData = [
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Trouvez le bon gestionnaire en quelques minutes au lieu de plusieurs jours de recherche",
    bgColor: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-600"
  },
  {
    icon: Shield,
    title: "Sécurité garantie", 
    description: "Tous nos partenaires sont vérifiés, certifiés et régulièrement évalués",
    bgColor: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-600"
  },
  {
    icon: Star,
    title: "Transparence totale",
    description: "Avis authentiques et vérifiés de clients réels pour vous aider à choisir",
    bgColor: "from-amber-50 to-amber-100",
    iconBg: "bg-amber-600"
  },
  {
    icon: Sparkles,
    title: "Économies réelles",
    description: "Comparez les tarifs et économisez jusqu'à 30% sur vos frais de gestion",
    bgColor: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-600"
  }
];

/**
 * Composant pour une carte d'avantage individuelle
 */
interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
  iconBg: string;
}

function BenefitCard({ icon: Icon, title, description, bgColor, iconBg }: BenefitCardProps) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
      <div className={`h-16 w-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

/**
 * Section des avantages détaillés pour les propriétaires
 * Présente les bénéfices de l'utilisation de la plateforme
 */
export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-white relative overflow-hidden" data-animate>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contenu gauche */}
          <div>
            <span className="bg-amber-100 text-amber-700 px-6 py-2 rounded-full text-sm font-medium mb-6 inline-block">
              Pour les propriétaires
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Des avantages exclusifs qui font la différence
            </h2>
            
            {/* Liste des avantages */}
            <div className="space-y-6 mb-10">
              {benefitsData.map((benefit, index) => (
                <BenefitItem key={index} {...benefit} />
              ))}
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center justify-center"
              >
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/signup" 
                className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 shadow-md hover:shadow-lg font-semibold inline-flex items-center justify-center"
              >
                Explorer les gestionnaires
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Grille des cartes d'avantages (droite) */}
          <div className="grid grid-cols-2 gap-6">
            {benefitCardsData.map((card, index) => (
              <BenefitCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 