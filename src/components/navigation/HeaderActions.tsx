'use client';

import Link from 'next/link';

/**
 * Composant actions du header - Design préservé exactement
 */
const HeaderActions: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        href="/login"
        className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
      >
        Se connecter
      </Link>
      <Link
        href="/signup"
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-sm hover:shadow-md"
      >
        S'inscrire
      </Link>
    </div>
  );
};

export default HeaderActions; 