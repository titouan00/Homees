"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Signup() {
  const [role, setRole] = useState<"proprietaire" | "gestionnaire" | null>(null)

  return (
    <div className="container mx-auto max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Inscription</h1>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Je suis un :</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setRole("proprietaire")}
              className={`flex-1 py-2 px-4 rounded ${
                role === "proprietaire" ? "bg-blue-medium text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Propriétaire
            </button>
            <button
              type="button"
              onClick={() => setRole("gestionnaire")}
              className={`flex-1 py-2 px-4 rounded ${
                role === "gestionnaire" ? "bg-blue-medium text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Gestionnaire
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nom complet
          </label>
          <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Mot de passe
          </label>
          <input type="password" id="password" name="password" className="w-full p-2 border rounded" required />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-medium hover:bg-blue-dark text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          S'inscrire
        </button>
      </motion.form>
    </div>
  )
}

