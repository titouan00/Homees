'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Phone, Globe, Envelope, ChatCircle, CheckCircle, Buildings, User, Info } from '@phosphor-icons/react';

import { Gestionnaire } from '@/types/gestionnaire';
import { TYPES_GESTIONNAIRE, LANGUES_DISPONIBLES } from '@/lib/constants';
import ContactButton from '@/components/messaging/ContactButton';

interface CarteGestionnaireProps {
  gestionnaire: Gestionnaire;
  onContact: (gestionnaire: Gestionnaire) => void;
  onViewProfile: (gestionnaire: Gestionnaire) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
}

function truncate(str: string | null, n: number) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
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
    services_offerts,
    adresse,
    actif,
    créé_le
  } = gestionnaire;

  const typeInfo = TYPES_GESTIONNAIRE.find(t => t.code === type_gestionnaire);

  const renderStars = (note: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(note) ? 'text-yellow-400 fill-current' : i < note ? 'text-yellow-400 fill-current opacity-50' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const formatTarif = (tarif: number | null) => {
    if (!tarif) return <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">Sur devis</span>;
    return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">{tarif}€/mois</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow p-6 flex flex-col gap-4 h-full">
      {/* Header : logo + nom agence/type + statut */}
      <div className="flex items-center gap-4 mb-2">
        {logo_url ? (
          <Image src={logo_url} alt={nom_agence} width={56} height={56} className="rounded-lg object-contain bg-gray-50 border p-1" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">🏢</div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 truncate">{nom_agence}</span>
            {typeInfo && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                <span>{typeInfo.icon}</span>
                {typeInfo.label}
              </span>
            )}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>{actif ? 'Actif' : 'Inactif'}</span>
          </div>
          <div className="text-sm text-gray-500 truncate">{nom}</div>
        </div>
      </div>

      {/* Note + avis + date inscription */}
      <div className="flex items-center gap-3 mb-1">
        {renderStars(note_moyenne)}
        <span className="text-xs text-gray-600">{note_moyenne.toFixed(1)} ({nombre_avis} avis)</span>
        <span className="ml-auto text-xs text-gray-400">Inscrit {formatDate(créé_le)}</span>
      </div>

      {/* Description + zone + adresse */}
      <div className="mb-2">
        <p className="text-sm text-gray-700 mb-1">{truncate(description, 120)}</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 items-center">
          {zone_intervention && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"><MapPin className="h-4 w-4" />{zone_intervention}</span>
          )}
          {adresse && (
            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"><Buildings className="h-4 w-4" />{adresse}</span>
          )}
        </div>
      </div>

      {/* Tarif + certifications + site web + téléphone */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        {formatTarif(tarif_base)}
        {certifications && (
          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium"><CheckCircle className="h-4 w-4" />{certifications}</span>
        )}
        {site_web && (
          <a href={site_web} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-gray-50 text-blue-700 px-2 py-0.5 rounded-full text-xs hover:underline"><Globe className="h-4 w-4" />Site web</a>
        )}
        {telephone && (
          <a href={`tel:${telephone}`} className="inline-flex items-center gap-1 bg-gray-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs hover:underline"><Phone className="h-4 w-4" />Appeler</a>
        )}
      </div>

      {/* Services offerts */}
      {services_offerts && Array.isArray(services_offerts) && services_offerts.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><Info className="h-4 w-4 text-emerald-400" />Services proposés :</p>
          <div className="flex flex-wrap gap-1">
            {services_offerts.slice(0, 6).map((service, index) => (
              <span
                key={index}
                title={service.description}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${service.inclus ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'} cursor-help`}
              >
                {service.nom}
                {service.inclus && <CheckCircle className="h-3 w-3 ml-1 text-emerald-400" />}
              </span>
            ))}
            {services_offerts.length > 6 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-500">+{services_offerts.length - 6} autres</span>
            )}
          </div>
        </div>
      )}

      {/* Langues parlées */}
      {langues_parlees && Array.isArray(langues_parlees) && langues_parlees.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Langues parlées :</p>
          <div className="flex flex-wrap gap-1">
            {langues_parlees.map((langue, index) => {
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

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
        <button
          onClick={() => onViewProfile(gestionnaire)}
          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <User className="h-4 w-4" /> Voir le profil
        </button>
        <button
          onClick={() => onContact(gestionnaire)}
          className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <ChatCircle className="h-4 w-4" /> Contacter
        </button>
      </div>
    </div>
  );
} 