"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import { ArrowRight, Users, Home, Star, TrendingUp, MessageCircle, ShieldCheck, Building2, Smile, HelpCircle } from "lucide-react";

// Images libres (pexels/unsplash)
const heroImg = "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80";
const heroImg2 = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80";
// Tableau d'avis dynamiques
const testimonials = [
  {
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Claire M.",
    city: "Lyon",
    text: "Grâce à Homees, j'ai trouvé un gestionnaire fiable en 48h. L'interface est claire et le support au top !"
  },
  {
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Marc D.",
    city: "Paris",
    text: "La comparaison des offres est super simple, et j'ai pu discuter avec plusieurs gestionnaires avant de choisir."
  },
  {
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Julien T.",
    city: "Marseille",
    text: "Le suivi des loyers et la messagerie intégrée me font gagner un temps fou. Je recommande à tous les propriétaires !"
  },
  {
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Sophie L.",
    city: "Bordeaux",
    text: "Service client très réactif, plateforme intuitive, et gestionnaire trouvé en moins de 24h. Bravo Homees !"
  },
  {
    img: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Antoine P.",
    city: "Toulouse",
    text: "J'ai pu comparer les tarifs et les services en toute transparence. Homees m'a permis d'économiser sur mes frais de gestion."
  },
];

// Ajout d'un composant pour l'effet glow
const Glow = () => (
  <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-40 bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 animate-pulse pointer-events-none z-0" />
);

export default function HomePage() {
  // KPIs dynamiques
  const [kpis, setKpis] = useState({
    gestionnaires: 0,
    proprietaires: 0,
    biens: 0,
    note: 4.8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKpis() {
      setLoading(true);
      // Nombre de gestionnaires
      const { count: gestionnaires } = await supabase
        .from("utilisateurs")
        .select("id", { count: "exact" })
        .eq("rôle", "gestionnaire");
      // Nombre de propriétaires
      const { count: proprietaires } = await supabase
        .from("utilisateurs")
        .select("id", { count: "exact" })
        .eq("rôle", "proprietaire");
      // Nombre de biens
      const { count: biens } = await supabase
        .from("propriete")
        .select("id", { count: "exact" });
      // Note moyenne (fictive si pas d'avis)
      const { data: avis } = await supabase
        .from("avis")
        .select("note");
      let note = 4.8;
      if (avis && avis.length > 0) {
        note = Number((
          avis.reduce((acc, a) => acc + (a.note || 0), 0) / avis.length
        ).toFixed(1));
      }
      setKpis({
        gestionnaires: gestionnaires || 0,
        proprietaires: proprietaires || 0,
        biens: biens || 0,
        note: note as number,
      });
      setLoading(false);
    }
    fetchKpis();
  }, []);

  // Animation des compteurs
  const AnimatedNumber = ({ value }: { value: number }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) return;
      let increment = end / 40;
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setDisplay(end);
          clearInterval(timer);
        } else {
          setDisplay(Math.round(current));
        }
      }, 20);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
  };

  // Hydratation safe : utiliser les mêmes témoignages côté serveur et client
  const [randomTestimonials, setRandomTestimonials] = useState(testimonials.slice(0, 2));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Seulement côté client, mélanger les témoignages
    const shuffleTestimonials = () => {
      const arr = [...testimonials];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, 2);
    };
    setRandomTestimonials(shuffleTestimonials());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* HERO */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 py-20 md:py-32 max-w-7xl mx-auto gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 z-10"
        >
          <div className="mb-4 flex gap-2 items-center">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Nouveau !</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Plateforme SaaS</span>
            {/* Badge animé utilisateurs */}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow animate-bounce ml-2">
              + de 1000 utilisateurs satisfaits
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Gérez vos biens <span className="text-emerald-600">en toute confiance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-xl">
            <span className="inline-block text-emerald-700 font-semibold mb-1">La gestion immobilière nouvelle génération</span><br/>
            Plateforme tout-en-un pour propriétaires et gestionnaires exigeants. Transparence, efficacité, simplicité.
          </p>
          <div className="mb-8">
            <span className="inline-block text-emerald-700 font-semibold">Essayez gratuitement, sans engagement.</span>
          </div>
          <div className="relative inline-block group">
            <Glow />
            <Link 
              href="/signup" 
              className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg animate-glow"
            >
              Créer mon compte
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col gap-6 items-center"
        >
          <div className="relative w-full max-w-xl h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-100 group">
            <Image
              src={heroImg}
              alt="Maison moderne Homees"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* KPIs */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Gestionnaires inscrits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-b-4 border-emerald-100 hover:scale-105 hover:shadow-2xl transition-all group overflow-hidden"
          >
            {/* Mini-graphique décoratif */}
            <svg className="absolute top-2 right-2 w-10 h-6 opacity-20" viewBox="0 0 40 24" fill="none"><path d="M0 20 Q10 10 20 20 T40 20" stroke="#10b981" strokeWidth="2" fill="none"/></svg>
            <Users className="h-8 w-8 text-emerald-600 mb-2 animate-bounce group-hover:animate-spin" />
            <div className="text-3xl font-bold text-gray-900 group-hover:animate-pulse transition-all duration-200">
              {loading ? "-" : <AnimatedNumber value={kpis.gestionnaires} />}+
            </div>
            <div className="text-sm text-gray-500 mt-1">Gestionnaires inscrits</div>
          </motion.div>
          {/* Propriétaires inscrits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-b-4 border-blue-100 hover:scale-105 hover:shadow-2xl transition-all group overflow-hidden"
          >
            <svg className="absolute top-2 right-2 w-10 h-6 opacity-20" viewBox="0 0 40 24" fill="none"><path d="M0 20 Q10 10 20 20 T40 20" stroke="#3b82f6" strokeWidth="2" fill="none"/></svg>
            <Users className="h-8 w-8 text-blue-600 mb-2 animate-bounce group-hover:animate-spin" />
            <div className="text-3xl font-bold text-gray-900 group-hover:animate-pulse transition-all duration-200">
              {loading ? "-" : <AnimatedNumber value={kpis.proprietaires} />}+
            </div>
            <div className="text-sm text-gray-500 mt-1">Propriétaires inscrits</div>
          </motion.div>
          {/* Biens gérés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-b-4 border-emerald-100 hover:scale-105 hover:shadow-2xl transition-all group overflow-hidden"
          >
            <svg className="absolute top-2 right-2 w-10 h-6 opacity-20" viewBox="0 0 40 24" fill="none"><path d="M0 20 Q10 10 20 20 T40 20" stroke="#10b981" strokeWidth="2" fill="none"/></svg>
            <Home className="h-8 w-8 text-emerald-500 mb-2 animate-bounce group-hover:animate-spin" />
            <div className="text-3xl font-bold text-gray-900 group-hover:animate-pulse transition-all duration-200">
              {loading ? "-" : <AnimatedNumber value={kpis.biens} />}+
            </div>
            <div className="text-sm text-gray-500 mt-1">Biens gérés</div>
          </motion.div>
          {/* Note moyenne */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-b-4 border-yellow-100 hover:scale-105 hover:shadow-2xl transition-all group overflow-hidden"
          >
            <svg className="absolute top-2 right-2 w-10 h-6 opacity-20" viewBox="0 0 40 24" fill="none"><path d="M0 20 Q10 10 20 20 T40 20" stroke="#facc15" strokeWidth="2" fill="none"/></svg>
            <Star className="h-8 w-8 text-yellow-400 mb-2 animate-bounce group-hover:animate-spin" />
            <div className="text-3xl font-bold text-gray-900 group-hover:animate-pulse transition-all duration-200">
              {loading ? "-" : kpis.note}
            </div>
            <div className="text-sm text-gray-500 mt-1">Note moyenne</div>
          </motion.div>
        </div>
      </section>

      {/* FONCTIONNALITÉS CLÉS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Fonctionnalités clés de Homees
          </h2>
          <div className="grid md:grid-cols-4 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-emerald-200 hover:scale-105 hover:shadow-xl transition-all group">
              <ShieldCheck className="h-10 w-10 text-emerald-600 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Gestion centralisée</h3>
              <p className="text-gray-600 text-center">Pilotez tous vos biens, locataires et documents depuis une seule plateforme intuitive.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-200 hover:scale-105 hover:shadow-xl transition-all group">
              <MessageCircle className="h-10 w-10 text-blue-600 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Messagerie sécurisée</h3>
              <p className="text-gray-600 text-center">Discutez en temps réel avec vos gestionnaires ou propriétaires, en toute confidentialité.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-emerald-200 hover:scale-105 hover:shadow-xl transition-all group">
              <TrendingUp className="h-10 w-10 text-emerald-500 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Statistiques en temps réel</h3>
              <p className="text-gray-600 text-center">Suivez vos revenus, vos demandes et l'état de vos biens en un clin d'œil.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-200 hover:scale-105 hover:shadow-xl transition-all group">
              <Smile className="h-10 w-10 text-yellow-500 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Support premium</h3>
              <p className="text-gray-600 text-center">Une équipe dédiée pour vous accompagner à chaque étape, 7j/7.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE - TIMELINE MODERNE */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Comment ça marche ?
          </h2>
          <div className="relative flex flex-col items-center">
            {/* Connecteur vertical */}
            <div className="absolute left-1/2 -translate-x-1/2 top-12 bottom-12 w-1 bg-gradient-to-b from-emerald-300 via-blue-200 to-emerald-100 rounded-full z-0 animate-pulse" />
            {/* Étape 1 */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative z-10 flex flex-col items-center mb-16 group">
              <div className="bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full p-4 shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-14 w-14 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl px-8 py-6 shadow-xl text-center">
                <span className="text-2xl font-bold text-emerald-600 mb-2 block">1</span>
                <h3 className="text-xl font-semibold mb-2">Inscrivez-vous gratuitement</h3>
                <p className="text-gray-600">Créez votre compte en quelques clics et accédez à votre espace personnalisé.</p>
              </div>
            </motion.div>
            {/* Connecteur pointillé animé */}
            <div className="w-1 h-10 bg-gradient-to-b from-emerald-300 to-blue-200 rounded-full animate-pulse" />
            {/* Étape 2 */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10 flex flex-col items-center mb-16 group">
              <div className="bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full p-4 shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-14 w-14 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl px-8 py-6 shadow-xl text-center">
                <span className="text-2xl font-bold text-blue-600 mb-2 block">2</span>
                <h3 className="text-xl font-semibold mb-2">Comparez & échangez</h3>
                <p className="text-gray-600">Trouvez le gestionnaire idéal, comparez les offres et discutez en toute sécurité.</p>
              </div>
            </motion.div>
            <div className="w-1 h-10 bg-gradient-to-b from-blue-200 to-emerald-200 rounded-full animate-pulse" />
            {/* Étape 3 */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative z-10 flex flex-col items-center group">
              <div className="bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full p-4 shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <Home className="h-14 w-14 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl px-8 py-6 shadow-xl text-center">
                <span className="text-2xl font-bold text-emerald-600 mb-2 block">3</span>
                <h3 className="text-xl font-semibold mb-2">Gérez vos biens simplement</h3>
                <p className="text-gray-600">Suivez vos biens, vos demandes et vos revenus en temps réel depuis votre dashboard.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Pourquoi choisir Homees&nbsp;?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Transparence totale */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-gradient-to-br from-yellow-50 to-emerald-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-yellow-300 hover:scale-105 hover:shadow-xl transition-all group">
              <Star className="h-10 w-10 text-yellow-400 mb-4 group-hover:animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Transparence totale</h3>
              <p className="text-gray-600 text-center">Tarifs clairs, avis vérifiés, aucune mauvaise surprise. Vous savez toujours à quoi vous attendre.</p>
            </motion.div>
            {/* Communauté engagée */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-blue-300 hover:scale-105 hover:shadow-xl transition-all group">
              <Users className="h-10 w-10 text-emerald-600 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Communauté engagée</h3>
              <p className="text-gray-600 text-center">Des gestionnaires et propriétaires actifs, une équipe support réactive et à l'écoute.</p>
            </motion.div>
            {/* Outils puissants */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-emerald-300 hover:scale-105 hover:shadow-xl transition-all group">
              <TrendingUp className="h-10 w-10 text-blue-600 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Outils puissants</h3>
              <p className="text-gray-600 text-center">Dashboard intuitif, messagerie intégrée, statistiques avancées pour piloter votre activité.</p>
            </motion.div>
            {/* Confiance & sécurité */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative bg-gradient-to-br from-emerald-100 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-emerald-400 hover:scale-105 hover:shadow-xl transition-all group">
              <ShieldCheck className="h-10 w-10 text-emerald-700 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold mb-2">Confiance & sécurité</h3>
              <p className="text-gray-600 text-center">Plateforme notée 5/5 par nos utilisateurs. Données protégées et support premium.</p>
            </motion.div>
          </div>
          {/* Comparatif visuel rapide */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow">Homees</span>
              <span className="text-gray-400 font-bold">vs.</span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-bold text-sm shadow">Agence classique</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="bg-emerald-50 rounded-xl p-4 shadow border border-emerald-100">
                <span className="font-bold text-emerald-700">100% digital</span><br/>
                <span className="text-emerald-500">Accès 24/7</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow border border-gray-100">
                <span className="font-bold text-gray-700">RDV physique</span><br/>
                <span className="text-gray-400">Horaires limités</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 shadow border border-emerald-100">
                <span className="font-bold text-emerald-700">Tarifs transparents</span><br/>
                <span className="text-emerald-500">Sans frais cachés</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow border border-gray-100">
                <span className="font-bold text-gray-700">Frais opaques</span><br/>
                <span className="text-gray-400">Surprises fréquentes</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 shadow border border-emerald-100">
                <span className="font-bold text-emerald-700">Support 7j/7</span><br/>
                <span className="text-emerald-500">Réponse rapide</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow border border-gray-100">
                <span className="font-bold text-gray-700">Support lent</span><br/>
                <span className="text-gray-400">Délais importants</span>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <span className="inline-flex items-center gap-1 bg-white border border-emerald-200 rounded-full px-4 py-2 text-emerald-700 font-bold shadow">
                <Star className="h-4 w-4 text-yellow-400" />
                Noté 5/5 sur Trustpilot
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Ils nous font confiance
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {randomTestimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-b-4 ${i % 2 === 0 ? 'border-emerald-100' : 'border-blue-100'} hover:scale-105 hover:shadow-xl transition-all`}
              >
                <Image src={t.img} alt={t.name} width={64} height={64} className="rounded-full mb-4" />
                <p className="text-lg text-gray-700 mb-4">“{t.text}”</p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{t.name}</span>
                  <span className="text-gray-500 text-sm">Propriétaire à {t.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à gérer vos biens autrement ?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Rejoignez la communauté Homees et découvrez une nouvelle façon de gérer votre patrimoine immobilier.
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-emerald-700 px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center group text-lg animate-glow"
          >
            Créer mon compte
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}