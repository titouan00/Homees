'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    return (
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 transition-all duration-300 hover:bg-white/90 shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
            >
              Homees
            </Link>
  

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                S'inscrire
              </Link>
            </div>
  
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
  
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-medium transition-colors ${
                    pathname === '/' 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Accueil
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-medium transition-colors ${
                    pathname === '/contact' 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Contact
                </Link>
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
}
  