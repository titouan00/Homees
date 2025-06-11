'use client';

import { ChatCircle } from 'phosphor-react';

interface ChatButtonProps {
  onClick: () => void;
}

/**
 * Bouton flottant pour ouvrir le chatbot
 */
const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-110 z-50 animate-bounce"
      title="Ouvrir l'assistant Homees"
    >
      <ChatCircle className="h-6 w-6" />
    </button>
  );
};

export default ChatButton; 