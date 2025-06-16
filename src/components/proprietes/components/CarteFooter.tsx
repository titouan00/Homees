import { Calendar } from '@phosphor-icons/react/dist/ssr';

interface CarteFooterProps {
  createdAt: string;
  updatedAt?: string;
  formatDate: (date: string) => string;
}

/**
 * Composant footer de carte avec les métadonnées temporelles
 */
export function CarteFooter({ createdAt, updatedAt, formatDate }: CarteFooterProps) {
  return (
    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Ajouté le {formatDate(createdAt)}</span>
        </div>
        {updatedAt && updatedAt !== createdAt && (
          <span>Modifié le {formatDate(updatedAt)}</span>
        )}
      </div>
    </div>
  );
} 