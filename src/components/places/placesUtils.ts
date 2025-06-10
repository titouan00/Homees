import { PARIS_POSTAL_CODES } from '@/lib/constants';

/**
 * Utilitaires pour la validation des adresses parisiennes
 */

/**
 * Vérifie si une adresse est située à Paris
 */
export const isAddressInParis = (place: google.maps.places.PlaceResult): boolean => {
  if (!place.address_components) return false;

  const addressComponents = place.address_components;
  
  for (const component of addressComponents) {
    const types = component.types;
    const longName = component.long_name.toLowerCase();

    // Vérifier le nom de la ville
    if (types.includes('locality') && longName === 'paris') {
      return true;
    }

    // Vérifier les codes postaux parisiens
    if (types.includes('postal_code')) {
      const postalCode = component.long_name;
      if (PARIS_POSTAL_CODES.pattern.test(postalCode)) {
        return true;
      }
    }

    // Vérifier les arrondissements
    if (types.includes('sublocality') && longName.includes('arrondissement')) {
      return true;
    }
  }

  return false;
}; 