'use client';

import Link from 'next/link';
import { House } from '@phosphor-icons/react';

/**
 * Composant Logo de l'application
 */
const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <img
        src="/images/Logo_Homees_Noir.png"
        alt="Logo Homees"
        className="h-14 w-14 object-contain"
      />
      <span className="text-xl font-bold text-gray-900">Homees</span>
    </Link>
  );
};

export default Logo; 