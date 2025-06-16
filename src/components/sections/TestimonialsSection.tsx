'use client';

import { Star, Heart, TrendUp, Medal } from '@phosphor-icons/react';

/**
 * Données des témoignages clients
 */
const testimonialsData = [
  {
    name: "Michel Dubois",
    role: "Propriétaire de 3 biens",
    initial: "M",
    gradient: "from-blue-400 to-blue-600",
    borderColor: "border-blue-100",
    testimonial: "J'ai trouvé un excellent gestionnaire pour mes trois appartements en moins d'une semaine. Le processus était simple, transparent et très efficace.",
    benefit: "Économie de 25% sur les frais",
    benefitIcon: <Heart className="h-4 w-4 mr-2" />,
    benefitColor: "text-blue-600"
  },
  {
    name: "Sophie Laurent", 
    role: "Investisseuse immobilière",
    initial: "S",
    gradient: "from-emerald-400 to-emerald-600",
    borderColor: "border-emerald-100",
    testimonial: "La comparaison des offres m'a permis d'économiser près de 30% sur mes frais de gestion. Je recommande vivement Homees à tous les propriétaires!",
    benefit: "Rentabilité augmentée de 15%",
    benefitIcon: <TrendUp className="h-4 w-4 mr-2" />,
    benefitColor: "text-emerald-600"
  },
  {
    name: "Pierre Moreau",
    role: "Propriétaire bailleur", 
    initial: "P",
    gradient: "from-amber-400 to-amber-600",
    borderColor: "border-amber-100",
    testimonial: "Interface intuitive et service client réactif. J'apprécie particulièrement la transparence des avis clients et la facilité de comparaison.",
    benefit: "Service 5 étoiles garanti",
    benefitIcon: <Medal className="h-4 w-4 mr-2" />,
    benefitColor: "text-amber-600"
  }
];

/**
 * Composant pour une carte de témoignage individuelle
 */
interface TestimonialCardProps {
  name: string;
  role: string;
  initial: string;
  gradient: string;
  borderColor: string;
  testimonial: string;
  benefit: string;
  benefitIcon: React.ReactNode;
  benefitColor: string;
}

function TestimonialCard({ 
  name, 
  role, 
  initial, 
  gradient, 
  borderColor, 
  testimonial, 
  benefit, 
  benefitIcon, 
  benefitColor 
}: TestimonialCardProps) {
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border ${borderColor}`}>
      {/* En-tête avec avatar et infos */}
      <div className="flex items-center mb-6">
        <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl`}>
          {initial}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-lg text-gray-900">{name}</h4>
          <p className="text-gray-600">{role}</p>
          <div className="flex text-amber-500 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Témoignage */}
      <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
        "{testimonial}"
      </p>
      
      {/* Bénéfice obtenu */}
      <div className={`flex items-center text-sm ${benefitColor}`}>
        {benefitIcon}
        {benefit}
      </div>
    </div>
  );
}

/**
 * Section des témoignages clients
 * Affiche les retours d'expérience de propriétaires satisfaits
 */
export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden" data-animate>
      {/* Élément décoratif d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* En-tête de section */}
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
        
        {/* Grille des témoignages */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
} 