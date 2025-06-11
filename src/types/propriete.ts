/**
 * Types pour la gestion des propriétés immobilières
 */

export interface Propriete {
  id: string;
  proprietaire_id: string;
  adresse: string;
  ville?: string;
  code_postal?: string;
  arrondissement?: string;
  type_bien: TypeBien;
  surface_m2?: number;
  nb_pieces?: number;
  nb_chambres?: number;
  nb_salles_bain?: number;
  etage?: number;
  ascenseur: boolean;
  balcon: boolean;
  terrasse: boolean;
  parking: boolean;
  cave: boolean;
  meuble: boolean;
  chauffage_type?: TypeChauffage;
  annee_construction?: number;
  dpe_classe?: DpeClasse;
  ges_classe?: DpeClasse;
  loyer_indicatif?: number;
  charges_mensuelles?: number;
  taxe_fonciere?: number;
  copropriete: boolean;
  charges_copropriete?: number;
  statut_occupation: StatutOccupation;
  caracteristiques?: Record<string, any>;
  photos: string[];
  documents: Document[];
  notes?: string;
  créé_le: string;
  mis_a_jour_le?: string;
}

export type TypeBien = 
  | 'appartement' 
  | 'maison' 
  | 'studio' 
  | 'loft' 
  | 'duplex' 
  | 'triplex' 
  | 'penthouse' 
  | 'chambre' 
  | 'autre';

export type TypeChauffage = 
  | 'individuel_gaz' 
  | 'individuel_electrique' 
  | 'collectif' 
  | 'pompe_chaleur' 
  | 'autre';

export type DpeClasse = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type StatutOccupation = 'libre' | 'occupe' | 'en_travaux';

export interface Document {
  id: string;
  nom: string;
  type: string;
  url: string;
  taille: number;
  date_upload: string;
}

export interface NouvelleProprieteForme {
  adresse: string;
  ville: string;
  code_postal: string;
  arrondissement?: string;
  type_bien: TypeBien;
  surface_m2?: number;
  nb_pieces?: number;
  nb_chambres?: number;
  nb_salles_bain?: number;
  etage?: number;
  ascenseur: boolean;
  balcon: boolean;
  terrasse: boolean;
  parking: boolean;
  cave: boolean;
  meuble: boolean;
  chauffage_type?: TypeChauffage;
  annee_construction?: number;
  dpe_classe?: DpeClasse;
  ges_classe?: DpeClasse;
  loyer_indicatif?: number;
  charges_mensuelles?: number;
  taxe_fonciere?: number;
  copropriete: boolean;
  charges_copropriete?: number;
  statut_occupation: StatutOccupation;
  notes?: string;
}

export interface FiltresProprietes {
  type_bien?: TypeBien[];
  statut_occupation?: StatutOccupation[];
  ville?: string;
  surface_min?: number;
  surface_max?: number;
  loyer_min?: number;
  loyer_max?: number;
  tri_par?: 'date' | 'surface' | 'loyer' | 'adresse';
  ordre?: 'asc' | 'desc';
}

// Constantes pour les formulaires
export const TYPES_BIEN: { value: TypeBien; label: string; icon: string }[] = [
  { value: 'appartement', label: 'Appartement', icon: '🏢' },
  { value: 'maison', label: 'Maison', icon: '🏠' },
  { value: 'studio', label: 'Studio', icon: '🏠' },
  { value: 'loft', label: 'Loft', icon: '🏭' },
  { value: 'duplex', label: 'Duplex', icon: '🏘️' },
  { value: 'triplex', label: 'Triplex', icon: '🏘️' },
  { value: 'penthouse', label: 'Penthouse', icon: '🏙️' },
  { value: 'chambre', label: 'Chambre', icon: '🛏️' },
  { value: 'autre', label: 'Autre', icon: '📦' }
];

export const TYPES_CHAUFFAGE: { value: TypeChauffage; label: string }[] = [
  { value: 'individuel_gaz', label: 'Individuel gaz' },
  { value: 'individuel_electrique', label: 'Individuel électrique' },
  { value: 'collectif', label: 'Collectif' },
  { value: 'pompe_chaleur', label: 'Pompe à chaleur' },
  { value: 'autre', label: 'Autre' }
];

export const DPE_CLASSES: { value: DpeClasse; label: string; color: string }[] = [
  { value: 'A', label: 'A (≤ 50)', color: 'bg-green-500' },
  { value: 'B', label: 'B (51-90)', color: 'bg-green-400' },
  { value: 'C', label: 'C (91-150)', color: 'bg-yellow-400' },
  { value: 'D', label: 'D (151-230)', color: 'bg-yellow-500' },
  { value: 'E', label: 'E (231-330)', color: 'bg-orange-500' },
  { value: 'F', label: 'F (331-450)', color: 'bg-red-500' },
  { value: 'G', label: 'G (> 450)', color: 'bg-red-600' }
];

export const STATUTS_OCCUPATION: { value: StatutOccupation; label: string; color: string }[] = [
  { value: 'libre', label: 'Libre', color: 'bg-green-100 text-green-800' },
  { value: 'occupe', label: 'Occupé', color: 'bg-blue-100 text-blue-800' },
  { value: 'en_travaux', label: 'En travaux', color: 'bg-yellow-100 text-yellow-800' }
]; 