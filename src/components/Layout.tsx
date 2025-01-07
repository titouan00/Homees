import { Outlet, Link, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-metropolis">
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 transition-all duration-300 hover:bg-white/90">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
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
                  <Link to="/dashboard" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Dashboard</Link>
                  <Link to="/messagerie" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Messagerie</Link>
                  <Link to="/contact" className="nav-link text-gray-600 hover:text-primary transition-all duration-300">Contact</Link>
                </>
              )}
            </div>
            {isLanding ? (
              <Link
                to="/inscription"
                className="btn-primary px-6 py-2 rounded-lg text-white shadow-lg shadow-primary/20 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Commencer
              </Link>
            ) : (
              <Link
                to="/profile"
                className="btn-primary px-6 py-2 rounded-lg text-white shadow-lg shadow-primary/20 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Mon Profil
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>

      <footer className="bg-gradient-to-br from-primary-dark via-primary to-cyan text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="slide-in">
              <div className="mb-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text hover:scale-105 transition-all duration-300">
                  Homees
                </span>
              </div>
              <p className="text-white/80">
                Simplifiez la gestion de vos biens immobiliers avec notre plateforme tout-en-un.
              </p>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Fonctionnalités</Link></li>
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Tarifs</Link></li>
                <li><Link to="/assistance" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">FAQ</Link></li>
              </ul>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">À propos</Link></li>
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Blog</Link></li>
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Carrières</Link></li>
              </ul>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/assistance" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Support</Link></li>
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Sales</Link></li>
                <li><Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Presse</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
            <p className="hover:text-white transition-all duration-300">&copy; 2025 Homees. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;