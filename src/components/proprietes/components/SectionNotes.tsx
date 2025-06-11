import { Star } from 'phosphor-react';

interface SectionNotesProps {
  notes?: string;
}

/**
 * Composant pour afficher les notes d'une propriété
 */
export function SectionNotes({ notes }: SectionNotesProps) {
  if (!notes) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800 line-clamp-2">
          {notes}
        </p>
      </div>
    </div>
  );
} 