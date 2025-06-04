"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Send, 
  ArrowRight, 
  CheckCircle, 
  Mail,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    typeUtilisateur: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ nom: '', email: '', typeUtilisateur: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 py-1">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Side - Content */}
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
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-white font-semibold">Plateforme de mise en relation</h3>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Homees connecte propriétaires et gestionnaires immobiliers certifiés 
                  avec transparence et simplicité.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-5 text-center">Envoyez-nous un message</h2>
                
                {success && (
                  <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4 mb-6 flex items-center animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-emerald-300 font-semibold text-sm">Message envoyé !</h3>
                      <p className="text-emerald-200 text-xs">Nous vous répondrons rapidement.</p>
                    </div>
                  </div>
                )}

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
                      <option value="" className="text-gray-800">Sélectionnez votre profil</option>
                      <option value="proprietaire" className="text-gray-800">Propriétaire - Je cherche un gestionnaire</option>
                      <option value="gestionnaire" className="text-gray-800">Gestionnaire - Je veux rejoindre la plateforme</option>
                      <option value="autre" className="text-gray-800">Autre demande</option>
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
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CSS for animations */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes blob {
          0% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(120deg); }
          66% { transform: scale(0.9) rotate(240deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        .animate-blob {
          animation: blob 8s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
