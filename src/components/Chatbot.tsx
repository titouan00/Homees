'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2, Maximize } from 'lucide-react';

/**
 * Interface pour les messages du chat
 */
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * Composant Chatbot pour l'assistance client en temps réel avec OpenAI
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Bonjour ! Je suis l'assistant virtuel Homees. Comment puis-je vous aider avec notre plateforme de gestion immobilière aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll vers le bas lors de nouveaux messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Réponse de fallback en cas d'erreur API - spécialisée Homees
   */
  const getFallbackResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase();
    
    if (normalizedMessage.includes('tarif') || normalizedMessage.includes('prix') || normalizedMessage.includes('coût') || normalizedMessage.includes('gratuit')) {
      return "Homees est entièrement gratuit pour les propriétaires ! Aucun frais d'inscription, aucun abonnement. Nous sommes rémunérés uniquement par nos partenaires gestionnaires via des commissions. Nos tarifs sont très compétitifs par rapport à la concurrence traditionnelle.";
    }
    
    if (normalizedMessage.includes('comment') && (normalizedMessage.includes('marche') || normalizedMessage.includes('fonctionne'))) {
      return "Notre plateforme vous permet de comparer les gestionnaires immobiliers en 3 étapes simples : 1) Recherchez selon vos critères (localisation, type de bien, services) 2) Consultez les profils détaillés et avis authentiques 3) Contactez directement les gestionnaires qui vous intéressent via notre messagerie sécurisée.";
    }
    
    if (normalizedMessage.includes('gestionnaire') || normalizedMessage.includes('partenaire') || normalizedMessage.includes('rejoindre')) {
      return "Pour devenir gestionnaire partenaire chez Homees, vous devez être certifié et répondre à nos critères de qualité. Le processus inclut la vérification de vos certifications et la création de votre profil détaillé. Contactez-nous via notre formulaire en précisant 'Candidature Gestionnaire'.";
    }

    if (normalizedMessage.includes('zone') || normalizedMessage.includes('ville') || normalizedMessage.includes('disponible') || normalizedMessage.includes('paris') || normalizedMessage.includes('lyon') || normalizedMessage.includes('marseille')) {
      return "Actuellement, Homees est disponible à Paris uniquement. Nous prévoyons d'étendre notre service à Lyon au Q2 2024, puis à Marseille au Q3 2024. L'expansion vers d'autres grandes villes françaises suivra progressivement.";
    }

    if (normalizedMessage.includes('avis') || normalizedMessage.includes('note') || normalizedMessage.includes('évaluation')) {
      return "Notre système d'avis est 100% authentique : seuls les propriétaires ayant réellement échangé avec un gestionnaire via notre plateforme peuvent laisser un avis. Cela garantit la fiabilité des notes et commentaires que vous consultez.";
    }
    
    return "Je suis là pour vous aider avec toutes vos questions sur Homees ! Pour une assistance personnalisée, n'hésitez pas à contacter notre équipe via le formulaire de contact ou à explorer notre plateforme pour découvrir nos services de mise en relation entre propriétaires et gestionnaires.";
  };

  /**
   * Appel à l'API OpenAI
   */
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-7) // Garde les 7 derniers messages pour le contexte
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const data = await response.json();
      
      if (data.error && data.fallback) {
        return getFallbackResponse(userMessage);
      }
      
      return data.response || getFallbackResponse(userMessage);
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
      return getFallbackResponse(userMessage);
    }
  };

  /**
   * Envoi d'un message
   */
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Obtenir la réponse de l'IA
      const aiResponse = await getAIResponse(textToSend);
      
      // Simuler un délai de frappe réaliste
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
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  /**
   * Gestion de l'envoi du formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  /**
   * Formatage de l'heure
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  /**
   * Basculer en mode plein écran
   */
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMinimized(false); // S'assurer que ce n'est pas minimisé en plein écran
  };

  /**
   * Fermer le chat
   */
  const closeChat = () => {
    setIsOpen(false);
    setIsFullscreen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Bouton d'ouverture du chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-110 z-50 animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
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
                  onClick={() => setIsMinimized(!isMinimized)}
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

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className={`overflow-y-auto p-4 space-y-4 ${
                isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-64'
              }`}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 ${
                      isFullscreen ? 'max-w-[70%]' : 'max-w-[80%]'
                    } ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-2xl px-3 py-2 ${
                        message.isUser
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className={`whitespace-pre-wrap ${
                          isFullscreen ? 'text-base' : 'text-sm'
                        }`}>{message.text}</p>
                        <p className={`mt-1 ${
                          isFullscreen ? 'text-sm' : 'text-xs'
                        } ${message.isUser ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Indicateur de frappe */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`flex items-start space-x-2 ${
                      isFullscreen ? 'max-w-[70%]' : 'max-w-[80%]'
                    }`}>
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
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
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
} 