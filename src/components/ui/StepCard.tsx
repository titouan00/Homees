'use client';

/**
 * Interface pour les props du StepCard
 */
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Composant réutilisable pour afficher une étape du processus
 * Utilisé dans la section "Comment ça marche"
 */
export default function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="text-center relative group">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
        {/* Numéro de l'étape et icône */}
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
        
        {/* Titre et description */}
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-purple-100 leading-relaxed">{description}</p>
      </div>
    </div>
  );
} 