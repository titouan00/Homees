'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isLanding = pathname === '/';
  
    return (
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 transition-all duration-300 hover:bg-white/90">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
            >
              Homees
            </Link>
            <div className="hidden md:flex space-x-8">
              {isLanding ? (
                <>
                  <a href="#features" className="nav-link text-gray-600 hover:text-blue-600 transition-all duration-300">Fonctionnalités</a>
                  <a href="#benefits" className="nav-link text-gray-600 hover:text-blue-600 transition-all duration-300">Avantages</a>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className={`nav-link transition-all duration-300 ${pathname === '/dashboard' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>Dashboard</Link>
                  <Link href="/messagerie" className={`nav-link transition-all duration-300 ${pathname === '/messagerie' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>Messagerie</Link>
                  <Link href="/contact" className={`nav-link transition-all duration-300 ${pathname === '/contact' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>Contact</Link>
                </>
              )}
            </div>
            <div>
              {isLanding ? (
                <Link href="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Commencer
                </Link>
              ) : (
                <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <span>Mon profil</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    );
  }
  