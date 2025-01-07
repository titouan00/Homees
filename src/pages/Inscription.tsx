import React, { useState } from 'react';
import { UserCircle2, Mail, Lock, Building2 } from 'lucide-react';

function Inscription() {
  const [role, setRole] = useState('proprietaire');

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-600 mt-2">Rejoignez Homees et simplifiez la gestion de vos biens</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            <button
              className={`px-6 py-2 rounded-lg ${
                role === 'proprietaire'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setRole('proprietaire')}
            >
              Propriétaire
            </button>
            <button
              className={`px-6 py-2 rounded-lg ${
                role === 'gestionnaire'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setRole('gestionnaire')}
            >
              Gestionnaire
            </button>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {role === 'gestionnaire' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'entreprise"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}

export default Inscription;