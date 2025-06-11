'use client';

import React from 'react';
import { Star, ChatCircle, Envelope, User } from 'phosphor-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Mock de données gestionnaire (à remplacer par un vrai fetch/hook)
const gestionnaire = {
  id: '1',
  nomAgence: 'Laforêt',
  note: 4.5,
  nbAvis: 339,
  adresse: '34 rue de la liberté, Paris, 75011',
  description: 'Short description genre spécialisation ou quoi',
  lots: 339,
  anneeCreation: 2019,
  services: [
    'Signature électronique', 'GLI', 'État des lieux', 'Relance loyers',
    'Signature électronique', 'GLI', 'État des lieux', 'Relance loyers',
    'Signature électronique', 'GLI', 'État des lieux', 'Relance loyers',
  ],
  tarifs: [
    { label: 'Gestion locative', value: '6,5 % TTC' },
    { label: 'Mise en location', value: '80 x % du loyer mensuel' },
    { label: 'État des lieux', value: '150 €' },
    { label: '?? un autre truc peut être', value: 'Renseignez-vous' },
  ],
  logo: '/logo-laforet.png',
  descriptionLongue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  mapCenter: { lat: 48.866667, lng: 2.333333 },
  avis: Array.from({ length: 10 }).map((_, i) => ({
    auteur: 'Joe D.',
    note: 4.5,
    texte: 'Lorem ipsum dolor sit amet. Et nemo internos et excepturi exercitationem et occaecati repellat et nihil blanditiis aut eveniet nobis nam laboriosam',
  })),
};

const containerStyle = {
  width: '100%',
  height: '300px',
};

function HeaderProfilGestionnaire({ gestionnaire }: any) {
  return (
    <div className="flex items-start justify-between gap-6 p-6 bg-white rounded-xl border border-gray-200 mb-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{gestionnaire.nomAgence}</h1>
          <span className="flex items-center gap-1 text-yellow-500 font-medium">
            {gestionnaire.note} <Star className="h-5 w-5" />
          </span>
          <span className="text-gray-500 text-sm">basé sur {gestionnaire.nbAvis} avis clients</span>
        </div>
        <div className="text-gray-700 mb-2">{gestionnaire.adresse}</div>
        <div className="text-gray-500 text-sm mb-2">{gestionnaire.description}</div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <img src={gestionnaire.logo} alt="logo" className="w-20 h-20 object-contain rounded-full border bg-white" />
        <div className="flex gap-2 mt-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium flex items-center gap-2 hover:bg-gray-200">
            <Envelope className="h-4 w-4" /> Demander un devis
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-emerald-700">
            <ChatCircle className="h-4 w-4" /> Contacter
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsGestionnaire({ gestionnaire }: any) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{gestionnaire.lots}</div>
        <div className="text-gray-500 text-sm">Lots gérés</div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{gestionnaire.anneeCreation}</div>
        <div className="text-gray-500 text-sm">Création</div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{gestionnaire.anneeCreation}</div>
        <div className="text-gray-500 text-sm">Création</div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{gestionnaire.anneeCreation}</div>
        <div className="text-gray-500 text-sm">Création</div>
      </div>
    </div>
  );
}

function ServicesTarifs({ gestionnaire }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
        <div className="font-semibold mb-2">Services proposés</div>
        <div className="flex flex-wrap gap-2">
          {gestionnaire.services.map((s: string, i: number) => (
            <span key={i} className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">{s}</span>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="font-semibold mb-2">Tarifs</div>
        <ul className="space-y-1">
          {gestionnaire.tarifs.map((t: any, i: number) => (
            <li key={i} className="flex justify-between text-sm"><span>{t.label}</span><span className="font-medium">{t.value}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DescriptionGestionnaire({ gestionnaire }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="font-semibold mb-2">Description</div>
      <div className="text-gray-700 text-sm">{gestionnaire.descriptionLongue}</div>
    </div>
  );
}

function CarteZoneIntervention({ gestionnaire }: any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="font-semibold mb-2">Zone d'intervention</div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={gestionnaire.mapCenter}
          zoom={12}
        >
          <Marker position={gestionnaire.mapCenter} />
        </GoogleMap>
      ) : (
        <div className="text-gray-500">Chargement de la carte…</div>
      )}
    </div>
  );
}

function AvisGestionnaire({ gestionnaire }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold">Avis</div>
        <div className="flex items-center gap-1 text-yellow-500 font-medium">
          {gestionnaire.note} <Star className="h-4 w-4" />
        </div>
        <div className="text-gray-500 text-sm">basé sur {gestionnaire.nbAvis} avis clients</div>
        <button className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">Filtrer</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gestionnaire.avis.map((avis: any, i: number) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{avis.auteur}</span>
              <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                {avis.note} <Star className="h-3 w-3" />
              </span>
            </div>
            <div className="text-xs text-gray-700">{avis.texte}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PageProfilGestionnaire() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <HeaderProfilGestionnaire gestionnaire={gestionnaire} />
      <StatsGestionnaire gestionnaire={gestionnaire} />
      <ServicesTarifs gestionnaire={gestionnaire} />
      <DescriptionGestionnaire gestionnaire={gestionnaire} />
      <CarteZoneIntervention gestionnaire={gestionnaire} />
      <AvisGestionnaire gestionnaire={gestionnaire} />
    </div>
  );
}
