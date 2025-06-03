"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Send, MapPin, Clock, ArrowRight, Users, Headphones, Zap, CheckCircle, Star, MessageSquare } from 'lucide-react';
import Chatbot from '@/components/Chatbot';

type Tab = 'contact' | 'form' | 'info';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contact');
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
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
      setFormData({ nom: '', email: '', sujet: '', message: '' });
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "01 23 45 67 89",
      subtitle: "Lun-Ven, 9h-18h",
      color: "emerald",
      action: "Appeler",
      highlight: "Réponse immédiate"
    },
    {
      icon: Mail,
      title: "Email",
      value: "contact@homees.fr",
      subtitle: "Réponse sous 2h",
      color: "blue",
      action: "Écrire",
      highlight: "Support prioritaire"
    },
    {
      icon: MessageCircle,
      title: "Chat IA",
      value: "Assistant intelligent",
      subtitle: "Disponible 24h/7j",
      color: "amber",
      action: "Chatter",
      highlight: "Aide instantanée"
    },
    {
      icon: Users,
      title: "Rendez-vous",
      value: "Consultation gratuite",
      subtitle: "Sur rendez-vous",
      color: "purple",
      action: "Planifier",
      highlight: "Conseils personnalisés"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      purple: "bg-purple-500/10 border-purple-500/20 text-purple-400"
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const getButtonClasses = (color: string) => {
    const colors = {
      emerald: "bg-emerald-500 hover:bg-emerald-600",
      blue: "bg-blue-500 hover:bg-blue-600",
      amber: "bg-amber-500 hover:bg-amber-600",
      purple: "bg-purple-500 hover:bg-purple-600"
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const tabs = [
    { id: 'contact' as Tab, label: 'Contact', icon: Phone },
    { id: 'form' as Tab, label: 'Message', icon: MessageSquare },
    { id: 'info' as Tab, label: 'Infos', icon: MapPin }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      {/* Header */}
      <div className="relative z-10 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-white hover:text-gray-200 transition-colors">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Retour à l'accueil
            </Link>
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-white">Contactez-nous</h1>
              <p className="text-purple-100 text-sm md:text-base">Une question ? Nous sommes là pour vous aider</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative z-10 px-6 py-6 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full">
          
          {/* Contact Methods Tab */}
          {activeTab === 'contact' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-xl text-white font-semibold mb-2">Comment souhaitez-vous nous contacter ?</h2>
                <p className="text-purple-200 text-sm">Choisissez la méthode qui vous convient le mieux</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer group h-full flex flex-col"
                    >
                      <div className="text-center flex-1 flex flex-col justify-between">
                        {/* Icon & Badge */}
                        <div className="relative mb-4">
                          <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getColorClasses(method.color)}`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                            {method.highlight}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                          <h3 className="text-white font-bold text-lg mb-2">{method.title}</h3>
                          <p className="text-purple-200 font-semibold text-sm mb-1">{method.value}</p>
                          <p className="text-purple-300 text-xs">{method.subtitle}</p>
                        </div>

                        {/* Action Button */}
                        <button className={`w-full text-white py-2.5 rounded-lg transition-all font-medium text-sm group-hover:scale-105 ${getButtonClasses(method.color)}`}>
                          {method.action}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl py-3 px-4">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 font-bold text-lg">&lt;2h</span>
                  </div>
                  <p className="text-purple-200 text-xs">Temps de réponse</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl py-3 px-4">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-4 w-4 text-amber-400 mr-1" />
                    <span className="text-amber-400 font-bold text-lg">98%</span>
                  </div>
                  <p className="text-purple-200 text-xs">Satisfaction</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl py-3 px-4">
                  <div className="flex items-center justify-center mb-1">
                    <Headphones className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 font-bold text-lg">24/7</span>
                  </div>
                  <p className="text-purple-200 text-xs">Disponibilité IA</p>
                </div>
              </div>
            </div>
          )}

          {/* Message Form Tab */}
          {activeTab === 'form' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-4">
                <h2 className="text-xl text-white font-semibold mb-2">Envoyez-nous un message</h2>
                <p className="text-purple-200 text-sm">Nous vous répondrons dans les plus brefs délais</p>
              </div>

              {success && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                  <p className="text-emerald-200">Message envoyé avec succès ! Nous vous répondrons sous 2h.</p>
                </div>
              )}

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nom" className="block text-white font-medium mb-1 text-sm">
                        Nom complet *
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                        placeholder="Jean Dupont"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-1 text-sm">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                        placeholder="jean.dupont@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sujet" className="block text-white font-medium mb-1 text-sm">
                      Sujet *
                    </label>
                    <select
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    >
                      <option value="" className="text-gray-800">Sélectionnez un sujet</option>
                      <option value="question-generale" className="text-gray-800">Question générale</option>
                      <option value="support-technique" className="text-gray-800">Support technique</option>
                      <option value="partenariat" className="text-gray-800">Devenir partenaire gestionnaire</option>
                      <option value="tarifs" className="text-gray-800">Questions sur les tarifs</option>
                      <option value="autre" className="text-gray-800">Autre</option>
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label htmlFor="message" className="block text-white font-medium mb-1 text-sm">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="flex-1 row-span-2 min-h-[120px] px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-xl text-white font-semibold mb-2">Informations pratiques</h2>
                <p className="text-purple-200 text-sm">Tout ce que vous devez savoir pour nous contacter</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 flex-1">
                {/* Bureau & Horaires */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-emerald-400" />
                    Nos bureaux
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-purple-200 font-medium">Adresse</p>
                      <p className="text-white">123 Avenue des Champs-Élysées</p>
                      <p className="text-white">75008 Paris, France</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-400" />
                      <div>
                        <p className="text-purple-200 text-sm">Horaires d'ouverture</p>
                        <p className="text-white text-sm">Lundi - Vendredi : 9h00 - 18h00</p>
                        <p className="text-purple-300 text-xs">Weekend : Chat IA uniquement</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Rapide */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-400" />
                    Questions fréquentes
                  </h3>
                  <div className="space-y-3">
                    <div className="hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                      <p className="text-purple-200 text-sm font-medium">• Comment fonctionne le comparateur ?</p>
                      <p className="text-purple-300 text-xs mt-1">3 étapes simples pour trouver votre gestionnaire</p>
                    </div>
                    <div className="hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                      <p className="text-purple-200 text-sm font-medium">• Quels sont les tarifs ?</p>
                      <p className="text-purple-300 text-xs mt-1">100% gratuit pour les propriétaires</p>
                    </div>
                    <div className="hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                      <p className="text-purple-200 text-sm font-medium">• Comment devenir partenaire ?</p>
                      <p className="text-purple-300 text-xs mt-1">Candidature en ligne pour gestionnaires</p>
                    </div>
                    <div className="hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                      <p className="text-purple-200 text-sm font-medium">• Zones de couverture ?</p>
                      <p className="text-purple-300 text-xs mt-1">Paris actuellement, expansion prévue</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-6 text-center">
                <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl p-4 border border-white/20">
                  <p className="text-white font-medium mb-2">Pas trouvé votre réponse ?</p>
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => setActiveTab('form')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Nous écrire
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      Chat IA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* CSS Animations */}
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
      `}</style>
    </div>
  );
}
