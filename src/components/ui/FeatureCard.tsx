'use client';

/**
 * Interface pour les props du FeatureCard
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

/**
 * Composant réutilisable pour afficher une carte de fonctionnalité
 * Utilisé dans la section des fonctionnalités
 */
export default function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
      {/* En-tête avec icône */}
      <div className={`${color} p-8 flex items-center justify-center`}>
        <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
      </div>
      
      {/* Contenu de la carte */}
      <div className="bg-white p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
} 