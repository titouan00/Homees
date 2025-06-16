'use client';

import { PaperPlaneTilt } from '@phosphor-icons/react';
import { useContactForm } from '../forms/useContactForm';
import SuccessMessage from './SuccessMessage';

/**
 * Composant formulaire de contact - Design préservé exactement
 */
const ContactForm: React.FC = () => {
  const { formData, state, handleInputChange, handleSubmit, userTypeOptions } = useContactForm();

  return (
    <div className="max-w-lg mx-auto lg:mx-0">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-5 text-center">Envoyez-nous un message</h2>
        
        <SuccessMessage show={state.success} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Nom complet *
              </label>
              <input
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                placeholder="jean@exemple.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Vous êtes *
            </label>
            <select
              name="typeUtilisateur"
              value={formData.typeUtilisateur}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
            >
              {userTypeOptions.map(option => (
                <option key={option.value} value={option.value} className="text-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Votre message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none text-sm"
              placeholder="Décrivez votre demande..."
            />
          </div>

          <button
            type="submit"
            disabled={state.loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {state.loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Envoyer le message
                <PaperPlaneTilt className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm; 