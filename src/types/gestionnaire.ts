/**
 * Types pour le système de comparateur de gestionnaires
 */

export interface Gestionnaire {
  gestionnaire_id: string;
  nom: string;
  email: string;
  nom_agence: string;
  description: string | null;
  zone_intervention: string | null;
  tarif_base: number | null;
  certifications: string | null;
  services_offerts: ServiceOffert[] | null;
  logo_url: string | null;
  site_web: string | null;
  telephone: string | null;
  adresse: string | null;
  note_moyenne: number;
  nombre_avis: number;
  actif: boolean;
  langues_parlees: string[] | null;
  type_gestionnaire: TypeGestionnaire;
  créé_le: string;
}

export interface ServiceOffert {
  nom: string;
  description: string;
  inclus: boolean;
  prix?: number;
}

export type TypeGestionnaire = 'independant' | 'agence_locale' | 'agence_nationale' | 'syndic' | 'cabinet_expertise';

export type LangueDisponible = 'français' | 'anglais' | 'espagnol' | 'italien' | 'allemand' | 'chinois' | 'arabe' | 'portugais' | 'russe' | 'japonais';

export interface FiltresComparateur {
  zone_intervention?: string;
  tarif_min?: number;
  tarif_max?: number;
  note_min?: number;
  services_requis?: string[];
  certifications?: string[];
  langues_parlees?: LangueDisponible[];
  type_gestionnaire?: TypeGestionnaire[];
  tri_par?: 'note' | 'prix' | 'avis' | 'nom';
  ordre?: 'asc' | 'desc';
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type ComparateurParams = FiltresComparateur & SearchParams; 