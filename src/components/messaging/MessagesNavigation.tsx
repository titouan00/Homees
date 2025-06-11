'use client';

import { useState } from 'react';
import { 
  ChatCircleText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Funnel,
  MagnifyingGlass,
  Plus
} from 'phosphor-react';
import Button from '@/components/ui/Button';

interface MessagesNavigationProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userRole: 'proprietaire' | 'gestionnaire';
  conversationsCount: number;
}

/**
 * Navigation secondaire pour la messagerie avec filtres et recherche
 */
export default function MessagesNavigation({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  userRole,
  conversationsCount
}: MessagesNavigationProps) {
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    {
      id: 'all',
      label: 'Toutes',
      icon: ChatCircleText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'ouverte',
      label: 'En attente',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'acceptee',
      label: 'Acceptées',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'rejetee',
      label: 'Rejetées',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Header avec titre et actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChatCircleText className="h-5 w-5 mr-2 text-emerald-600" />
            Messages
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({conversationsCount})
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {userRole === 'proprietaire' 
              ? 'Vos conversations avec les gestionnaires'
              : 'Vos conversations avec les propriétaires'
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {userRole === 'proprietaire' && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              className="hidden sm:flex"
            >
              Nouveau message
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            icon={Funnel}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-gray-100' : ''}
          >
            Filtres
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher dans les conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Filtres */}
      <div className={`transition-all duration-200 overflow-hidden ${
        showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? `${filter.bgColor} ${filter.color} shadow-sm`
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Onglets rapides pour mobile */}
      <div className="flex space-x-1 sm:hidden overflow-x-auto">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                isActive
                  ? `${filter.bgColor} ${filter.color}`
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 