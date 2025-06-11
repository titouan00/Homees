'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Icon } from 'phosphor-react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: Icon;
  error?: string;
  rightIcon?: React.ReactNode;
}

/**
 * Composant Input spécialisé pour les pages d'authentification
 * Design glass avec le style des pages login/signup
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(({
  label,
  icon: Icon,
  error,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  
  return (
    <div className="w-full">
      <label className="block text-white font-medium mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-red-300 text-sm">{error}</p>
      )}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput; 