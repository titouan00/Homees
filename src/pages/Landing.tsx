import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, History, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Simplifiez la gestion de vos biens immobiliers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Une plateforme tout-en-un pour gérer efficacement la maintenance de vos propriétés et trouver des artisans certifiés.
            </p>
            <div className="flex space-x-4">
              <Link to="/inscription" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#features" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                En savoir plus
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
              alt="Property Management"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Fonctionnalités principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wrench className="h-8 w-8 text-blue-600" />}
              title="Maintenance simplifiée"
              description="Accédez à un réseau d'artisans certifiés et gérez facilement vos interventions."
            />
            <FeatureCard
              icon={<History className="h-8 w-8 text-blue-600" />}
              title="Suivi détaillé"
              description="Gardez un historique complet des interventions et des rapports de maintenance."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Artisans certifiés"
              description="Collaborez avec des professionnels vérifiés et fiables pour vos travaux."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir Homees ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <BenefitItem text="Gestion centralisée de tous vos biens immobiliers" />
            <BenefitItem text="Accès à un réseau d'artisans qualifiés et certifiés" />
            <BenefitItem text="Suivi en temps réel des interventions" />
            <BenefitItem text="Historique complet des maintenances" />
            <BenefitItem text="Rapports détaillés sur l'état de vos biens" />
            <BenefitItem text="Support client dédié" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Prêt à simplifier la gestion de vos biens ?
          </h2>
          <Link to="/inscription" className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block">
            Commencer maintenant
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-center space-x-3">
      <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

export default Landing;