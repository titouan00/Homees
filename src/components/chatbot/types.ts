/**
 * Types et interfaces pour le système de chatbot Homees
 */

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  isTyping: boolean;
}

export interface ChatActions {
  openChat: () => void;
  closeChat: () => void;
  toggleMinimized: () => void;
  toggleFullscreen: () => void;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
} 