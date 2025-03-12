"use client"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-blue-medium text-white p-4 md:p-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Homees
        </Link>
        <nav className="hidden md:flex space-x-4">
          <NavLink href="/dashboard">Tableau de bord</NavLink>
          <NavLink href="/profile">Profil</NavLink>
          <NavLink href="/messaging">Messagerie</NavLink>
          <NavLink href="/assistance">Assistance</NavLink>
        </nav>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Fermer" : "Menu"}
        </button>
      </div>
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4 space-y-2"
        >
          <NavLink href="/dashboard">Tableau de bord</NavLink>
          <NavLink href="/profile">Profil</NavLink>
          <NavLink href="/messaging">Messagerie</NavLink>
          <NavLink href="/assistance">Assistance</NavLink>
        </motion.nav>
      )}
    </header>
  )
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="block py-2 hover:text-cyan transition duration-200">
    {children}
  </Link>
)

export default Header

