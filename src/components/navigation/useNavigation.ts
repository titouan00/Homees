'use client';

import { useState } from 'react';
import { NavItem } from './types';

/**
 * Hook personnalisé pour gérer la navigation
 */
export const useNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: '/#features', label: 'Fonctionnalités' },
    { href: '/recherche', label: 'Rechercher' },
    { href: '/gestionnaires', label: 'Gestionnaires' },
    { href: '/contact', label: 'Contact' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return {
    isMenuOpen,
    navItems,
    toggleMenu,
    closeMenu
  };
}; 