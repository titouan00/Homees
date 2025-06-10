'use client';

import { Building, Users, Star, MapPin } from 'lucide-react';

/**
 * Données des statistiques à afficher
 */
const statsData = [
  {
    icon: Building,
    value: "300+",
    label: "Gestionnaires",
    bgColor: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-600",
    textColor: "text-blue-600"
  },
  {
    icon: Users,
    value: "5000+",
    label: "Propriétaires", 
    bgColor: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-600",
    textColor: "text-emerald-600"
  },
  {
    icon: Star,
    value: "98%",
    label: "Satisfaction",
    bgColor: "from-amber-50 to-amber-100", 
    iconBg: "bg-amber-600",
    textColor: "text-amber-600"
  },
  {
    icon: MapPin,
    value: "25+",
    label: "Villes",
    bgColor: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-600", 
    textColor: "text-purple-600"
  }
];

/**
 * Composant pour une carte de statistique individuelle
 */
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  bgColor: string;
  iconBg: string;
  textColor: string;
}

function StatCard({ icon: Icon, value, label, bgColor, iconBg, textColor }: StatCardProps) {
  return (
    <div className={`text-center p-6 bg-gradient-to-br ${bgColor} rounded-2xl hover:shadow-lg transition-all transform hover:scale-105`}>
      <div className={`h-16 w-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <p className={`text-3xl font-bold ${textColor} mb-2`}>{value}</p>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}

/**
 * Section des statistiques de confiance
 * Affiche les chiffres clés de la plateforme
 */
export default function StatsSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden" data-animate>
      {/* Élément décoratif d'arrière-plan */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600">Des chiffres qui parlent d'eux-mêmes</p>
        </div>
        
        {/* Grille des statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
} 