import React from 'react';
import { colorClasses, statusColors, type BadgeType, type StatusType } from '@/config/colors';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeType;
  status?: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Composant Badge réutilisable avec système de couleurs centralisé
 */
export default function Badge({
  children,
  variant,
  status,
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  // Déterminer la variante à utiliser
  let finalVariant: BadgeType = variant || 'neutral';
  
  if (status && !variant) {
    const statusColor = statusColors[status];
    finalVariant = statusColor as BadgeType;
  }
  
  const variantClasses = colorClasses.badge[finalVariant];
  
  const finalClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={finalClassName}>
      {children}
    </span>
  );
}

/**
 * Badge spécialisé pour les statuts
 */
export function StatusBadge({ 
  status, 
  size = 'md', 
  className = '' 
}: { 
  status: StatusType; 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}) {
  const statusLabels: Record<StatusType, string> = {
    libre: 'Libre',
    occupe: 'Occupé',
    en_travaux: 'En travaux',
    actif: 'Actif',
    inactif: 'Inactif',
    en_attente: 'En attente',
    rejete: 'Rejeté',
    valide: 'Validé',
  };

  return (
    <Badge status={status} size={size} className={className}>
      {statusLabels[status]}
    </Badge>
  );
} 