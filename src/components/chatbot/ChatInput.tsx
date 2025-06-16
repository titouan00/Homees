'use client';

import { PaperPlaneTilt } from '@phosphor-icons/react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (messageText?: string) => void;
  isLoading: boolean;
  isFullscreen: boolean;
}

/**
 * Composant pour la zone de saisie des messages
 */
const ChatInput: React.FC<ChatInputProps> = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading, 
  isFullscreen 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isLoading ? "Veuillez patienter..." : "Posez votre question sur Homees..."}
          disabled={isLoading}
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
            isFullscreen ? 'text-base' : 'text-sm'
          }`}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperPlaneTilt className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput; 