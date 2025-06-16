import { HTMLAttributes, forwardRef } from 'react';

interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Composant Card spécialisé pour les formulaires d'authentification
 * Design glass uniforme pour login/signup
 */
const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  
  return (
    <div
      ref={ref}
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

AuthCard.displayName = 'AuthCard';

export default AuthCard; 