"use client";

import { useState } from 'react';
import Link from 'next/link';
import { PaperPlaneTilt, ArrowRight, Sparkle } from 'phosphor-react';
import AuthBackground from '@/components/ui/AuthBackground';
import AuthCard from '@/components/ui/AuthCard';
import AuthInput from '@/components/ui/AuthInput';
import AuthButton from '@/components/ui/AuthButton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/contact/SuccessMessage';

/**
 * Page Contact optimisée avec les composants UI réutilisables
 * Design préservé à 100% avec architecture modulaire
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    typeUtilisateur: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error on input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation simple
    if (!formData.nom.trim() || !formData.email.trim() || !formData.typeUtilisateur || !formData.message.trim()) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ nom: '', email: '', typeUtilisateur: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <>
      <section className="relative h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden flex items-center">
        <AuthBackground />
        
        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Héro Section */}
            <div className="text-center lg:text-left">
              <Link 
                href="/" 
                className="inline-flex items-center text-white/80 hover:text-white transition-colors font-medium mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Retour à l'accueil
              </Link>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Une question ?<br/>
                <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                  Nous sommes là
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 mb-6 max-w-2xl mx-auto lg:mx-0">
                Notre équipe d'experts est disponible pour répondre à toutes vos questions 
                et vous accompagner dans votre projet immobilier.
              </p>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkle className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-white font-semibold">Plateforme de mise en relation</h3>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Homees connecte propriétaires et gestionnaires immobiliers certifiés 
                  avec transparence et simplicité.
                </p>
              </div>
            </div>

            {/* Formulaire de Contact Optimisé */}
            <div className="max-w-lg mx-auto lg:mx-0">
              <AuthCard>
                <h2 className="text-2xl font-bold text-white mb-5 text-center">Envoyez-nous un message</h2>
                
                <SuccessMessage show={success} />
                <ErrorMessage message={error} className="mb-4" />

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                      label="Nom complet *"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                      required
                    />
                    <AuthInput
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean@exemple.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">Vous êtes *</label>
                    <select
                      name="typeUtilisateur"
                      value={formData.typeUtilisateur}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                    >
                      <option value="" className="text-gray-800">Sélectionnez votre profil</option>
                      <option value="proprietaire" className="text-gray-800">Propriétaire - Je cherche un gestionnaire</option>
                      <option value="gestionnaire" className="text-gray-800">Gestionnaire - Je veux rejoindre la plateforme</option>
                      <option value="autre" className="text-gray-800">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">Votre message *</label>
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

                  <AuthButton
                    type="submit"
                    loading={loading}
                    icon={PaperPlaneTilt}
                    iconPosition="right"
                  >
                    Envoyer le message
                  </AuthButton>
                </form>
              </AuthCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
