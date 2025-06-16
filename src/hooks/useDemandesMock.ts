'use client';

import { useState, useEffect, useMemo } from 'react';
import { DemandeWithDetails, FiltresDemandes } from '@/types/messaging';
import mockDemandes from '@/data/mockDemandes.json';

interface UseDemandesMockParams {
  filtres?: FiltresDemandes;
  recherche?: string;
  page?: number;
  limit?: number;
}

interface UseDemandesMockReturn {
  demandes: DemandeWithDetails[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

/**
 * Hook pour gérer les demandes avec des données mockées
 */
export function useDemandesMock(params: UseDemandesMockParams): UseDemandesMockReturn {
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const { filtres, recherche, page = 1, limit = 10 } = params;

  // Simuler un délai de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filtres, recherche, page]);

  // Filtrer et trier les données
  const filteredDemandes = useMemo(() => {
    let result = [...mockDemandes] as DemandeWithDetails[];

    // Appliquer la recherche
    if (recherche && recherche.trim()) {
      const searchTerm = recherche.toLowerCase().trim();
      result = result.filter(demande => 
        demande.gestionnaire?.nom?.toLowerCase().includes(searchTerm) ||
        demande.propriete?.adresse?.toLowerCase().includes(searchTerm) ||
        demande.propriete?.ville?.toLowerCase().includes(searchTerm)
      );
    }

    // Appliquer les filtres
    if (filtres) {
      if (filtres.statut && filtres.statut.length > 0) {
        result = result.filter(demande => filtres.statut!.includes(demande.statut));
      }

      if (filtres.ville) {
        result = result.filter(demande => 
          demande.propriete?.ville?.toLowerCase().includes(filtres.ville!.toLowerCase())
        );
      }

      if (filtres.gestionnaire) {
        result = result.filter(demande => 
          demande.gestionnaire?.nom?.toLowerCase().includes(filtres.gestionnaire!.toLowerCase())
        );
      }

      if (filtres.date_debut) {
        result = result.filter(demande => 
          new Date(demande.créé_le) >= new Date(filtres.date_debut!)
        );
      }

      if (filtres.date_fin) {
        result = result.filter(demande => 
          new Date(demande.créé_le) <= new Date(filtres.date_fin!)
        );
      }

      // Tri
      if (filtres.tri_par) {
        result.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (filtres.tri_par) {
            case 'statut':
              aValue = a.statut;
              bValue = b.statut;
              break;
            case 'gestionnaire':
              aValue = a.gestionnaire?.nom || '';
              bValue = b.gestionnaire?.nom || '';
              break;
            case 'adresse':
              aValue = a.propriete?.adresse || '';
              bValue = b.propriete?.adresse || '';
              break;
            case 'date':
            default:
              aValue = new Date(a.créé_le);
              bValue = new Date(b.créé_le);
              break;
          }

          if (aValue < bValue) return filtres.ordre === 'asc' ? -1 : 1;
          if (aValue > bValue) return filtres.ordre === 'asc' ? 1 : -1;
          return 0;
        });
      }
    } else {
      // Tri par défaut par date décroissante
      result.sort((a, b) => new Date(b.créé_le).getTime() - new Date(a.créé_le).getTime());
    }

    return result;
  }, [filtres, recherche]);

  // Pagination
  const paginatedDemandes = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredDemandes.slice(startIndex, endIndex);
  }, [filteredDemandes, page, limit]);

  return {
    demandes: paginatedDemandes,
    loading,
    error,
    totalCount: filteredDemandes.length
  };
} 