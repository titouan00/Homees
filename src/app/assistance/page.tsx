"use client";

import { useState } from "react";
import { MessageCircle, HelpCircle, Search, ChevronRight } from "lucide-react";

export default function Assistance() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const faqCategories = [
    {
      id: 1,
      title: "Compte et inscription",
      questions: [
        {
          q: "Comment créer un compte ?",
          a: "Pour créer un compte, cliquez sur le bouton \"Commencer\" en haut de la page et suivez les étapes d'inscription."
        },
        {
          q: "Comment changer mon mot de passe ?",
          a: "Vous pouvez changer votre mot de passe dans les paramètres de votre compte, section \"Sécurité\"."
        }
      ]
    },
    {
      id: 2,
      title: "Gestion des biens",
      questions: [
        {
          q: "Comment ajouter un nouveau bien ?",
          a: "Dans votre tableau de bord, cliquez sur \"Ajouter un bien\" et remplissez les informations requises."
        },
        {
          q: "Comment modifier les informations d'un bien ?",
          a: "Accédez à la page du bien concerné et cliquez sur \"Modifier\" pour mettre à jour les informations."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Comment pouvons-nous vous aider ?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une réponse..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 mt-2">
                {category.questions.length} questions
              </p>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{selectedCategory.title}</h2>
            <div className="space-y-6">
              {selectedCategory.questions.map((item, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Besoin de plus d'aide ?</h2>
              <p className="text-gray-600">Notre équipe est disponible pour vous aider</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span>Chat</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                <HelpCircle className="h-5 w-5" />
                <span>Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}