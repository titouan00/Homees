'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Gestionnaire } from '@/types/gestionnaire';
import CarteGestionnaire from './CarteGestionnaire';

interface GrilleGestionnairesProps {
  gestionnaires: Gestionnaire[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onContact: (gestionnaire: Gestionnaire) => void;
}

/**
 * Composant grille pour afficher les gestionnaires avec pagination
 */
export default function GrilleGestionnaires({
  gestionnaires,
  loading,
  error,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onContact
}: GrilleGestionnairesProps) {
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-medium mb-2">
          Erreur lors du chargement
        </div>
        <div className="text-red-500 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-15 h-15 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (gestionnaires.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <div className="text-gray-600 font-medium mb-2">
          Aucun gestionnaire trouvé
        </div>
        <div className="text-gray-500 text-sm">
          Essayez de modifier vos filtres de recherche
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Grille des gestionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {gestionnaires.map((gestionnaire) => (
          <CarteGestionnaire
            key={gestionnaire.gestionnaire_id}
            gestionnaire={gestionnaire}
            onContact={onContact}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages} • {totalCount} résultat{totalCount > 1 ? 's' : ''}
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton précédent */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>

            {/* Numéros de page */}
            <div className="flex gap-1">
              {getPageNumbers(currentPage, totalPages).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                  disabled={typeof pageNum !== 'number'}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? 'bg-emerald-600 text-white'
                      : typeof pageNum === 'number'
                      ? 'border border-gray-300 hover:bg-gray-50'
                      : 'cursor-default'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Bouton suivant */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Génère les numéros de page à afficher
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const delta = 2; // Nombre de pages à afficher de chaque côté de la page courante
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
} 