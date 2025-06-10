'use client';

/**
 * Interface pour les props du BenefitItem
 */
interface BenefitItemProps {
  text: string;
  icon: React.ReactNode;
}

/**
 * Composant réutilisable pour afficher un élément de bénéfice/avantage
 * Utilisé dans la section des avantages
 */
export default function BenefitItem({ text, icon }: BenefitItemProps) {
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