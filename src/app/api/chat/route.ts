import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialisation du client Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Fonction pour détecter si une question est liée à Homees/immobilier
 */
function isHomeeesRelated(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  
  // Mots-clés liés à Homees et l'immobilier
  const homeesKeywords = [
    'homees', 'gestionnaire', 'immobilier', 'propriétaire', 'gestion locative',
    'location', 'loyer', 'bien immobilier', 'appartement', 'maison',
    'tarif', 'prix', 'commission', 'plateforme', 'agence',
    'paris', 'lyon', 'marseille', 'ville', 'zone',
    'avis', 'note', 'évaluation', 'service', 'mandataire',
    'investissement', 'locatif', 'bail', 'tenant', 'landlord',
    'inscription', 'compte', 'profil', 'comparaison',
    'contact', 'aide', 'support', 'comment', 'fonctionne'
  ];
  
  // Vérifier si au moins un mot-clé est présent
  return homeesKeywords.some(keyword => normalizedMessage.includes(keyword));
}

/**
 * Fonction pour compter les questions hors-sujet consécutives
 */
function countConsecutiveOffTopic(conversationHistory: any[]): number {
  if (!conversationHistory || conversationHistory.length === 0) return 0;
  
  let count = 0;
  // Parcourir l'historique en sens inverse pour compter les questions utilisateur consécutives hors-sujet
  for (let i = conversationHistory.length - 1; i >= 0; i--) {
    const msg = conversationHistory[i];
    if (msg.isUser && msg.text) {
      if (!isHomeeesRelated(msg.text)) {
        count++;
      } else {
        break; // Arrêter dès qu'on trouve une question pertinente
      }
    }
  }
  
  return count;
}

/**
 * Prompt système spécialisé pour Homees
 * Basé sur le Business Model Canvas et l'analyse projet
 */
const HOMEES_SYSTEM_PROMPT = `Tu es l'assistant virtuel de Homees, la plateforme française de mise en relation entre propriétaires et gestionnaires immobiliers certifiés.

## À PROPOS D'HOMEES :

**Mission** : Révolutionner la gestion immobilière par la transparence et la simplicité.

**Proposition de valeur unique** :
- Transparence totale : historique complet, localisations, rapports, avis authentiques
- Réseau Certifié : seuls les gestionnaires validés (certifications, assurances, diplômes)
- Comparaison intelligente : filtres avancés (tarifs, services, zones, notation)
- Chat intégré : communication directe et sécurisée
- Visibilité des gestionnaires sur la plateforme

**Business Model** :
- GRATUIT pour les propriétaires (inscription, comparaison, contact)
- FREEMIUM pour gestionnaires : profil basique gratuit, premium payant
- Revenue : commissions sur contrats signés (5-10% premier loyer), abonnements premium, leads sponsorisés

**Segments clients** :
- Propriétaires immobiliers (particuliers et SCI, 1-10 biens, budget 200-500k)
- Petites agences immobilières (moyennes 10 employés, 200-500 mandats)
- Artisans/sociétés de gestion (auto-entrepreneurs, PME)

**Zones couvertes** :
- Actuellement : Paris uniquement
- 2024 Q2 : Extension Lyon
- 2024 Q3 : Extension Marseille
- Puis expansion progressive autres grandes villes

**Services clés** :
- Comparateur de gestionnaires (critères : localisation, tarifs, services, avis)
- Profils gestionnaires détaillés (certifications, zone intervention, tarifs)
- Messagerie sécurisée intégrée
- Système d'avis authentiques (seuls vrais clients peuvent noter)
- Tableaux de bord personnalisés
- Support client dédié

## TON RÔLE :
- Aide les propriétaires à trouver le gestionnaire idéal
- Explique comment fonctionne la plateforme
- Renseigne sur les tarifs, zones, processus
- Guide vers l'inscription et l'utilisation
- Assiste les gestionnaires pour rejoindre le réseau

## STYLE DE COMMUNICATION :
- Professionnel mais accessible
- Expertise immobilière claire
- Transparent sur les tarifs et processus
- Encourage l'utilisation de la plateforme
- Français impeccable, tutoiement

## IMPORTANT - LIMITATION DE CONTEXTE :
Tu ne réponds QU'AUX QUESTIONS liées à Homees, l'immobilier, la gestion locative et les services connexes.
Pour toute question hors-sujet, redirige poliment vers ton domaine d'expertise.

Réponds toujours en restant dans ton rôle d'assistant Homees avec cette expertise métier.`;

export async function POST(request: NextRequest) {
  try {
    // Amélioration de la gestion des erreurs JSON
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('Erreur de parsing JSON:', jsonError);
      return NextResponse.json(
        { error: 'Format JSON invalide' },
        { status: 400 }
      );
    }

    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message requis et doit être une chaîne' },
        { status: 400 }
      );
    }

    // Vérification du contexte Homees
    const isCurrentMessageRelated = isHomeeesRelated(message);
    const consecutiveOffTopicCount = countConsecutiveOffTopic(conversationHistory || []);
    
    // Si la question actuelle est hors-sujet ET on a déjà 2 questions hors-sujet consécutives
    if (!isCurrentMessageRelated && consecutiveOffTopicCount >= 2) {
      return NextResponse.json({
        response: `🏠 **Attention** : Je suis l'assistant spécialisé de **Homees**, votre plateforme immobilière.

Je ne peux répondre qu'aux questions concernant :
✅ **Homees** et nos services
✅ **Gestion immobilière** et gestion locative  
✅ **Propriétaires** et **gestionnaires**
✅ **Investissement locatif**
✅ **Nos zones** (Paris, Lyon, Marseille)

💡 **Comment puis-je vous aider avec votre projet immobilier ?**
- Trouver un gestionnaire pour vos biens ?
- Comprendre nos tarifs et services ?
- Rejoindre notre réseau de partenaires ?

Posez-moi une question sur l'immobilier, je serai ravi de vous aider ! 😊`,
        success: true,
        contextWarning: true
      });
    }

    // Préparer l'historique de conversation pour Groq
    const messages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
      {
        role: 'system' as const,
        content: HOMEES_SYSTEM_PROMPT
      }
    ];

    // Ajouter l'historique de conversation (maximum 10 derniers messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      
      recentHistory.forEach((msg: any) => {
        if (msg.text && typeof msg.text === 'string') {
          messages.push({
            role: msg.isUser ? ('user' as const) : ('assistant' as const),
            content: msg.text
          });
        }
      });
    }

    // Ajouter le message actuel
    messages.push({
      role: 'user' as const,
      content: message
    });

    // Appel à l'API Groq avec le nouveau modèle
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant', // Modèle rapide et disponible
      temperature: 0.7, // Créativité modérée
      max_tokens: 500, // Réponses concises
      top_p: 0.9,
      stream: false
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Pas de réponse de Groq');
    }

    return NextResponse.json({
      response: responseText,
      success: true,
      isHomeeesRelated: isCurrentMessageRelated
    });

  } catch (error) {
    console.error('Erreur API Groq:', error);
    
    // Réponse de fallback en cas d'erreur
    const fallbackResponse = `Je rencontre un problème technique temporaire. En attendant, voici ce que je peux vous dire : 

🏠 **Homees** est votre plateforme de référence pour trouver le gestionnaire immobilier idéal à Paris.

✅ **Totalement gratuit** pour les propriétaires
✅ **Comparaison transparente** des tarifs et services  
✅ **Avis authentiques** de vrais clients
✅ **Gestionnaires certifiés** et vérifiés

Pour une assistance immédiate, contactez-nous via notre formulaire de contact. Notre équipe vous répondra rapidement !`;

    return NextResponse.json({
      response: fallbackResponse,
      success: false,
      fallback: true
    });
  }
}

// Gérer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  );
} 