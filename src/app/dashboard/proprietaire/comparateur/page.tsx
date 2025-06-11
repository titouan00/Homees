'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useComparateur } from '@/hooks/useComparateur';
import { FiltresComparateur, Gestionnaire } from '@/types/gestionnaire';
import FiltresComparateurComponent from '@/components/comparator/FiltresComparateur';
import GrilleGestionnaires from '@/components/comparator/GrilleGestionnaires';
import DashboardLayout from '@/components/navigation/DashboardLayout';
import { GitCompareIcon, Filter, Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  rôle: string;
}

/**
 * Page comparateur pour les propriétaires
 * Permet de rechercher, filtrer et comparer les gestionnaires immobiliers
 */
export default function ComparateurPage() {
  const router = useRouter();
  
  // État pour l'authentification
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // États locaux pour les filtres et la recherche
  const [filtres, setFiltres] = useState<FiltresComparateur>({
    tri_par: 'note',
    ordre: 'desc'
  });
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Vérification de l'authentification
  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/login?redirect=/dashboard/proprietaire/comparateur');
        return;
      }

      // Récupérer les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError || userData.rôle !== 'proprietaire') {
        router.push('/login?redirect=/dashboard/proprietaire/comparateur');
        return;
      }

      setUser({
        id: userData.id,
        nom: userData.nom,
        email: userData.email,
        rôle: userData.rôle
      });

    } catch (err) {
      console.error('Erreur authentification:', err);
      router.push('/login?redirect=/dashboard/proprietaire/comparateur');
    } finally {
      setAuthLoading(false);
    }
  };

  // Construction des paramètres de recherche
  const searchParams = useMemo(() => ({
    ...filtres,
    search: searchValue || undefined,
    page: currentPage,
    limit: 12
  }), [filtres, searchValue, currentPage]);

  // Hook pour récupérer les données (seulement si authentifié)
  const { gestionnaires, loading, error, totalCount, refetch } = useComparateur(
    user ? searchParams : { limit: 0 }
  );

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
    // Redirection vers la page de contact ou ouverture d'une modal
    router.push(`/dashboard/proprietaire/messages?gestionnaire=${gestionnaire.gestionnaire_id}`);
  }, [router]);

  // Écran de chargement pendant l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Redirection si pas d'utilisateur (ne devrait pas arriver grâce au useEffect)
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout 
      userProfile={user}
      title="Comparateur de Gestionnaires"
      subtitle="Trouvez le gestionnaire immobilier parfait pour vos biens"
    >
      <div className="p-6">
        {/* Filtres */}
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
        />
      </div>
    </DashboardLayout>
  );
} 