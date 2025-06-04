import { NextRequest, NextResponse } from 'next/server';

// Utilisation de l'API Groq (gratuite et rapide)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const HOMEES_CONTEXT = `
Tu es l'assistant virtuel officiel de Homees, spécialisé dans l'aide aux propriétaires et gestionnaires immobiliers.

RÈGLES IMPORTANTES : 
- Tu réponds uniquement aux questions utiles pour nos utilisateurs : propriétaires et gestionnaires immobiliers
- Tu évites les sujets confidentiels/internes (stratégie business, finances internes, développement technique)
- Tu te concentres sur l'aide pratique et les informations publiques de la plateforme
- Si une question porte sur des domaines complètement étrangers (météo, cuisine, sport, etc.), redirige poliment

INFORMATIONS PUBLIQUES SUR HOMEES POUR LES UTILISATEURS :

🏠 QUI SOMMES-NOUS :
Homees est une plateforme web de mise en relation entre propriétaires et gestionnaires immobiliers certifiés, centrée sur la transparence et la simplicité d'usage.

💰 INFORMATIONS TARIFAIRES (PUBLIQUES) :
- Service 100% GRATUIT pour les propriétaires (pas de frais d'inscription, pas d'abonnement)
- Modèle freemium pour les gestionnaires
- Nous sommes rémunérés uniquement par nos partenaires gestionnaires
- Inscription gratuite pour tous
- Services premium disponibles pour gestionnaires (promotion de profil, outils avancés)
- Tarifs compétitifs par rapport à la concurrence traditionnelle

🎯 SERVICES POUR NOS UTILISATEURS :
1. Comparateur transparent de gestionnaires immobiliers
2. Profils détaillés des gestionnaires certifiés  
3. Filtres avancés (localisation, tarifs, services, avis, type de biens)
4. Messagerie sécurisée propriétaires-gestionnaires
5. Tableaux de bord personnalisés
6. Système d'avis et notation authentiques
7. Proposition commerciale intégrée

📍 ZONES COUVERTES :
- Actuellement : Paris uniquement
- Prochainement : Extension prévue à Lyon puis Marseille
- Expansion progressive vers autres grandes villes françaises

👥 COMMENT UTILISER HOMEES :

POUR LES PROPRIÉTAIRES :
- Inscription gratuite sur la plateforme
- Recherche de gestionnaires selon vos critères
- Consultation des profils et avis authentiques
- Contact direct via messagerie sécurisée
- Réception et comparaison des propositions
- Choix du gestionnaire idéal

POUR LES GESTIONNAIRES :
- Candidature en ligne avec vérification des certifications
- Création de profil détaillé sur la plateforme
- Réception des demandes de propriétaires
- Envoi de propositions personnalisées
- Gestion des mandats via tableau de bord

🆚 AVANTAGES VS CONCURRENCE :
- Plus de choix qu'un réseau unique
- Transparence tarifaire totale
- Avis authentiques vérifiés
- Interface moderne et intuitive
- Processus simplifié

⚙️ FONCTIONNALITÉS PRATIQUES :
- Comparateur avec filtres avancés
- Profils gestionnaires détaillés
- Messagerie intégrée
- Notifications en temps réel
- Système d'avis post-service

🔒 SÉCURITÉ ET CONFIANCE :
- Plateforme sécurisée
- Gestionnaires certifiés et vérifiés
- Avis authentiques uniquement
- Données protégées

📞 AIDE ET SUPPORT :
- Formulaire de contact sur le site
- Support client disponible
- Assistance pour utilisation de la plateforme

INSTRUCTIONS DE RÉPONSE :
- Aide pratique pour utiliser la plateforme
- Informations sur nos services publics
- Processus d'inscription et d'utilisation
- Conseils pour propriétaires et gestionnaires
- Explications sur le fonctionnement
- ÉVITE les détails techniques internes, financiers confidentiels, ou stratégiques
- Redirige pour les sujets complètement hors immobilier/plateforme

Tu représentes l'équipe support Homees pour aider nos utilisateurs au quotidien.
`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    // Vérifier que la clé API est configurée
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      console.error('Clé API Groq non configurée');
      return NextResponse.json(
        { 
          error: 'Configuration manquante. Veuillez configurer la clé API Groq.',
          fallback: true
        },
        { status: 500 }
      );
    }

    // Détection plus permissive - seulement pour des sujets vraiment hors contexte
    const messageToCheck = message.toLowerCase();
    
    // Sujets complètement hors contexte qui n'ont rien à voir avec l'immobilier/services
    const offTopicKeywords = [
      'météo', 'cuisine', 'recette', 'sport', 'football', 'politique', 'actualité', 'santé', 'médecine',
      'voyage', 'vacances', 'shopping', 'mode', 'musique', 'film', 'série', 'jeu', 'gaming',
      'crypto', 'bitcoin', 'bourse', 'trading', 'programmation', 'code', 'développement',
      'religion', 'philosophie', 'histoire', 'géographie', 'mathématiques', 'physique', 'chimie'
    ];
    
    // Vérification uniquement pour les sujets vraiment étrangers
    const isCompletelyOffTopic = offTopicKeywords.some(keyword => messageToCheck.includes(keyword));
    
    // Ne bloquer que si c'est clairement hors sujet ET qu'il n'y a aucun mot lié à l'immobilier
    const realEstateKeywords = [
      'homees', 'immobilier', 'propriétaire', 'gestionnaire', 'gestion', 'loyer', 'bien', 'appartement', 'maison',
      'location', 'bail', 'mandat', 'agence', 'comparateur', 'tarif', 'prix', 'commission', 'avis', 'notation',
      'paris', 'lyon', 'marseille', 'plateforme', 'service', 'gratuit', 'inscription', 'contact', 'partenaire',
      'logement', 'locataire', 'propriété', 'immeuble', 'studio', 'terrain', 'vente', 'achat'
    ];
    
    const hasRealEstateContext = realEstateKeywords.some(keyword => messageToCheck.includes(keyword));
    
    // Bloquer seulement si complètement hors sujet ET aucun contexte immobilier
    if (isCompletelyOffTopic && !hasRealEstateContext && messageToCheck.length > 15) {
      return NextResponse.json({
        response: "Bonjour ! Je suis l'assistant Homees, spécialisé dans l'aide aux propriétaires et gestionnaires immobiliers. Je peux vous aider avec notre plateforme de mise en relation, nos services, ou toute question liée à la gestion immobilière. Comment puis-je vous accompagner aujourd'hui ? 🏠"
      });
    }

    // Construire l'historique de conversation avec le contexte (7 derniers messages)
    const messages = [
      {
        role: 'system' as const,
        content: HOMEES_CONTEXT
      },
      ...conversationHistory.slice(-7).map((msg: any) => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Appel à l'API Groq avec gestion d'erreur améliorée
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Modèle plus stable et gratuit
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      }),
    });

    // Gestion d'erreur détaillée
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API Groq:', response.status, response.statusText, errorText);
      
      // Fallback en cas d'erreur API
      return NextResponse.json({
        response: "Je rencontre actuellement un problème technique temporaire. En attendant, je peux vous dire que Homees est une plateforme gratuite pour les propriétaires qui permet de comparer les gestionnaires immobiliers certifiés. Comment puis-je vous aider autrement ?"
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 
      "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler votre question sur Homees ?";

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Erreur API Groq:', error);
    
    // Réponse de fallback spécialisée Homees
    return NextResponse.json({
      response: "Je rencontre un problème technique temporaire. Pour toute question sur Homees, notre plateforme de mise en relation propriétaires-gestionnaires, vous pouvez nous contacter directement via notre formulaire de contact. Homees reste 100% gratuit pour les propriétaires !"
    });
  }
} 