'use client';



import { useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Phone, Globe, Envelope, ChatCircle, CheckCircle, Buildings, User } from 'phosphor-react';

import { Gestionnaire } from '@/types/gestionnaire';
import { TYPES_GESTIONNAIRE, LANGUES_DISPONIBLES } from '@/lib/constants';
import ContactButton from '@/components/messaging/ContactButton';

interface CarteGestionnaireProps {
  gestionnaire: Gestionnaire;
  onContact: (gestionnaire: Gestionnaire) => void;
  onViewProfile: (gestionnaire: Gestionnaire) => void;
}

/**
 * Carte d'affichage d'un gestionnaire immobilier
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
      {/* Header avec logo et nom */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {logo_url ? (
            <Image
              src={logo_url}
              alt={`Logo ${nom_agence}`}
              width={60}
              height={60}
              className="rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-15 h-15 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {nom_agence.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {nom_agence}
          </h3>
          <p className="text-sm text-gray-600">
            {nom}
          </p>
          
          {/* Note et avis */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {renderStars(note_moyenne)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {note_moyenne.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({nombre_avis} avis)
            </span>
          </div>
        </div>

        {/* Prix */}
        <div className="text-right">
          <div className="text-lg font-bold text-emerald-600">
            {formatTarif(tarif_base)}
          </div>
          {tarif_base && (
            <div className="text-xs text-gray-500">
              À partir de
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Type de gestionnaire */}
      <div className="flex items-center gap-2 mb-3">
        <Buildings className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {TYPES_GESTIONNAIRE.find((t: any) => t.code === type_gestionnaire)?.label || type_gestionnaire}
        </span>
      </div>

      {/* Zone d'intervention */}
      {zone_intervention && (
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {zone_intervention}
          </span>
        </div>
      )}

      {/* Langues parlées */}
      {langues_parlees && langues_parlees.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Langues parlées</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {langues_parlees.slice(0, 3).map((langue) => {
              const langueInfo = LANGUES_DISPONIBLES.find((l: any) => l.code === langue);
              return (
                <span
                  key={langue}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                >
                  <span>{langueInfo?.flag}</span>
                  <span>{langueInfo?.label || langue}</span>
                </span>
              );
            })}
            {langues_parlees.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600">
                +{langues_parlees.length - 3} autres
              </span>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && (
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-emerald-700 font-medium">
            Certifié
          </span>
        </div>
      )}

      {/* Services principaux */}
      {services_offerts && services_offerts.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {services_offerts.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700"
              >
                {service.nom}
              </span>
            ))}
            {services_offerts.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600">
                +{services_offerts.length - 3} autres
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {/* Voir le profil */}
        <button
          onClick={() => onViewProfile(gestionnaire)}
          className="flex-1 bg-white text-emerald-600 border border-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <User className="h-4 w-4" />
          Voir le profil
        </button>

        {/* Contact principal */}
        <ContactButton
          gestionnaireId={gestionnaire.gestionnaire_id}
          gestionnaireNom={gestionnaire.nom_agence}
          className="flex-1"
        />

        {/* Actions secondaires */}
        <div className="flex gap-1">
          {telephone && (
            <a
              href={`tel:${telephone}`}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Appeler"
            >
              <Phone className="h-4 w-4 text-gray-600" />
            </a>
          )}
          
          {site_web && (
            <a
              href={site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Site web"
            >
              <Globe className="h-4 w-4 text-gray-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 