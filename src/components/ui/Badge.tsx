import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'dpe' | 'status' | 'equipement';
  color?: string;
  className?: string;
}

/**
 * Composant Badge réutilisable
 */
export function Badge({ children, variant = 'default', color, className }: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium shadow-sm";
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    dpe: "text-white font-semibold",
    status: "font-medium",
    equipement: "font-medium"
  };

  return (
    <span 
      className={cn(
        baseClasses,
        variantClasses[variant],
        color,
        className
      )}
    >
      {children}
    </span>
  );
} 