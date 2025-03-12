"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Profile() {
  const [userType, setUserType] = useState<"proprietaire" | "gestionnaire">("proprietaire")

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Type de compte :</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setUserType("proprietaire")}
              className={`flex-1 py-2 px-4 rounded ${
                userType === "proprietaire" ? "bg-blue-medium text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Propriétaire
            </button>
            <button
              onClick={() => setUserType("gestionnaire")}
              className={`flex-1 py-2 px-4 rounded ${
                userType === "gestionnaire" ? "bg-blue-medium text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Gestionnaire
            </button>
          </div>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom complet
            </label>
            <input type="text" id="name" name="name" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input type="email" id="email" name="email" className="w-full p-2 border rounded" />
          </div>
          {userType === "proprietaire" && (
            <div className="mb-4">
              <label htmlFor="properties" className="block text-sm font-medium mb-2">
                Biens possédés
              </label>
              <textarea
                id="properties"
                name="properties"
                rows={4}
                className="w-full p-2 border rounded"
                placeholder="Listez vos biens immobiliers ici..."
              ></textarea>
            </div>
          )}
          {userType === "gestionnaire" && (
            <>
              <div className="mb-4">
                <label htmlFor="services" className="block text-sm font-medium mb-2">
                  Services proposés
                </label>
                <textarea
                  id="services"
                  name="services"
                  rows={4}
                  className="w-full p-2 border rounded"
                  placeholder="Décrivez vos services de gestion immobilière..."
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="rates" className="block text-sm font-medium mb-2">
                  Tarifs
                </label>
                <input
                  type="text"
                  id="rates"
                  name="rates"
                  className="w-full p-2 border rounded"
                  placeholder="Ex: 5% du loyer mensuel"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-medium hover:bg-blue-dark text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Sauvegarder les modifications
          </button>
        </form>
      </motion.div>
    </div>
  )
}

