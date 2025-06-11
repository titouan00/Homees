'use client';

import Link from 'next/link';
import { House } from 'phosphor-react';

/**
 * Composant Logo de l'application
 */
const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
        <House className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900">Homees</span>
    </Link>
  );
};

export default Logo; 