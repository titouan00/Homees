import Link from 'next/link';
import { NavBadge } from '@/components/ui/NavBadge';

interface NavigationItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  badge?: number;
  isSpecialBadge?: boolean;
  specialBadgeCount?: number;
  specialBadgeLoading?: boolean;
}

/**
 * Composant NavigationItem unifié pour éliminer la duplication
 */
export function NavigationItem({ 
  name, 
  href, 
  icon: Icon, 
  current, 
  badge, 
  isSpecialBadge, 
  specialBadgeCount, 
  specialBadgeLoading 
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        current
          ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <Icon className={`mr-3 h-5 w-5 ${
          current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'
        }`} />
        {name}
      </div>
      
      {/* Badge unifié */}
      {isSpecialBadge ? (
        <NavBadge 
          count={specialBadgeCount || 0} 
          loading={specialBadgeLoading} 
          variant="dynamic" 
        />
      ) : badge !== undefined ? (
        <NavBadge count={badge} variant="static" />
      ) : null}
    </Link>
  );
} 