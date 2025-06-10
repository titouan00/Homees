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
  
  return "Je suis là pour vous aider avec toutes vos questions sur Homees ! Pour une assistance personnalisée, n'hésitez pas à contacter notre équipe via le formulaire de contact ou à explorer notre plateforme pour découvrir nos services de mise en relation entre propriétaires et gestionnaires.";
};

/**
 * Appel à l'API OpenAI
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
        conversationHistory: messages.slice(-7) // Garde les 7 derniers messages pour le contexte
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur API');
    }

    const data = await response.json();
    
    if (data.error && data.fallback) {
      return getFallbackResponse(userMessage);
    }
    
    return data.response || getFallbackResponse(userMessage);
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API:', error);
    return getFallbackResponse(userMessage);
  }
}; 