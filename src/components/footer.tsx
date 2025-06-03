import Link from 'next/link';

export default function Footer() {
    return (
    <>
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="slide-in">
                <div className="mb-6">
                  <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text hover:scale-105 transition-all duration-300">
                    Homees
                  </Link>
                </div>
                <p className="text-white/80">
                  Le comparateur transparent de gestionnaires immobiliers pour trouver le partenaire idéal pour vos biens.
                </p>
              </div>
              <div className="slide-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold mb-4">Comparateur</h3>
                <ul className="space-y-2 text-white/80">
                  <li><Link href="/recherche" className="hover:text-white transition-colors">Rechercher un gestionnaire</Link></li>
                  <li><Link href="/gestionnaires" className="hover:text-white transition-colors">Tous les gestionnaires</Link></li>
                  <li><Link href="/tarifs" className="hover:text-white transition-colors">Comparer les tarifs</Link></li>
                  <li><Link href="/avis" className="hover:text-white transition-colors">Avis clients</Link></li>
                </ul>
              </div>
              <div className="slide-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
                <ul className="space-y-2 text-white/80">
                  <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div className="slide-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-semibold mb-4">Légal</h3>
                <ul className="space-y-2 text-white/80">
                  <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
                  <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
                  <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-white/80">
              <p className="hover:text-white transition-all duration-300">&copy; 2025 Homees. Tous droits réservés.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="https://twitter.com" className="hover:text-white transition-colors">Twitter</a>
                <a href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="https://facebook.com" className="hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>
        </footer>
    </>
    )
}



