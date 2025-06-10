'use client';

import { Bot, X, Minimize2, Maximize2, Maximize } from 'lucide-react';
import { ChatState, ChatActions } from './types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  chatState: ChatState;
  actions: ChatActions;
  children: React.ReactNode;
}

/**
 * Composant de la fenêtre principale du chat
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ chatState, actions, children }) => {
  const { isFullscreen, isMinimized, isLoading } = chatState;
  const { toggleFullscreen, toggleMinimized, closeChat } = actions;

  return (
    <div className={`fixed bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isFullscreen 
        ? 'inset-4 w-auto h-auto rounded-3xl' 
        : isMinimized 
          ? 'bottom-6 right-6 w-80 h-16' 
          : 'bottom-6 right-6 w-80 h-96'
    }`}>
      {/* Header du chat */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistant Homees</h3>
            <p className="text-emerald-100 text-xs">
              {isLoading ? 'En train d\'écrire...' : 'En ligne'}
            </p>
          </div>
        </div>
        
        {/* Boutons de contrôle */}
        <div className="flex space-x-2">
          {!isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white transition-colors"
              title="Plein écran"
            >
              <Maximize className="h-4 w-4" />
            </button>
          )}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white transition-colors"
              title="Mode widget"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          )}
          {!isFullscreen && (
            <button
              onClick={toggleMinimized}
              className="text-white/80 hover:text-white transition-colors"
              title={isMinimized ? "Agrandir" : "Réduire"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={closeChat}
            className="text-white/80 hover:text-white transition-colors"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contenu du chat (seulement si pas minimisé) */}
      {!isMinimized && children}
    </div>
  );
};

export default ChatWindow; 