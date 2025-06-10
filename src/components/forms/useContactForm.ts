'use client';

import { useState } from 'react';

interface ContactFormData {
  nom: string;
  email: string;
  typeUtilisateur: string;
  message: string;
}

interface ContactFormState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

/**
 * Hook personnalisé pour gérer le formulaire de contact
 */
export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
    typeUtilisateur: '',
    message: ''
  });

  const [state, setState] = useState<ContactFormState>({
    loading: false,
    success: false,
    error: null
  });

  /**
   * Gestionnaire de changement des champs
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser l'erreur quand l'utilisateur tape
    if (state.error) {
      setState(prev => ({ ...prev, error: null }));
    }
  };

  /**
   * Validation du formulaire
   */
  const validateForm = (): boolean => {
    if (!formData.nom.trim()) {
      setState(prev => ({ ...prev, error: 'Le nom est requis' }));
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setState(prev => ({ ...prev, error: 'Email valide requis' }));
      return false;
    }
    if (!formData.typeUtilisateur) {
      setState(prev => ({ ...prev, error: 'Veuillez sélectionner votre profil' }));
      return false;
    }
    if (!formData.message.trim()) {
      setState(prev => ({ ...prev, error: 'Le message est requis' }));
      return false;
    }
    return true;
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulation d'envoi (remplacer par vraie API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, loading: false, success: true }));
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        email: '',
        typeUtilisateur: '',
        message: ''
      });
      
      // Auto-masquer le succès après 5s
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, 5000);
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors de l\'envoi. Veuillez réessayer.'
      }));
    }
  };

  /**
   * Options pour le sélecteur de type d'utilisateur
   */
  const userTypeOptions = [
    { value: '', label: 'Sélectionnez votre profil' },
    { value: 'proprietaire', label: 'Propriétaire - Je cherche un gestionnaire' },
    { value: 'gestionnaire', label: 'Gestionnaire - Je veux rejoindre la plateforme' },
    { value: 'autre', label: 'Autre demande' }
  ];

  return {
    formData,
    state,
    handleInputChange,
    handleSubmit,
    userTypeOptions
  };
}; 