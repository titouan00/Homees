'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';

// Données de test pour les conversations
const conversationsTest = [
  {
    id: 1,
    name: "Agence Immobilière Centrale",
    avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
    lastMessage: "Bonjour, nous avons bien reçu votre demande concernant la gestion de votre appartement.",
    timestamp: "10:25",
    unread: 2,
    isOnline: true
  },
  {
    id: 2,
    name: "Gestion Locative Express",
    avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    lastMessage: "Voici notre proposition pour la gestion de votre bien.",
    timestamp: "Hier",
    unread: 0,
    isOnline: false
  },
  {
    id: 3,
    name: "Immobilier Conseil",
    avatar: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    lastMessage: "Merci pour votre message. Pouvons-nous prévoir un appel pour discuter des détails?",
    timestamp: "Lun",
    unread: 0,
    isOnline: true
  },
];

// Données de test pour les messages
const messagesTest = [
  {
    id: 1,
    senderId: "user",
    text: "Bonjour, je suis intéressé par vos services de gestion locative pour mon appartement situé à Paris.",
    timestamp: "10:00"
  },
  {
    id: 2,
    senderId: "other",
    text: "Bonjour, nous avons bien reçu votre demande concernant la gestion de votre appartement. Pouvez-vous nous donner plus de détails sur le bien ?",
    timestamp: "10:25"
  },
  {
    id: 3,
    senderId: "user",
    text: "C'est un appartement de 65m² avec 2 chambres, situé dans le 11ème arrondissement.",
    timestamp: "10:30"
  },
  {
    id: 4,
    senderId: "other",
    text: "Merci pour ces précisions. Nous proposons une gestion complète incluant la recherche de locataires, états des lieux, quittances, et suivi des travaux pour 6% du loyer mensuel.",
    timestamp: "10:45"
  },
];

export default function MessageriePage() {
  const [activeConversation, setActiveConversation] = useState(1);
  const [conversations, setConversations] = useState(conversationsTest);
  const [messages, setMessages] = useState(messagesTest);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      senderId: "user",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentConversation = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="container mx-auto px-0 md:px-6 py-6 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
        <div className="flex h-full">
          {/* Liste des conversations */}
          <div className="w-full md:w-1/3 border-r border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Rechercher une conversation" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeConversation === conv.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="relative">
                    <img 
                      src={conv.avatar} 
                      alt={conv.name} 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate max-w-[180px]">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Conversation active */}
          <div className="hidden md:flex flex-col w-2/3 h-full">
            {/* En-tête de la conversation */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src={currentConversation?.avatar} 
                  alt={currentConversation?.name} 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{currentConversation?.name}</h3>
                  <p className="text-xs text-gray-500">
                    {currentConversation?.isOnline ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Info className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== 'user' && (
                    <img 
                      src={currentConversation?.avatar} 
                      alt={currentConversation?.name} 
                      className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div 
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderId === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 text-right ${msg.senderId === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.senderId === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 self-end">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Formulaire de message */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center">
              <input 
                type="text" 
                placeholder="Écrivez votre message..." 
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="ml-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          {/* Message pour les écrans mobiles */}
          <div className="flex md:hidden items-center justify-center w-full">
            <p className="text-gray-500">
              Sélectionnez une conversation pour afficher les messages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
