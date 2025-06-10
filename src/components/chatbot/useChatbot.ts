'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatState, ChatActions } from './types';

/**
 * Hook personnalisé pour gérer la logique du chatbot
 */
export const useChatbot = () => {
  // États du chat
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    isMinimized: false,
    isFullscreen: false,
    isLoading: false,
    isTyping: false,
  });

  // Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Bonjour ! Je suis l'assistant virtuel Homees. Comment puis-je vous aider avec notre plateforme de gestion immobilière aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Actions du chat
  const actions: ChatActions = {
    openChat: () => setChatState(prev => ({ ...prev, isOpen: true })),
    closeChat: () => setChatState({
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      isLoading: false,
      isTyping: false,
    }),
    toggleMinimized: () => setChatState(prev => ({ ...prev, isMinimized: !prev.isMinimized })),
    toggleFullscreen: () => setChatState(prev => ({ 
      ...prev, 
      isFullscreen: !prev.isFullscreen,
      isMinimized: false 
    })),
    setLoading: (loading: boolean) => setChatState(prev => ({ ...prev, isLoading: loading })),
    setTyping: (typing: boolean) => setChatState(prev => ({ ...prev, isTyping: typing })),
  };

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Formatage de l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return {
    chatState,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    messagesEndRef,
    actions,
    formatTime,
  };
}; 