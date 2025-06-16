'use client';

import { User, Robot } from '@phosphor-icons/react';
import { Message } from './types';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  isFullscreen: boolean;
  formatTime: (date: Date) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Composant pour afficher la liste des messages du chat
 */
const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isTyping, 
  isFullscreen, 
  formatTime, 
  messagesEndRef 
}) => {
  return (
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
              {message.isUser ? <User className="h-4 w-4" /> : <Robot className="h-4 w-4" />}
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
              <Robot className="h-4 w-4 text-gray-600" />
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
  );
};

export default ChatMessages; 