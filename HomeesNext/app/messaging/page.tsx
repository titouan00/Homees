"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Messaging() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null)

  const contacts = [
    { id: "1", name: "Jean Dupont", lastMessage: "Bonjour, j'aimerais discuter de..." },
    { id: "2", name: "Marie Martin", lastMessage: "Merci pour votre réponse..." },
    { id: "3", name: "Pierre Durand", lastMessage: "Pouvons-nous organiser une visite..." },
  ]

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Messagerie</h1>
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/3 border-r"
        >
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactdiv
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 cursor-pointer hover:bg-blue-light ${
                selectedContact === contact.id ? "bg-blue-light" : ""
              }`}
            >
              <h3 className="font-bold">{contact.name}</h3>
              <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-2/3 p-4"
        >
          {selectedContact ? (
            <>
              <h2 className="text-xl font-bold mb-4">
                {contacts.find((c) => c.id === selectedContact)?.name}
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
                {/* Messages would be displayed here */}
                <p>Historique des messages...</p>
              </div>
              <form className="flex">
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  className="flex-grow p-2 border rounded-l"
                />
                <button
                  type="submit"
                  className="bg-blue-medium hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-r"
                >
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <p className="text-center text-gray-600">
              Sélectionnez un contact pour commencer une conversation
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

