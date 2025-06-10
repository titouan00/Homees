/**
 * Export de tous les composants et utilitaires du chatbot Homees
 */

export { default as Chatbot } from '../Chatbot';
export { useChatbot } from './useChatbot';
export { getAIResponse, getFallbackResponse } from './chatbotApi';
export { default as ChatButton } from './ChatButton';
export { default as ChatWindow } from './ChatWindow';
export { default as ChatMessages } from './ChatMessages';
export { default as ChatInput } from './ChatInput';
export type { Message, ChatState, ChatActions } from './types'; 