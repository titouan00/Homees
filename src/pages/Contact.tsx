import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Phone, Mail, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

function Contact() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Bonjour ! Je suis l'assistant virtuel de Homees. Comment puis-je vous aider aujourd'hui ?", isBot: true, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    default: "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?",
    hello: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    pricing: "Nos tarifs commencent à partir de 29€/mois. Souhaitez-vous en savoir plus ?",
    features: "Homees propose de nombreuses fonctionnalités : gestion des biens, suivi des interventions, messagerie intégrée...",
    contact: "Vous pouvez nous contacter par email à contact@homees.fr ou par téléphone au 01 23 45 67 89",
  };

  const simulateBotResponse = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let response = botResponses.default;
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('bonjour') || lowerText.includes('salut')) {
        response = botResponses.hello;
      } else if (lowerText.includes('prix') || lowerText.includes('tarif')) {
        response = botResponses.pricing;
      } else if (lowerText.includes('fonctionnalité') || lowerText.includes('service')) {
        response = botResponses.features;
      } else if (lowerText.includes('contact') || lowerText.includes('joindre')) {
        response = botResponses.contact;
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response,
        isBot: true,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date()
    }]);
    simulateBotResponse(input);
    setInput('');
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8 slide-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
            <p className="text-lg text-gray-600">
              Notre équipe est là pour répondre à toutes vos questions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 card p-4 rounded-lg bg-white">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Adresse</h3>
                <p className="text-gray-600">123 Avenue des Champs-Élysées, 75008 Paris</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 card p-4 rounded-lg bg-white">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Téléphone</h3>
                <p className="text-gray-600">+33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 card p-4 rounded-lg bg-white">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">contact@homees.fr</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot */}
        <div className="bg-white rounded-2xl shadow-xl p-6 slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <Bot className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Assistant Homees</h2>
              <p className="text-sm text-gray-500">Réponse instantanée 24/7</p>
            </div>
          </div>

          <div ref={chatRef} className="h-[400px] overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                } fade-in`}
              >
                <div className={`p-2 rounded-full ${
                  message.isBot ? 'bg-primary/10' : 'bg-gray-100'
                }`}>
                  {message.isBot ? (
                    <Bot className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot ? 'bg-primary/5' : 'bg-primary text-white'
                }`}>
                  <p>{message.text}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 fade-in">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="submit"
              className="btn-primary p-2 rounded-lg text-white hover:scale-105 transition-transform"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;