'use client';

import { useState, useEffect } from 'react';
import { MapPin, Building, Euro, Star, Phone, Mail, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// Données de test pour le gestionnaire
const gestionnaireTest = {
  id: 1,
  nom: "Agence Immobilière Centrale",
  image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
  logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
  adresse: "123 Rue de Paris, 75001 Paris",
  telephone: "01 23 45 67 89",
  email: "contact@agencecentrale.fr",
  description: "Agence immobilière spécialisée dans la gestion locative depuis plus de 15 ans. Notre équipe de professionnels vous accompagne dans toutes vos démarches de gestion immobilière avec un suivi personnalisé et une expertise reconnue.",
  note: 4.8,
  avis: [
    { id: 1, auteur: "Jean D.", date: "12/05/2023", note: 5, commentaire: "Excellent service, très réactif et professionnel." },
    { id: 2, auteur: "Marie L.", date: "28/03/2023", note: 4, commentaire: "Bonne gestion de mon appartement, quelques délais parfois dans les réponses." },
    { id: 3, auteur: "Pierre M.", date: "15/01/2023", note: 5, commentaire: "Je recommande vivement cette agence pour leur sérieux et leur expertise." }
  ],
  services: [
    { nom: "Gestion locative complète", description: "Gestion administrative, technique et comptable de votre bien", prix: "5.9% du loyer" },
    { nom: "État des lieux", description: "Réalisation des états des lieux d'entrée et de sortie", prix: "3€/m²" },
    { nom: "Assurance loyers impayés", description: "Protection contre les loyers impayés et les dégradations", prix: "2.5% du loyer" },
    { nom: "Déclaration fiscale", description: "Préparation de votre déclaration de revenus fonciers", prix: "80€/an" }
  ],
  certifications: ["FNAIM", "GALIAN", "Chambre des propriétaires"],
  zones: ["Paris", "Hauts-de-Seine", "Val-de-Marne"]
};

export default function GestionnairePage({ params }: { params: { id: string } }) {
  const [gestionnaire, setGestionnaire] = useState(gestionnaireTest);
  const [activeTab, setActiveTab] = useState('services');
  
  // Dans un cas réel, on récupérerait les données du gestionnaire via une API
  useEffect(() => {
    // Simulation d'un appel API
    console.log(`Chargement du gestionnaire avec l'ID: ${params.id}`);
    // setGestionnaire(data);
  }, [params.id]);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 h-64 md:h-auto md:w-64 relative">
            <img 
              src={gestionnaire.image} 
              alt={gestionnaire.nom}
              className="h-full w-full object-cover" 
            />
          </div>
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow mr-4">
                  <img 
                    src={gestionnaire.logo} 
                    alt={`Logo ${gestionnaire.nom}`}
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{gestionnaire.nom}</h1>
                  <p className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {gestionnaire.adresse}
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-medium text-lg">{gestionnaire.note}</span>
                <span className="text-gray-500 text-sm ml-1">({gestionnaire.avis.length} avis)</span>
              </div>
            </div>
            
            <p className="mt-6 text-gray-700">{gestionnaire.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{gestionnaire.telephone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{gestionnaire.email}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {gestionnaire.certifications.map((certification, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {certification}
                </span>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contacter
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Services et tarifs
            </button>
            <button
              onClick={() => setActiveTab('avis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'avis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Avis clients
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'zones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Zones d'intervention
            </button>
          </nav>
        </div>
      </div>
      
      {/* Contenu des onglets */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === 'services' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Services proposés</h2>
            <div className="space-y-6">
              {gestionnaire.services.map((service, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{service.nom}</h3>
                      <p className="text-gray-600 mt-1">{service.description}</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="font-medium text-gray-900">{service.prix}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'avis' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Avis clients</h2>
            <div className="space-y-6">
              {gestionnaire.avis.map((avis) => (
                <div key={avis.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{avis.auteur}</p>
                      <p className="text-gray-500 text-sm">{avis.date}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < avis.note ? 'text-yellow-500' : 'text-gray-300'}`} 
                          fill={i < avis.note ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{avis.commentaire}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'zones' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Zones d'intervention</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {gestionnaire.zones.map((zone, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{zone}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Bouton retour */}
      <div className="mt-8">
        <Link href="/recherche" className="text-blue-600 hover:text-blue-800 flex items-center">
          ← Retour aux résultats
        </Link>
      </div>
    </div>
  );
} 