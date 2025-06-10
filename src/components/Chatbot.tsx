'use client';

import { useChatbot } from './chatbot/useChatbot';
import { getAIResponse } from './chatbot/chatbotApi';
import { Message } from './chatbot/types';
import ChatButton from './chatbot/ChatButton';
import ChatWindow from './chatbot/ChatWindow';
import ChatMessages from './chatbot/ChatMessages';
import ChatInput from './chatbot/ChatInput';

/**
 * Composant Chatbot refactorisé pour l'assistance client Homees
 * 
 * Architecture modulaire :
 * - useChatbot : Hook pour la logique d'état
 * - chatbotApi : Service pour les appels API
 * - ChatButton : Bouton flottant d'ouverture
 * - ChatWindow : Fenêtre principale avec header
 * - ChatMessages : Zone d'affichage des messages
 * - ChatInput : Zone de saisie
 */
export default function Chatbot() {
  const {
    chatState,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    messagesEndRef,
    actions,
    formatTime,
  } = useChatbot();

  /**
   * Logique d'envoi de messages
   */
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || chatState.isLoading) return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    actions.setTyping(true);
    actions.setLoading(true);

    try {
      // Obtenir la réponse IA
      const aiResponse = await getAIResponse(textToSend, messages);
      
      // Simuler délai de frappe réaliste
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre un problème technique temporaire. Notre équipe travaille à le résoudre rapidement. Vous pouvez également nous contacter directement via notre formulaire de contact pour une assistance immédiate.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      actions.setTyping(false);
      actions.setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton d'ouverture */}
      {!chatState.isOpen && (
        <ChatButton onClick={actions.openChat} />
      )}

      {/* Fenêtre de chat */}
      {chatState.isOpen && (
        <ChatWindow chatState={chatState} actions={actions}>
          <ChatMessages
            messages={messages}
            isTyping={chatState.isTyping}
            isFullscreen={chatState.isFullscreen}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={sendMessage}
            isLoading={chatState.isLoading}
            isFullscreen={chatState.isFullscreen}
          />
        </ChatWindow>
      )}
    </>
  );
} 