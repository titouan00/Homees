'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useComparateur } from '@/hooks/useComparateur';
import { FiltresComparateur, Gestionnaire } from '@/types/gestionnaire';
import FiltresComparateurComponent from '@/components/comparator/FiltresComparateur';
import GrilleGestionnaires from '@/components/comparator/GrilleGestionnaires';

/**
 * Page comparateur pour les propriétaires - Version complète
 */
export default function ComparateurPage() {
  const router = useRouter();
  
  // États locaux pour les filtres et la recherche
  const [filtres, setFiltres] = useState<FiltresComparateur>({
    tri_par: 'note',
    ordre: 'desc'
  });
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Construction des paramètres de recherche
  const searchParams = useMemo(() => ({
    ...filtres,
    search: searchValue || undefined,
    page: currentPage,
    limit: 12
  }), [filtres, searchValue, currentPage]);

  // Hook pour récupérer les données
  const { gestionnaires, loading, error, totalCount } = useComparateur(searchParams);

  // Calcul de la pagination
  const totalPages = Math.ceil(totalCount / 12);

  // Gestionnaires de changement d'état
  const handleFiltresChange = useCallback((nouveauFiltres: FiltresComparateur) => {
    setFiltres(nouveauFiltres);
    setCurrentPage(1); // Reset à la première page lors du changement de filtres
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchValue(search);
    setCurrentPage(1); // Reset à la première page lors de la recherche
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut pour une meilleure UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleContact = useCallback((gestionnaire: Gestionnaire) => {
    // TODO: Implémenter la logique de contact/messagerie
    console.log('Contacter gestionnaire:', gestionnaire);
    router.push(`/dashboard/messages?gestionnaire=${gestionnaire.gestionnaire_id}`);
  }, [router]);

  const handleViewProfile = useCallback((gestionnaire: Gestionnaire) => {
    // Redirection vers la page de profil du gestionnaire
    router.push(`/dashboard/proprietaire/profil-gestionnaire/${gestionnaire.gestionnaire_id}`);
  }, [router]);

  // Debug des données
  console.log('DEBUG - gestionnaires:', gestionnaires);
  console.log('DEBUG - premier gestionnaire:', gestionnaires[0]);
  if (gestionnaires[0]) {
    console.log('DEBUG - services_offerts:', gestionnaires[0].services_offerts);
    console.log('DEBUG - langues_parlees:', gestionnaires[0].langues_parlees);
    console.log('DEBUG - type services_offerts:', typeof gestionnaires[0].services_offerts);
    console.log('DEBUG - type langues_parlees:', typeof gestionnaires[0].langues_parlees);
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comparateur de Gestionnaires</h1>
        <p className="text-gray-600">Trouvez le gestionnaire immobilier parfait pour vos biens</p>
      </div>
      
      <FiltresComparateurComponent
        filtres={filtres}
        onFiltresChange={handleFiltresChange}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        totalResults={totalCount}
      />
     

      {/* Grille des gestionnaires */}
      <GrilleGestionnaires
        gestionnaires={gestionnaires}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onContact={handleContact}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
} 