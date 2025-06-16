'use client';

import { Eye, EyeSlash, Envelope, Lock, User } from '@phosphor-icons/react';
import AuthInput from '@/components/ui/AuthInput';

interface SignupStep1Props {
  formData: {
    nom: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'proprietaire' | 'gestionnaire';
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

/**
 * Étape 1 du signup : Informations de base
 * Logique préservée, design optimisé
 */
const SignupStep1: React.FC<SignupStep1Props> = ({
  formData,
  showPassword,
  showConfirmPassword,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword
}) => {
  return (
    <div className="space-y-4">
      <AuthInput
        label="Nom complet *"
        name="nom"
        type="text"
        value={formData.nom}
        onChange={onInputChange}
        icon={User}
        placeholder="Jean Dupont"
        required
      />

      <AuthInput
        label="Adresse email *"
        name="email"
        type="email"
        value={formData.email}
        onChange={onInputChange}
        icon={Envelope}
        placeholder="jean@exemple.com"
        required
      />

      <AuthInput
        label="Mot de passe *"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={onInputChange}
        icon={Lock}
        placeholder="••••••••"
        rightIcon={
          <button
            type="button"
            onClick={onTogglePassword}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        required
      />

      <AuthInput
        label="Confirmer le mot de passe *"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={onInputChange}
        icon={Lock}
        placeholder="••••••••"
        rightIcon={
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showConfirmPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        required
      />

      <div>
        <label className="block text-white font-medium mb-2 text-sm">
          Vous êtes * 
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={onInputChange}
          className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
          required
        >
          <option value="proprietaire" className="text-gray-800">Propriétaire - Je cherche un gestionnaire</option>
          <option value="gestionnaire" className="text-gray-800">Gestionnaire - Je veux proposer mes services</option>
        </select>
      </div>
    </div>
  );
};

export default SignupStep1; 