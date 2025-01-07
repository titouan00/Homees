import React, { useState } from 'react';
import { Send, Search, UserCircle2 } from 'lucide-react';

function Messagerie() {
  const [selectedContact, setSelectedContact] = useState(null);

  const contacts = [
    { id: 1, name: 'Alice Martin', role: 'Gestionnaire', lastMessage: 'Bonjour, concernant la maintenance...', time: '10:30' },
    { id: 2, name: 'Thomas Dubois', role: 'Propriétaire', lastMessage: 'Merci pour votre réponse...', time: '09:15' },
    { id: 3, name: 'Marie Lambert', role: 'Gestionnaire', lastMessage: 'Le rendez-vous est confirmé...', time: 'Hier' },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-3 h-[600px]">
          {/* Contacts List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-73px)]">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <UserCircle2 className="h-10 w-10 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {contact.name}
                        </h3>
                        <span className="text-xs text-gray-500">{contact.time}</span>
                      </div>
                      <p className="text-sm text-gray-500">{contact.role}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <UserCircle2 className="h-10 w-10 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedContact.name}</h2>
                      <p className="text-sm text-gray-600">{selectedContact.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Messages would go here */}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messagerie;