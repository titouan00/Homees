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
const testimonialImg1 = "https://randomuser.me/api/portraits/women/44.jpg";
const testimonialImg2 = "https://randomuser.me/api/portraits/men/32.jpg";
const dashboardImg = "/non.jpg";
const partnerLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/9/96/Supabase_logo.png"
];

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
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gérez vos biens <span className="text-emerald-600">en toute confiance</span>
            </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-xl">
            La plateforme nouvelle génération pour propriétaires et gestionnaires immobiliers exigeants. Transparence, efficacité, simplicité.<br/>
            <span className="inline-block mt-2 text-emerald-700 font-semibold">Essayez gratuitement, sans engagement.</span>
          </p>
              <Link 
                href="/signup" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg animate-glow"
              >
            Créer mon compte
            <ArrowRight className="h-5 w-5" />
              </Link>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-b-4 border-emerald-100 hover:scale-105 hover:shadow-xl transition-all">
            <Users className="h-8 w-8 text-emerald-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "-" : <AnimatedNumber value={kpis.gestionnaires} />}+
          </div>
            <div className="text-sm text-gray-500 mt-1">Gestionnaires inscrits</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-b-4 border-blue-100 hover:scale-105 hover:shadow-xl transition-all">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "-" : <AnimatedNumber value={kpis.proprietaires} />}+
            </div>
            <div className="text-sm text-gray-500 mt-1">Propriétaires inscrits</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-b-4 border-emerald-100 hover:scale-105 hover:shadow-xl transition-all">
            <Home className="h-8 w-8 text-emerald-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "-" : <AnimatedNumber value={kpis.biens} />}+
            </div>
            <div className="text-sm text-gray-500 mt-1">Biens gérés</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-b-4 border-yellow-100 hover:scale-105 hover:shadow-xl transition-all">
            <Star className="h-8 w-8 text-yellow-400 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "-" : kpis.note}
            </div>
            <div className="text-sm text-gray-500 mt-1">Note moyenne</div>
          </motion.div>
        </div>
      </section>

      {/* APERÇU DASHBOARD */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-0 flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex-1 max-w-xl px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Aperçu du dashboard propriétaire
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Visualisez et pilotez tous vos biens, demandes et revenus en temps réel. Un tableau de bord moderne, intuitif et sécurisé.
            </p>
            <ul className="mb-8 space-y-2 text-gray-700">
              <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Sécurité et confidentialité garanties</li>
              <li className="flex items-center gap-2"><Building2 className="h-5 w-5 text-blue-600" /> Vue synthétique de votre portefeuille</li>
              <li className="flex items-center gap-2"><Smile className="h-5 w-5 text-yellow-500" /> Expérience utilisateur fluide</li>
            </ul>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow font-semibold animate-pulse">
              Découvrir gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1 w-full">
            <div className="relative w-full max-w-full h-72 md:h-[32rem] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-100 group mx-auto">
              <Image
                src={dashboardImg}
                alt="Aperçu du dashboard Homees"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/80 to-transparent pointer-events-none" />
            </div>
          </motion.div>
            </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-emerald-100 hover:scale-105 hover:shadow-xl transition-all">
              <TrendingUp className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inscrivez-vous gratuitement</h3>
              <p className="text-gray-600 text-center">Créez votre compte en quelques clics et accédez à votre espace personnalisé.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-100 hover:scale-105 hover:shadow-xl transition-all">
              <MessageCircle className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comparez & échangez</h3>
              <p className="text-gray-600 text-center">Trouvez le gestionnaire idéal, comparez les offres et discutez en toute sécurité.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-emerald-100 hover:scale-105 hover:shadow-xl transition-all">
              <Home className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gérez vos biens simplement</h3>
              <p className="text-gray-600 text-center">Suivez vos biens, vos demandes et vos revenus en temps réel depuis votre dashboard.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Pourquoi choisir Homees ?
            </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-emerald-200 hover:scale-105 hover:shadow-xl transition-all">
              <Star className="h-10 w-10 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparence totale</h3>
              <p className="text-gray-600 text-center">Tarifs clairs, avis vérifiés, aucune mauvaise surprise. Vous savez toujours à quoi vous attendre.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-blue-200 hover:scale-105 hover:shadow-xl transition-all">
              <Users className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Communauté engagée</h3>
              <p className="text-gray-600 text-center">Des gestionnaires et propriétaires actifs, une équipe support réactive et à l'écoute.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center border-l-4 border-emerald-200 hover:scale-105 hover:shadow-xl transition-all">
              <TrendingUp className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Outils puissants</h3>
              <p className="text-gray-600 text-center">Dashboard intuitif, messagerie intégrée, statistiques avancées pour piloter votre activité.</p>
            </motion.div>
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
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-b-4 border-emerald-100 hover:scale-105 hover:shadow-xl transition-all">
              <Image src={testimonialImg1} alt="Claire M." width={64} height={64} className="rounded-full mb-4" />
              <p className="text-lg text-gray-700 mb-4">“Grâce à Homees, j'ai trouvé un gestionnaire fiable en 48h. L'interface est claire et le support au top !”</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Claire M.</span>
                <span className="text-gray-500 text-sm">Propriétaire à Lyon</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-b-4 border-blue-100 hover:scale-105 hover:shadow-xl transition-all">
              <Image src={testimonialImg2} alt="Marc D." width={64} height={64} className="rounded-full mb-4" />
              <p className="text-lg text-gray-700 mb-4">“La comparaison des offres est super simple, et j'ai pu discuter avec plusieurs gestionnaires avant de choisir.”</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Marc D.</span>
                <span className="text-gray-500 text-sm">Propriétaire à Paris</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            FAQ
          </h2>
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-start gap-4">
              <HelpCircle className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Est-ce que Homees est vraiment gratuit ?</h3>
                <p className="text-gray-600">Oui, l'inscription et l'utilisation de base sont gratuites pour tous les propriétaires et gestionnaires. Des options avancées sont disponibles en abonnement Pro.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-start gap-4">
              <HelpCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Comment sont sélectionnés les gestionnaires ?</h3>
                <p className="text-gray-600">Tous les gestionnaires sont vérifiés et notés par la communauté. Vous pouvez consulter les avis et comparer les offres en toute transparence.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-start gap-4">
              <HelpCircle className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Puis-je gérer plusieurs biens avec un seul compte ?</h3>
                <p className="text-gray-600">Absolument ! Homees est conçu pour gérer un ou plusieurs biens, que vous soyez particulier ou professionnel.</p>
            </div>
            </motion.div>
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