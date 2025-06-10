'use client';

import { useEffect, useState } from 'react';

/**
 * Hook pour gérer les animations au scroll
 * Détecte quand les éléments avec l'attribut data-animate entrent dans la viewport
 * @returns {Set<number>} Set des indices des éléments visibles
 */
export function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState(new Set<number>());

  useEffect(() => {
    /**
     * Gestionnaire d'événement scroll pour détecter les éléments visibles
     */
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-animate]');
      
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !visibleElements.has(index)) {
          setVisibleElements(prev => new Set([...prev, index]));
          element.classList.add('animate-slide-up');
        }
      });
    };

    // Ajouter l'event listener
    window.addEventListener('scroll', handleScroll);
    
    // Vérifier l'état initial
    handleScroll();
    
    // Nettoyer l'event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleElements]);

  return visibleElements;
} 