"use client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue sur Homees</h1>
        <p className="text-xl mb-8">Simplifiez la gestion de vos biens immobiliers</p>
        <Link
          href="/signup"
          className="bg-blue-medium hover:bg-blue-dark text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Commencer
        </Link>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid md:grid-cols-3 gap-8 py-12"
      >
        <FeatureCard
          title="Gestion centralisée"
          description="Toutes vos propriétés et interventions en un seul endroit."
        />
        <FeatureCard
          title="Mise en relation"
          description="Trouvez facilement des gestionnaires qualifiés pour vos biens."
        />
        <FeatureCard
          title="Suivi transparent"
          description="Rapports détaillés et historique complet des interventions."
        />
      </motion.section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Foire aux questions</h2>
        <div className="space-y-4">
          <FAQItem
            question="Comment fonctionne Homees ?"
            answer="Homees met en relation les propriétaires immobiliers avec des gestionnaires qualifiés. Inscrivez-vous, créez votre profil, et commencez à gérer vos biens ou à trouver des clients."
          />
          <FAQItem
            question="Est-ce que Homees est gratuit ?"
            answer="L'inscription et la création de profil sont gratuites. Des frais peuvent s'appliquer pour certaines fonctionnalités premium."
          />
          <FAQItem
            question="Comment puis-je contacter le support ?"
            answer="Vous pouvez contacter notre équipe de support via la page d'assistance ou en envoyant un email à support@homees.com."
          />
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p>{description}</p>
  </motion.div>
)

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <h3 className="text-lg font-bold mb-2">{question}</h3>
    <p>{answer}</p>
  </motion.div>
)

