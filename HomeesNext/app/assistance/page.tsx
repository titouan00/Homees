"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Assistance() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we could typically send the question to our AI service
    // For example :
    setAnswer(
      "Voici une réponse simulée à votre question. Dans une vraie application, cela serait généré par un assistant IA.",
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Assistance</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <form onSubmit={handleSubmit} className="mb-6">
          <label htmlFor="question" className="block text-sm font-medium mb-2">
            Posez votre question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={4}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-medium hover:bg-blue-dark text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Envoyer
          </button>
        </form>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-light p-4 rounded-lg"
          >
            <h2 className="font-bold mb-2">Réponse :</h2>
            <p>{answer}</p>
          </motion.div>
        )}
        <div className="mt-8">
          <h2 className="font-bold mb-4">Contacter le support</h2>
          <p>Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à contacter notre équipe de support :</p>
          <p className="mt-2">
            Email :{" "}
            <a href="mailto:support@homees.com" className="text-blue-medium hover:underline">
              support@homees.com
            </a>
          </p>
          <p>
            Téléphone :{" "}
            <a href="tel:+33123456789" className="text-blue-medium hover:underline">
              +33 1 23 45 67 89
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

