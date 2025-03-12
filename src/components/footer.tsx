export default function Footer() {
    const isLanding = true; // Adjust logic as needed
  
    return (
    <>
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
                  <li>Fonctionnalités</li>
                  <li>Tarifs</li>
                  <li>FAQ</li>
                </ul>
              </div>
              <div className="slide-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
                <ul className="space-y-2 text-white/80">
                  <li>À propos</li>
                  <li>Blog</li>
                  <li>Carrières</li>
                </ul>
              </div>
              <div className="slide-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2 text-white/80">
                  <li>Support</li>
                  <li>Sales</li>
                  <li>Presse</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
              <p className="hover:text-white transition-all duration-300">&copy; 2025 Homees. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
    </>
    )
}



