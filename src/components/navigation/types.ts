/**
 * Types pour les composants de navigation
 */

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export interface HeaderState {
  isMenuOpen: boolean;
} 