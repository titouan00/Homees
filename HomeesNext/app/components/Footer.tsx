import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-blue-dark text-white p-4 md:p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Homees</h2>
          <p className="text-sm">Simplifiez votre gestion immobilière</p>
        </div>
        <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Link href="/about" className="hover:text-cyan transition duration-200">
            À propos
          </Link>
          <Link href="/privacy" className="hover:text-cyan transition duration-200">
            Confidentialité
          </Link>
          <Link href="/terms" className="hover:text-cyan transition duration-200">
            Conditions d'utilisation
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer

