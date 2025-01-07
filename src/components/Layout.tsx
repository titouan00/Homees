import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Homees</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              {isLanding ? (
                <>
                  <a href="#features" className="text-gray-600 hover:text-blue-600">Fonctionnalités</a>
                  <a href="#benefits" className="text-gray-600 hover:text-blue-600">Avantages</a>
                  <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                  <Link to="/messagerie" className="text-gray-600 hover:text-blue-600">Messagerie</Link>
                  <Link to="/assistance" className="text-gray-600 hover:text-blue-600">Assistance</Link>
                </>
              )}
            </div>
            {isLanding ? (
              <Link to="/inscription" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Commencer
              </Link>
            ) : (
              <Link to="/profile" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Mon Profil
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Homees</span>
              </div>
              <p className="text-gray-400">
                Simplifiez la gestion de vos biens immobiliers avec notre plateforme tout-en-un.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Fonctionnalités</Link></li>
                <li><Link to="/" className="hover:text-white">Tarifs</Link></li>
                <li><Link to="/assistance" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">À propos</Link></li>
                <li><Link to="/" className="hover:text-white">Blog</Link></li>
                <li><Link to="/" className="hover:text-white">Carrières</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/assistance" className="hover:text-white">Support</Link></li>
                <li><Link to="/" className="hover:text-white">Sales</Link></li>
                <li><Link to="/" className="hover:text-white">Presse</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Homees. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;