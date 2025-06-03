'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Home, Sparkles, Building, MapPin, DollarSign, Award, ArrowLeft, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'proprietaire' as 'proprietaire' | 'gestionnaire',
    // Champs gestionnaire
    nom_agence: '',
    description: '',
    zone_intervention: '',
    tarif_base: '',
    certifications: '',
    services_offerts: [] as string[],
    // Champs propriétaire
    type_investisseur: 'particulier' as 'particulier' | 'professionnel' | 'sci',
    nombre_biens: '',
    budget_investissement: '',
    zone_recherche: '',
    telephone: '',
    profession: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const servicesOptions = [
    'Gestion locative',
    'État des lieux',
    'Recherche locataire',
    'Assurance loyers impayés',
    'Conseil fiscal',
    'Gestion technique',
    'Suivi des travaux',
    'Comptabilité'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
      [name]: value
      }));
  };

  const handleServiceToggle = (service: string) => {
      setFormData(prev => ({
        ...prev,
      services_offerts: prev.services_offerts.includes(service)
        ? prev.services_offerts.filter(s => s !== service)
        : [...prev.services_offerts, service]
    }));
  };

  const validateStep1 = () => {
    setError('');
    
    if (!formData.nom.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    setError('');
    
    if (formData.role === 'gestionnaire') {
      if (!formData.nom_agence.trim()) {
        setError('Le nom de l\'agence est requis');
        return false;
      }
      if (!formData.zone_intervention.trim()) {
        setError('La zone d\'intervention est requise');
        return false;
      }
    } else if (formData.role === 'proprietaire') {
      if (!formData.telephone.trim()) {
        setError('Le téléphone est requis');
        return false;
      }
      if (!formData.zone_recherche.trim()) {
        setError('La zone de recherche est requise');
        return false;
      }
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      // Tous les utilisateurs passent à l'étape 2 pour compléter leur profil
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    // Validation finale
    if (currentStep === 2 && !validateStep2()) {
      setLoading(false);
      return;
    }

    try {
      // Créer l'utilisateur avec Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nom,
            role: formData.role
          }
        }
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Insérer dans la table utilisateurs personnalisée
        const { error: insertError } = await supabase
          .from('utilisateurs')
          .insert({
            id: data.user.id,
            nom: formData.nom,
            email: formData.email,
            rôle: formData.role,
            mot_de_passe_hash: 'handled_by_supabase_auth'
          });

        if (insertError) {
          console.error('Erreur lors de l\'insertion utilisateur:', insertError);
          setError('Erreur lors de la création du profil utilisateur');
        } else {
          // Créer le profil spécifique selon le rôle
          if (formData.role === 'gestionnaire') {
            const { error: profileError } = await supabase
              .from('profil_gestionnaire')
              .insert({
                utilisateur_id: data.user.id,
                nom_agence: formData.nom_agence,
                description: formData.description || null,
                zone_intervention: formData.zone_intervention,
                tarif_base: formData.tarif_base ? parseFloat(formData.tarif_base) : null,
                certifications: formData.certifications || null,
                services_offerts: formData.services_offerts
              });

            if (profileError) {
              console.error('Erreur lors de la création du profil gestionnaire:', profileError);
              setError('Compte créé mais erreur lors de la création du profil gestionnaire');
            } else {
              router.push('/dashboard');
            }
          } else if (formData.role === 'proprietaire') {
            const { error: profileError } = await supabase
              .from('profil_proprietaire')
              .insert({
                utilisateur_id: data.user.id,
                type_investisseur: formData.type_investisseur,
                nombre_biens: formData.nombre_biens ? parseInt(formData.nombre_biens) : 0,
                budget_investissement: formData.budget_investissement ? parseFloat(formData.budget_investissement) : null,
                zone_recherche: formData.zone_recherche,
                telephone: formData.telephone,
                profession: formData.profession || null
              });

            if (profileError) {
              console.error('Erreur lors de la création du profil propriétaire:', profileError);
              setError('Compte créé mais erreur lors de la création du profil propriétaire');
            } else {
              router.push('/dashboard');
            }
    } else {
            router.push('/dashboard');
          }
        }
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 items-center min-h-[85vh]">
        
        {/* Welcome Section - Left Side */}
        <div className="hidden lg:block text-white space-y-6">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8">
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="space-y-4">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              Étape {currentStep} sur 2
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {currentStep === 1 ? (
                <>
                  Rejoignez la <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    révolution
                  </span>
                  <br />immobilière
                </>
              ) : (
                <>
                  {formData.role === 'gestionnaire' ? 'Parlez-nous de' : 'Complétez votre'} <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {formData.role === 'gestionnaire' ? 'votre agence' : 'profil'}
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-purple-100 leading-relaxed">
              {currentStep === 1 
                ? "Créez votre compte Homees et accédez au meilleur comparateur de gestionnaires immobiliers."
                : formData.role === 'gestionnaire'
                  ? "Complétez vos informations professionnelles pour optimiser votre profil."
                  : "Quelques informations supplémentaires pour personnaliser votre expérience."
              }
            </p>
            
            <div className="space-y-3 pt-4">
              {currentStep === 1 ? (
                formData.role === 'proprietaire' ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Comparaison transparente des gestionnaires</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Accès à +300 gestionnaires certifiés</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Messagerie sécurisée intégrée</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Tableau de bord personnalisé</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Rejoignez notre réseau de gestionnaires</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Recevez des demandes de propriétaires</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Gérez vos mandats en ligne</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-purple-100">Développez votre clientèle</span>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-purple-100">
                      {formData.role === 'gestionnaire' ? 'Profil professionnel complet' : 'Profil personnalisé'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-purple-100">
                      {formData.role === 'gestionnaire' ? 'Visibilité optimisée sur la plateforme' : 'Recommandations personnalisées'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-purple-100">
                      {formData.role === 'gestionnaire' ? 'Matching intelligent avec les propriétaires' : 'Recherche optimisée de gestionnaires'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-purple-100">
                      {formData.role === 'gestionnaire' ? 'Outils de gestion avancés' : 'Suivi de vos projets immobiliers'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4 pt-6">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-emerald-400' : 'text-purple-300'}`}>
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Informations de base</span>
              </div>
              <div className="w-8 h-px bg-purple-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-emerald-400' : 'text-purple-300'}`}>
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Profil {formData.role === 'gestionnaire' ? 'professionnel' : 'personnel'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section - Right Side */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6 px-4">
            <Link href="/" className="inline-flex items-center text-white hover:text-gray-200 transition-colors mb-4">
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">
              Inscription - Étape {currentStep}/2
            </h1>
            <p className="text-purple-200 text-sm">
              {currentStep === 1 
                ? "Informations de base" 
                : formData.role === 'gestionnaire' 
                  ? "Profil professionnel" 
                  : "Profil personnel"
              }
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6 mx-4 lg:mx-0">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Je suis un(e) :
                  </label>
                  <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'proprietaire' }))}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                        formData.role === 'proprietaire'
                          ? 'border-emerald-400 bg-emerald-500/20 text-white'
                          : 'border-white/20 bg-white/10 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      <User className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Propriétaire</span>
            </button>
            <button
              type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'gestionnaire' }))}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                        formData.role === 'gestionnaire'
                          ? 'border-emerald-400 bg-emerald-500/20 text-white'
                          : 'border-white/20 bg-white/10 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      <Building className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Gestionnaire</span>
            </button>
          </div>
        </div>
        
                {/* Name Field */}
                  <div>
                  <label htmlFor="nom" className="block text-white font-medium mb-2 text-sm">
                    Nom complet
                    </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>

                {/* Email Field */}
                  <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                    Adresse email
                    </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                      placeholder="jean.dupont@exemple.com"
                    />
                  </div>
                  </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-white font-medium mb-2 text-sm">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      id="password"
                      name="password"
                        type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                        onChange={handleInputChange}
                      required
                        className="w-full pl-9 pr-10 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-white font-medium mb-2 text-sm">
                      Confirmer
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                        onChange={handleInputChange}
                      required
                        className="w-full pl-9 pr-10 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center text-sm mt-6"
                >
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
            )}

            {/* Step 2: Professional Information (Gestionnaire only) */}
            {currentStep === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-white font-semibold text-lg">
                    {formData.role === 'gestionnaire' ? 'Informations professionnelles' : 'Informations personnelles'}
                  </h3>
                  <p className="text-purple-200 text-sm">
                    {formData.role === 'gestionnaire' 
                      ? 'Complétez votre profil gestionnaire' 
                      : 'Complétez votre profil propriétaire'
                    }
                  </p>
                </div>

                {formData.role === 'gestionnaire' ? (
                  /* Formulaire Gestionnaire */
                  <div className="space-y-4">
                    {/* Nom agence + Zone intervention */}
                    <div>
                      <label htmlFor="nom_agence" className="block text-white font-medium mb-2 text-sm">
                        Nom de l'agence *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          id="nom_agence"
                          name="nom_agence"
                          type="text"
                          value={formData.nom_agence}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                          placeholder="Mon Agence Immo"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="zone_intervention" className="block text-white font-medium mb-2 text-sm">
                        Zone d'intervention *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          id="zone_intervention"
                          name="zone_intervention"
                          type="text"
                          value={formData.zone_intervention}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                          placeholder="Paris, 75001-75020"
                        />
                      </div>
                    </div>

                    {/* Tarif de base + Certifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="tarif_base" className="block text-white font-medium mb-2 text-sm">
                          Tarif de base (%)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            id="tarif_base"
                            name="tarif_base"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.tarif_base}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                            placeholder="8.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="certifications" className="block text-white font-medium mb-2 text-sm">
                          Certifications
                        </label>
                        <div className="relative">
                          <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                            id="certifications"
                            name="certifications"
                            type="text"
                            value={formData.certifications}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                            placeholder="FNAIM, UNIS..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-white font-medium mb-2 text-sm">
                        Description de votre agence
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm resize-none"
                        placeholder="Présentez votre agence, votre expérience, vos valeurs..."
                      />
                    </div>

                    {/* Services offerts */}
                    <div>
                      <label className="block text-white font-medium mb-2 text-sm">
                        Services proposés
                          </label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {servicesOptions.map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            className={`p-2 rounded-lg border transition-all text-xs ${
                              formData.services_offerts.includes(service)
                                ? 'border-emerald-400 bg-emerald-500/20 text-white'
                                : 'border-white/20 bg-white/10 text-purple-200 hover:bg-white/20'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Formulaire Propriétaire */
                  <div className="space-y-4">
                    {/* Type investisseur */}
                    <div>
                      <label className="block text-white font-medium mb-2 text-sm">
                        Type d'investisseur
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['particulier', 'professionnel', 'sci'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type_investisseur: type as any }))}
                            className={`p-2.5 rounded-lg border transition-all text-xs font-medium ${
                              formData.type_investisseur === type
                                ? 'border-emerald-400 bg-emerald-500/20 text-white'
                                : 'border-white/20 bg-white/10 text-purple-200 hover:bg-white/20'
                            }`}
                          >
                            {type === 'sci' ? 'SCI' : type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Téléphone (full width sur mobile) */}
                    <div>
                      <label htmlFor="telephone" className="block text-white font-medium mb-2 text-sm">
                        Téléphone *
                      </label>
                      <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    
                    {/* Zone de recherche */}
                    <div>
                      <label htmlFor="zone_recherche" className="block text-white font-medium mb-2 text-sm">
                        Zone de recherche *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                          id="zone_recherche"
                          name="zone_recherche"
                        type="text"
                          value={formData.zone_recherche}
                          onChange={handleInputChange}
                        required
                          className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                          placeholder="Paris, Lyon, Marseille..."
                        />
                      </div>
                    </div>

                    {/* Informations complémentaires */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="nombre_biens" className="block text-white font-medium mb-2 text-sm">
                          Nombre de biens
                        </label>
                        <input
                          id="nombre_biens"
                          name="nombre_biens"
                          type="number"
                          min="0"
                          value={formData.nombre_biens}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                          placeholder="2"
                      />
                    </div>
                    
                    <div>
                        <label htmlFor="profession" className="block text-white font-medium mb-2 text-sm">
                          Profession
                      </label>
                        <input
                          id="profession"
                          name="profession"
                          type="text"
                          value={formData.profession}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                          placeholder="Ingénieur, Médecin..."
                        />
                      </div>
                    </div>
                    
                    {/* Budget investissement */}
                    <div>
                      <label htmlFor="budget_investissement" className="block text-white font-medium mb-2 text-sm">
                        Budget d'investissement (€)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                          id="budget_investissement"
                          name="budget_investissement"
                          type="number"
                          min="0"
                          value={formData.budget_investissement}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                          placeholder="250000"
                        />
                      </div>
                    </div>
                  </div>
            )}
            
                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center text-sm"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </button>
                <button
                  type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Créer mon compte
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                </button>
              </div>
              </form>
            )}

            {/* Footer Links */}
            {currentStep === 1 && (
              <>
                <div className="my-4 flex items-center">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-3 text-purple-200 text-xs">ou</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                <div className="text-center">
                  <p className="text-purple-200 mb-3 text-sm">
                    Vous avez déjà un compte ?
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg font-medium text-sm w-full justify-center"
                  >
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
            </div>

                <div className="mt-4 text-center">
                  <p className="text-purple-200 text-xs">
                    En créant un compte, vous acceptez nos{' '}
                    <Link href="/cgu" className="text-white hover:underline">
                      CGU
                    </Link>{' '}
                    et{' '}
                    <Link href="/confidentialite" className="text-white hover:underline">
                      politique de confidentialité
              </Link>
            </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

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
