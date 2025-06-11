'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Icon } from 'phosphor-react';

type AuthButtonVariant = 'primary' | 'secondary';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AuthButtonVariant;
  loading?: boolean;
  icon?: Icon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * Composant Button spécialisé pour les pages d'authentification
 */
const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(({
  children,
  variant = 'primary',
  loading = false,
  icon: Icon,
  iconPosition = 'right',
  fullWidth = true,
  className = '',
  disabled,
  ...props
}, ref) => {
  
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm';
  
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl py-2.5 rounded-xl',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 shadow-md hover:shadow-lg py-2 rounded-xl'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  const classes = [
    baseClasses,
    variants[variant],
    widthClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />
          )}
        </>
      )}
    </button>
  );
});

AuthButton.displayName = 'AuthButton';

export default AuthButton; 