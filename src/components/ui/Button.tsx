'use client';

import React from 'react';
import { colorClasses, type ButtonType } from '@/config/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonType;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Composant Button réutilisable avec système de couleurs centralisé
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  iconPosition = 'left',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const variantClasses = colorClasses.button[variant];
  
  const finalClassName = [
    baseClasses,
    sizeClasses[size],
    widthClass,
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  // Fonction pour rendre l'icône de manière sécurisée
  const renderIcon = () => {
    if (!icon) return null;
    
    // Si c'est un composant React (fonction), on l'instancie
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<any>;
      return <IconComponent className="h-4 w-4" />;
    }
    
    // Vérifier si c'est un objet React non instancié (avec $$typeof)
    if (typeof icon === 'object' && icon !== null && '$$typeof' in icon) {
      console.warn('Icon passed as React object instead of component. Converting to component.');
      try {
        return React.cloneElement(icon as React.ReactElement, { 
          className: "h-4 w-4"
        } as any);
      } catch (e) {
        console.error('Failed to clone React element:', e);
        return null;
      }
    }
    
    // Sinon, on retourne l'icône telle quelle (ReactNode)
    return icon;
  };

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : renderIcon()}
      {children}
    </button>
  );
} 