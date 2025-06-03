'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2 } from 'lucide-react';

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
 * Questions prédéfinies fréquemment posées
 */
const PREDEFINED_QUESTIONS = [
  "Comment fonctionne le comparateur ?",
  "Quels sont vos tarifs ?",
  "Comment devenir partenaire ?",
  "Où êtes-vous disponibles ?",
  "Comment contacter un gestionnaire ?"
];

/**
 * Réponses automatiques du bot
 */
const BOT_RESPONSES: Record<string, string> = {
  "comment fonctionne le comparateur": "Notre comparateur vous permet de rechercher et comparer les gestionnaires immobiliers en 3 étapes simples : 1) Décrivez vos besoins 2) Consultez les offres personnalisées 3) Choisissez le gestionnaire idéal. Tout est transparent et gratuit !",
  "quels sont vos tarifs": "Homees est entièrement gratuit pour les propriétaires ! Nous sommes rémunérés uniquement par nos partenaires gestionnaires. Vous pouvez comparer et choisir sans aucun frais.",
  "comment devenir partenaire": "Pour devenir gestionnaire partenaire, vous devez être certifié et répondre à nos critères de qualité. Contactez-nous via le formulaire en précisant 'Partenariat' et nous vous expliquerons la procédure.",
  "où êtes-vous disponibles": "Actuellement, Homees est disponible à Paris uniquement. Nous prévoyons d'étendre notre service à Lyon (Q2 2024), Marseille (Q3 2024) et d'autres grandes villes.",
  "comment contacter un gestionnaire": "Une fois votre recherche effectuée, vous pouvez contacter directement les gestionnaires via notre messagerie sécurisée intégrée. Vos coordonnées restent privées jusqu'à ce que vous choisissiez de les partager."
};

/**
 * Composant Chatbot pour l'assistance client en temps réel
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Bonjour ! Je suis l'assistant virtuel Homees. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
   * Génère une réponse automatique du bot
   */
  const getBotResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase();
    
    // Recherche de mots-clés dans les réponses prédéfinies
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (normalizedMessage.includes(key.split(' ')[0]) || 
          normalizedMessage.includes(key)) {
        return response;
      }
    }

    // Réponses génériques basées sur des mots-clés
    if (normalizedMessage.includes('prix') || normalizedMessage.includes('coût')) {
      return BOT_RESPONSES["quels sont vos tarifs"];
    }
    
    if (normalizedMessage.includes('contact') || normalizedMessage.includes('joindre')) {
      return "Vous pouvez nous contacter par téléphone au 01 23 45 67 89, par email à contact@homees.fr, ou directement via ce chat. Notre équipe vous répondra rapidement !";
    }

    if (normalizedMessage.includes('problème') || normalizedMessage.includes('bug')) {
      return "Désolé pour la gêne occasionnée ! Pouvez-vous me décrire le problème rencontré ? Notre équipe technique interviendra rapidement pour le résoudre.";
    }

    // Réponse par défaut
    return "Je ne suis pas sûr de comprendre votre question. Puis-je vous rediriger vers l'un de ces sujets populaires ou préférez-vous parler à un conseiller humain ?";
  };

  /**
   * Envoi d'un message
   */
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

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

    // Simuler un délai de réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(textToSend),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Délai réaliste de 1-2 secondes
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
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-80 h-96'
        }`}>
          {/* Header du chat */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant Homees</h3>
                <p className="text-emerald-100 text-xs">En ligne</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
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
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isUser ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Indicateur de frappe */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
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

              {/* Questions prédéfinies */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
                  <div className="flex flex-wrap gap-1">
                    {PREDEFINED_QUESTIONS.slice(0, 3).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(question)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Zone de saisie */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
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