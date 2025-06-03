'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Building, Euro, Star } from 'lucide-react';

// Données de test pour les gestionnaires
const gestionnairesTest = [
  {
    id: 1,
    nom: "Agence Immobilière Centrale",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
    adresse: "123 Rue de Paris, 75001 Paris",
    note: 4.8,
    avis: 42,
    services: ["Gestion locative", "État des lieux", "Assurance loyers impayés"],
    tarif: "5.9% du loyer",
    certifie: true
  },
  {
    id: 2,
    nom: "Gestion Locative Express",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    adresse: "45 Avenue Victor Hugo, 75016 Paris",
    note: 4.5,
    avis: 28,
    services: ["Gestion locative", "Recherche locataire", "Recouvrement"],
    tarif: "4.8% du loyer",
    certifie: true
  },
  {
    id: 3,
    nom: "Immobilier Conseil",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    adresse: "78 Boulevard Haussmann, 75008 Paris",
    note: 4.2,
    avis: 15,
    services: ["Gestion locative", "Conseil fiscal"],
    tarif: "6.2% du loyer",
    certifie: false
  },
];

export default function RecherchePage() {
  const [filtres, setFiltres] = useState({
    localisation: "",
    typeBien: "",
    budgetMax: "",
    services: [] as string[]
  });
  
  const [gestionnaires, setGestionnaires] = useState(gestionnairesTest);
  const [filtreVisible, setFiltreVisible] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de recherche - dans un vrai cas, appel API
    console.log("Recherche avec filtres:", filtres);
    // Filtrer les gestionnaires selon les critères
    // Pour l'instant, on utilise les données de test
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Trouvez le gestionnaire idéal pour vos biens</h1>
      
      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Localisation (ville, code postal)"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filtres.localisation}
              onChange={(e) => setFiltres({...filtres, localisation: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Rechercher
          </button>
          <button 
            type="button" 
            className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center justify-center"
            onClick={() => setFiltreVisible(!filtreVisible)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtres
          </button>
        </form>
        
        {/* Filtres avancés */}
        {filtreVisible && (
          <div className="mt-4 grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={filtres.typeBien}
                onChange={(e) => setFiltres({...filtres, typeBien: e.target.value})}
              >
                <option value="">Tous les types</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="commerce">Local commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget max. (% du loyer)</label>
              <input 
                type="number" 
                placeholder="ex: 6"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={filtres.budgetMax}
                onChange={(e) => setFiltres({...filtres, budgetMax: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services inclus</label>
              <div className="flex flex-wrap gap-2">
                {["Gestion locative", "État des lieux", "Assurance"].map((service) => (
                  <label key={service} className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500"
                      checked={filtres.services.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFiltres({...filtres, services: [...filtres.services, service]});
                        } else {
                          setFiltres({...filtres, services: filtres.services.filter(s => s !== service)});
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Résultats de recherche */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{gestionnaires.length} gestionnaires trouvés</h2>
          <select className="p-2 border border-gray-300 rounded-lg">
            <option value="note">Trier par note</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
        </div>
        
        {/* Liste des gestionnaires */}
        <div className="space-y-6">
          {gestionnaires.map((gestionnaire) => (
            <div key={gestionnaire.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 h-48 md:h-auto md:w-48 relative">
                  <img 
                    src={gestionnaire.image} 
                    alt={gestionnaire.nom}
                    className="h-full w-full object-cover" 
                  />
                  {gestionnaire.certifie && (
                    <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Certifié Homees
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{gestionnaire.nom}</h3>
                      <p className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {gestionnaire.adresse}
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{gestionnaire.note}</span>
                      <span className="text-gray-500 text-sm ml-1">({gestionnaire.avis})</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <Building className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Services: {gestionnaire.services.join(", ")}</span>
                    </div>
                    <div className="flex items-center">
                      <Euro className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Tarif: {gestionnaire.tarif}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <a href={`/gestionnaires/${gestionnaire.id}`} className="text-blue-600 hover:text-blue-800 font-medium mr-4">
                      Voir le profil
                    </a>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 