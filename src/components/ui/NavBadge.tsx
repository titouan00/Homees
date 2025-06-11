interface NavBadgeProps {
  count: number;
  loading?: boolean;
  variant?: 'dynamic' | 'static';
}

/**
 * Badge de navigation unifié avec couleurs dynamiques
 * Remplace tous les badges de la sidebar pour éliminer la duplication
 */
export function NavBadge({ count, loading, variant = 'dynamic' }: NavBadgeProps) {
  if (loading) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 animate-pulse">
        <span className="w-2 h-2 bg-gray-300 rounded"></span>
      </span>
    );
  }

  // Couleurs pour badge statique (ex: notifications fixes)
  const getStaticStyle = (count: number) => {
    return count > 0 
      ? 'bg-emerald-100 text-emerald-800' 
      : 'bg-gray-100 text-gray-500';
  };

  // Couleurs dynamiques selon le nombre (pour "Mes biens")
  const getDynamicStyle = (count: number) => {
    if (count === 0) {
      return 'bg-gray-100 text-gray-500';
    } else if (count <= 5) {
      return 'bg-blue-100 text-blue-800';
    } else if (count <= 15) {
      return 'bg-emerald-100 text-emerald-800';
    } else {
      return 'bg-purple-100 text-purple-800';
    }
  };

  const styleClass = variant === 'dynamic' ? getDynamicStyle(count) : getStaticStyle(count);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styleClass}`}>
      {count}
    </span>
  );
} 