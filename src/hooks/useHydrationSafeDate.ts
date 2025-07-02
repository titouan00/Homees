import { useState, useEffect } from 'react';

/**
 * Hook pour gérer les comparaisons de dates de manière hydratation-safe
 * Évite les erreurs d'hydratation en initialisant avec null côté serveur
 */
export function useHydrationSafeDate() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Seulement côté client, initialiser la date
    setCurrentDate(new Date());
    
    // Optionnel : mettre à jour la date toutes les minutes
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  /**
   * Compare si une date est dans le futur
   * Retourne false côté serveur pour éviter les erreurs d'hydratation
   */
  const isDateInFuture = (dateString: string | null | undefined): boolean => {
    if (!currentDate || !dateString) return false;
    return new Date(dateString) > currentDate;
  };

  /**
   * Compare si une date est dans le passé
   * Retourne true côté serveur pour éviter les erreurs d'hydratation
   */
  const isDateInPast = (dateString: string | null | undefined): boolean => {
    if (!currentDate || !dateString) return true;
    return new Date(dateString) < currentDate;
  };

  return {
    currentDate,
    isDateInFuture,
    isDateInPast,
    isClient: currentDate !== null
  };
} 