'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Icon } from '@phosphor-icons/react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: Icon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'glass';
}

/**
 * Composant Input réutilisable avec label et gestion d'erreurs
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  
  const baseClasses = 'w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent';
  
  const variants = {
    default: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-emerald-500',
    glass: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/60 focus:ring-emerald-400'
  };
  
  const errorClasses = error 
    ? variant === 'glass' 
      ? 'border-red-400/50 focus:ring-red-400' 
      : 'border-red-300 focus:ring-red-500'
    : '';

  const inputClasses = [
    baseClasses,
    variants[variant],
    errorClasses,
    Icon && iconPosition === 'left' ? 'pl-12' : '',
    Icon && iconPosition === 'right' ? 'pr-12' : '',
    className
  ].filter(Boolean).join(' ');

  const iconClasses = variant === 'glass' ? 'text-white/60' : 'text-gray-400';

  return (
    <div className="w-full">
      {label && (
        <label className={`block font-medium mb-2 text-sm ${
          variant === 'glass' ? 'text-white' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 z-10 ${iconClasses}`} />
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <Icon className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${iconClasses}`} />
        )}
      </div>
      
      {error && (
        <p className={`mt-2 text-sm ${
          variant === 'glass' ? 'text-red-300' : 'text-red-600'
        }`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 