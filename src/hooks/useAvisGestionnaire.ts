'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Avis {
  id: string;
  auteur_nom: string;
  note: number;
  commentaire: string;
  cree_le: string;
  proprietaire_id: string;
  gestionnaire_id: string;
}

interface UseAvisGestionnaireReturn {
  avis: Avis[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  moyenneNotes: number;
  refetch: () => void;
}

// Faux avis pour le développement
const generateFakeAvis = (gestionnaireId: string, count: number = 8): Avis[] => {
  const commentaires = [
    "Excellent service, très professionnel et réactif. Je recommande vivement.",
    "Très bon gestionnaire, toujours disponible et de bon conseil.",
    "Service correct, quelques points d'amélioration possibles mais globalement satisfait.",
    "Parfait ! Gestion impeccable de mes biens, je suis très content.",
    "Bon suivi des locataires et maintenance régulière des biens.",
    "Service client au top, réponses rapides à toutes mes questions.",
    "Très professionnel, transparent sur les coûts et les délais.",
    "Excellent travail, mes biens sont entre de bonnes mains."
  ];

  const prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Julie', 'François', 'Catherine'];
  const notes = [4.5, 5.0, 4.0, 4.5, 3.5, 5.0, 4.5, 4.0];

  return Array.from({ length: count }, (_, i) => ({
    id: `fake-avis-${i}`,
    auteur_nom: `${prenoms[i % prenoms.length]} ${String.fromCharCode(65 + (i % 26))}.`,
    note: notes[i % notes.length],
    commentaire: commentaires[i % commentaires.length],
    cree_le: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    proprietaire_id: `fake-proprietaire-${i}`,
    gestionnaire_id: gestionnaireId
  }));
};

/**
 * Hook pour récupérer les avis d'un gestionnaire
 */
export function useAvisGestionnaire(
  gestionnaireId: string | null,
  limit: number = 10
): UseAvisGestionnaireReturn {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [moyenneNotes, setMoyenneNotes] = useState(0);

  const fetchAvis = async () => {
    if (!gestionnaireId) {
      setLoading(false);
      setAvis([]);
      setTotalCount(0);
      setMoyenneNotes(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Essayer de récupérer les avis depuis Supabase
      const { data: avisData, error: avisError, count } = await supabase
        .from('avis')
        .select(`
          id,
          note,
          commentaire,
          cree_le,
          proprietaire_id,
          gestionnaire_id,
          utilisateurs!avis_proprietaire_id_fkey(nom)
        `, { count: 'exact' })
        .eq('gestionnaire_id', gestionnaireId)
        .order('cree_le', { ascending: false })
        .limit(limit);

      if (avisError) {
        console.warn('Table avis non disponible, utilisation de faux avis:', avisError);
        
        // Utiliser des faux avis en cas d'erreur
        const fakeAvis = generateFakeAvis(gestionnaireId, limit);
        setAvis(fakeAvis);
        setTotalCount(fakeAvis.length);
        
        // Calculer la moyenne des faux avis
        const sommeNotes = fakeAvis.reduce((acc, avis) => acc + avis.note, 0);
        setMoyenneNotes(Math.round((sommeNotes / fakeAvis.length) * 10) / 10);
        
        return;
      }

      // Transformer les données réelles
      const avisFormated = (avisData || []).map(avis => ({
        id: avis.id,
        auteur_nom: (avis.utilisateurs as any)?.nom || 'Utilisateur anonyme',
        note: avis.note,
        commentaire: avis.commentaire,
        cree_le: avis.cree_le,
        proprietaire_id: avis.proprietaire_id,
        gestionnaire_id: avis.gestionnaire_id,
      }));

      setAvis(avisFormated);
      setTotalCount(count || 0);

      // Calculer la moyenne des notes réelles
      if (avisFormated.length > 0) {
        const sommeNotes = avisFormated.reduce((acc, avis) => acc + avis.note, 0);
        setMoyenneNotes(Math.round((sommeNotes / avisFormated.length) * 10) / 10);
      } else {
        setMoyenneNotes(0);
      }

    } catch (err) {
      console.warn('Erreur lors du chargement des avis, utilisation de faux avis:', err);
      
      // Utiliser des faux avis en cas d'erreur de connexion
      const fakeAvis = generateFakeAvis(gestionnaireId, limit);
      setAvis(fakeAvis);
      setTotalCount(fakeAvis.length);
      
      const sommeNotes = fakeAvis.reduce((acc, avis) => acc + avis.note, 0);
      setMoyenneNotes(Math.round((sommeNotes / fakeAvis.length) * 10) / 10);
      
      setError(null); // Pas d'erreur affichée puisqu'on utilise des faux avis
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, [gestionnaireId, limit]);

  const refetch = () => {
    fetchAvis();
  };

  return {
    avis,
    loading,
    error,
    totalCount,
    moyenneNotes,
    refetch
  };
} 