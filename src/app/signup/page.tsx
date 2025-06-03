'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, User, ArrowRight, Home } from 'lucide-react';

export default function SignupPage() {
  const [userType, setUserType] = useState<'proprietaire' | 'gestionnaire'>('proprietaire');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Données communes
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    
    // Données propriétaire
    nombreBiens: '',
    typesBiens: [] as string[],
    
    // Données gestionnaire
    nomEntreprise: '',
    siret: '',
    adresse: '',
    zonesIntervention: '',
    services: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'typesBiens') {
      setFormData(prev => ({
        ...prev,
        typesBiens: checked 
          ? [...prev.typesBiens, value] 
          : prev.typesBiens.filter(type => type !== value)
      }));
    } else if (name === 'services') {
      setFormData(prev => ({
        ...prev,
        services: checked 
          ? [...prev.services, value] 
          : prev.services.filter(service => service !== value)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Simulation d'envoi du formulaire
      console.log('Données du formulaire:', formData);
      alert('Inscription réussie ! Vous allez être redirigé vers votre tableau de bord.');
      // Redirection vers le tableau de bord (à implémenter)
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Créez votre compte Homees
        </h1>
        
        {/* Sélection du type d'utilisateur */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={() => setUserType('proprietaire')}
              className={`flex-1 flex flex-col items-center p-6 rounded-lg border-2 ${
                userType === 'proprietaire' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Home className={`h-12 w-12 mb-4 ${userType === 'proprietaire' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium ${userType === 'proprietaire' ? 'text-blue-600' : 'text-gray-700'}`}>
                Je suis propriétaire
              </h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Je cherche un gestionnaire pour mes biens
              </p>
            </button>
            
            <button
              type="button"
              onClick={() => setUserType('gestionnaire')}
              className={`flex-1 flex flex-col items-center p-6 rounded-lg border-2 ${
                userType === 'gestionnaire' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`h-12 w-12 mb-4 ${userType === 'gestionnaire' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium ${userType === 'gestionnaire' ? 'text-blue-600' : 'text-gray-700'}`}>
                Je suis gestionnaire
              </h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Je propose mes services de gestion immobilière
              </p>
            </button>
          </div>
        </div>
        
        {/* Formulaire d'inscription */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <h2 className="text-xl font-semibold mb-6">Informations de base</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  {userType === 'proprietaire' ? 'Informations sur vos biens' : 'Informations sur votre entreprise'}
                </h2>
                
                {userType === 'proprietaire' ? (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nombreBiens" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de biens à gérer
                      </label>
                      <select
                        id="nombreBiens"
                        name="nombreBiens"
                        value={formData.nombreBiens}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="1">1 bien</option>
                        <option value="2-5">2 à 5 biens</option>
                        <option value="6-10">6 à 10 biens</option>
                        <option value="10+">Plus de 10 biens</option>
                      </select>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-3">
                        Types de biens
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {['Appartement', 'Maison', 'Studio', 'Commerce', 'Bureau', 'Autre'].map((type) => (
                          <label key={type} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="typesBiens"
                              value={type}
                              checked={formData.typesBiens.includes(type)}
                              onChange={handleCheckboxChange}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nomEntreprise" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        id="nomEntreprise"
                        name="nomEntreprise"
                        value={formData.nomEntreprise}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro SIRET
                      </label>
                      <input
                        type="text"
                        id="siret"
                        name="siret"
                        value={formData.siret}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zonesIntervention" className="block text-sm font-medium text-gray-700 mb-1">
                        Zones d'intervention
                      </label>
                      <textarea
                        id="zonesIntervention"
                        name="zonesIntervention"
                        value={formData.zonesIntervention}
                        onChange={handleChange}
                        placeholder="Ex: Paris, Hauts-de-Seine, Val-de-Marne"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-3">
                        Services proposés
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {['Gestion locative', 'État des lieux', 'Recherche locataire', 'Assurance loyers impayés', 'Conseil fiscal', 'Gestion technique'].map((service) => (
                          <label key={service} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="services"
                              value={service}
                              checked={formData.services.includes(service)}
                              onChange={handleCheckboxChange}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="mt-8 flex justify-between items-center">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Retour
                </button>
              )}
              <div className={step === 1 ? 'w-full flex justify-end' : ''}>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center"
                >
                  {step === 1 ? 'Continuer' : 'Créer mon compte'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
