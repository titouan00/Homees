'use client';

import Link from 'next/link';
import { useState } from 'react';
import { List, X, House } from '@phosphor-icons/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
              <House className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Homees</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
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

          {/* Bouton List Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* List Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <Link
                href="/login"
                className="block text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2 mb-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium text-center shadow-sm hover:shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
  