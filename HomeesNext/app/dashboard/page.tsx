"use client"
import { motion } from "framer-motion"

export default function Dashboard() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <DashboardCard title="Propriétés" value="5"  />
        <DashboardCard title="Interventions en cours" value="3" />
        <DashboardCard title="Revenus mensuels" value="7 500 €"  />
      </div>
    </div>
  )
}

const DashboardCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-md flex items-center"
  >
    <div className="mr-4 text-blue-medium">{icon}</div>
    <div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-3xl font-bold text-blue-dark">{value}</p>
    </div>
  </motion.div>
)

