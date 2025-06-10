import { Message } from './types';

/**
 * Service pour gérer les interactions avec l'API du chatbot
 */

/**
 * Réponses de fallback spécialisées Homees
 */
export const getFallbackResponse = (userMessage: string): string => {
  const normalizedMessage = userMessage.toLowerCase();
  
  if (normalizedMessage.includes('tarif') || normalizedMessage.includes('prix') || normalizedMessage.includes('coût') || normalizedMessage.includes('gratuit')) {
    return "Homees est entièrement gratuit pour les propriétaires ! Aucun frais d'inscription, aucun abonnement. Nous sommes rémunérés uniquement par nos partenaires gestionnaires via des commissions. Nos tarifs sont très compétitifs par rapport à la concurrence traditionnelle.";
  }
  
  if (normalizedMessage.includes('comment') && (normalizedMessage.includes('marche') || normalizedMessage.includes('fonctionne'))) {
    return "Notre plateforme vous permet de comparer les gestionnaires immobiliers en 3 étapes simples : 1) Recherchez selon vos critères (localisation, type de bien, services) 2) Consultez les profils détaillés et avis authentiques 3) Contactez directement les gestionnaires qui vous intéressent via notre messagerie sécurisée.";
  }
  
  if (normalizedMessage.includes('gestionnaire') || normalizedMessage.includes('partenaire') || normalizedMessage.includes('rejoindre')) {
    return "Pour devenir gestionnaire partenaire chez Homees, vous devez être certifié et répondre à nos critères de qualité. Le processus inclut la vérification de vos certifications et la création de votre profil détaillé. Contactez-nous via notre formulaire en précisant 'Candidature Gestionnaire'.";
  }

  if (normalizedMessage.includes('zone') || normalizedMessage.includes('ville') || normalizedMessage.includes('disponible') || normalizedMessage.includes('paris') || normalizedMessage.includes('lyon') || normalizedMessage.includes('marseille')) {
    return "Actuellement, Homees est disponible à Paris uniquement. Nous prévoyons d'étendre notre service à Lyon au Q2 2024, puis à Marseille au Q3 2024. L'expansion vers d'autres grandes villes françaises suivra progressivement.";
  }

  if (normalizedMessage.includes('avis') || normalizedMessage.includes('note') || normalizedMessage.includes('évaluation')) {
    return "Notre système d'avis est 100% authentique : seuls les propriétaires ayant réellement échangé avec un gestionnaire via notre plateforme peuvent laisser un avis. Cela garantit la fiabilité des notes et commentaires que vous consultez.";
  }

  if (normalizedMessage.includes('contact') || normalizedMessage.includes('aide') || normalizedMessage.includes('support')) {
    return "Pour une assistance personnalisée, vous pouvez nous contacter via notre formulaire de contact disponible sur notre site. Notre équipe vous répondra rapidement pour vous accompagner dans vos démarches.";
  }

  if (normalizedMessage.includes('inscription') || normalizedMessage.includes('compte') || normalizedMessage.includes('inscrire')) {
    return "L'inscription sur Homees est simple et gratuite ! Cliquez sur 'S'inscrire' en haut à droite, choisissez votre profil (propriétaire ou gestionnaire), et complétez vos informations. Vous aurez immédiatement accès à notre plateforme.";
  }

  if (normalizedMessage.includes('merci') || normalizedMessage.includes('parfait') || normalizedMessage.includes('bien')) {
    return "Je suis ravi d'avoir pu vous aider ! N'hésitez pas si vous avez d'autres questions sur Homees. 😊";
  }
  
  // Réponse par défaut différente pour éviter la boucle
  return "Je comprends votre demande. Voici ce que je peux vous dire : Homees est votre plateforme de référence pour trouver le gestionnaire immobilier idéal. Vous pouvez comparer les tarifs, consulter les avis et contacter directement les professionnels. Avez-vous une question spécifique sur nos services ?";
};

/**
 * Appel à l'API Groq via notre route Next.js
 * Utilise l'intelligence artificielle avec le contexte métier Homees
 */
export const getAIResponse = async (userMessage: string, messages: Message[]): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: messages
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.response) {
      return data.response;
    }
    
    // Si l'API retourne un fallback
    if (data.fallback && data.response) {
      return data.response;
    }
    
    throw new Error('Réponse API invalide');
    
  } catch (error) {
    console.error('Erreur API Groq:', error);
    
    // En cas d'erreur, utiliser notre système de fallback local
    return getFallbackResponse(userMessage);
  }
};