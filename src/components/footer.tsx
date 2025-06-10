'use client';

import Link from 'next/link';
import { Home, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Homees</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              La plateforme qui connecte propriétaires et gestionnaires immobiliers certifiés 
              avec transparence et simplicité.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contact@homees.fr</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors">Accueil</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Compte</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-gray-300 hover:text-emerald-400 transition-colors">Se connecter</Link></li>
              <li><Link href="/signup" className="text-gray-300 hover:text-emerald-400 transition-colors">S'inscrire</Link></li>
            </ul>
          </div>

        </div>

        {/* Ligne de séparation et copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Homees. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



