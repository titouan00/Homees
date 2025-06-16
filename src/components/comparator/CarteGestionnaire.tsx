'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Phone, Globe, Envelope, ChatCircle, CheckCircle, Buildings, User } from '@phosphor-icons/react';

import { Gestionnaire } from '@/types/gestionnaire';
import { TYPES_GESTIONNAIRE, LANGUES_DISPONIBLES } from '@/lib/constants';
import ContactButton from '@/components/messaging/ContactButton';

interface CarteGestionnaireProps {
  gestionnaire: Gestionnaire;
  onContact: (gestionnaire: Gestionnaire) => void;
  onViewProfile: (gestionnaire: Gestionnaire) => void;
}

/**
 * Carte d'affichage d'un gestionnaire immobilier - Version debug
 */
export default function CarteGestionnaire({ gestionnaire, onContact, onViewProfile }: CarteGestionnaireProps) {
  const {
    nom_agence,
    nom,
    logo_url,
    description,
    telephone,
    site_web,
    type_gestionnaire,
    zone_intervention,
    langues_parlees,
    note_moyenne,
    nombre_avis,
    tarif_base,
    certifications,
    services_offerts
  } = gestionnaire;

  // Debug des données problématiques
  console.log('DEBUG CarteGestionnaire - gestionnaire:', gestionnaire.gestionnaire_id);
  console.log('DEBUG CarteGestionnaire - services_offerts:', services_offerts);
  console.log('DEBUG CarteGestionnaire - langues_parlees:', langues_parlees);

  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(note) 
            ? 'text-yellow-400 fill-current' 
            : i < note 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatTarif = (tarif: number | null) => {
    if (!tarif) return 'Sur devis';
    return `${tarif}€/mois`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
      {/* Version simplifiée pour debug */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {nom_agence}
        </h3>
        <p className="text-sm text-gray-600">
          {nom}
        </p>
        <p className="text-sm text-gray-500">
          Note: {note_moyenne} ({nombre_avis} avis)
        </p>
      </div>

      {/* Test des données problématiques */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
        <p><strong>Services:</strong> {services_offerts ? `${services_offerts.length} services` : 'null'}</p>
        <p><strong>Langues:</strong> {langues_parlees ? `${langues_parlees.length} langues` : 'null'}</p>
        <p><strong>Type services:</strong> {typeof services_offerts}</p>
        <p><strong>Type langues:</strong> {typeof langues_parlees}</p>
      </div>

      {/* Test simple des services */}
      {services_offerts && Array.isArray(services_offerts) && services_offerts.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Services:</p>
          <div className="flex flex-wrap gap-1">
            {services_offerts.slice(0, 2).map((service, index) => {
              console.log('DEBUG - service:', service, typeof service);
              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700"
                >
                  {typeof service === 'object' && service.nom ? service.nom : String(service)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Test simple des langues */}
      {langues_parlees && Array.isArray(langues_parlees) && langues_parlees.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Langues:</p>
          <div className="flex flex-wrap gap-1">
            {langues_parlees.slice(0, 2).map((langue, index) => {
              console.log('DEBUG - langue:', langue, typeof langue);
              const langueInfo = LANGUES_DISPONIBLES.find((l: any) => l.code === langue);
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                >
                  <span>{langueInfo?.flag || '🏳️'}</span>
                  <span>{langueInfo?.label || String(langue)}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions simplifiées */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewProfile(gestionnaire)}
          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Voir le profil
        </button>
      </div>
    </div>
  );
} 