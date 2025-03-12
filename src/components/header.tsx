import Link from "next/link";

export default function Header() {
    const isLanding = true; // Adjust logic as needed
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-metropolis">
        <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 transition-all duration-300 hover:bg-white/90">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-dark to-cyan bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
              >
                Homees
              </Link>
              <div className="hidden md:flex space-x-8">
                {isLanding ? (
                  <>
                    <a href="#features" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Fonctionnalités</a>
                    <a href="#benefits" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Avantages</a>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Dashboard</Link>
                    <Link href="/messagerie" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Messagerie</Link>
                    <Link href="/contact" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Contact</Link>
                  </>
                )}
              </div>
              {isLanding ? <p>Commencer</p> : <p>Mon profil</p>}
            </div>
          </nav>
        </header>
      </div>
    );
  }
  