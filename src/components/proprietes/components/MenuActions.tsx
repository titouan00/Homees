import { useState } from 'react';
import { DotsThreeVertical, Trash } from '@phosphor-icons/react/dist/ssr';
import { Propriete } from '@/types/propriete';

interface MenuActionsProps {
  propriete: Propriete;
  onSupprimer: (id: string) => void;
}

/**
 * Composant menu d'actions pour une carte propriété
 */
export function MenuActions({ propriete, onSupprimer }: MenuActionsProps) {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <div className="absolute top-3 right-3 z-20">
      <button
        onClick={() => setMenuOuvert(!menuOuvert)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-colors backdrop-blur-sm"
      >
        <DotsThreeVertical className="h-4 w-4" />
      </button>

      {menuOuvert && (
        <>
          {/* Menu déroulant */}
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
            <button
              onClick={() => {
                onSupprimer(propriete.id);
                setMenuOuvert(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </button>
          </div>

          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setMenuOuvert(false)}
          />
        </>
      )}
    </div>
  );
} 