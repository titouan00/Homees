# 🎨 Système de Couleurs - Homees

Ce document décrit le système de couleurs centralisé du projet Homees.

## 📋 Vue d'ensemble

Le système de couleurs est organisé autour de :
- **Variables CSS** définies dans `src/app/globals.css`
- **Configuration TypeScript** dans `src/config/colors.ts`
- **Composants réutilisables** utilisant ces couleurs

## 🎯 Couleurs Principales

### Primaire (Emerald/Vert)
Utilisée pour les actions principales, boutons CTA, éléments actifs.

```css
--primary-50: #ecfdf5   /* Très clair */
--primary-100: #d1fae5  /* Clair */
--primary-200: #a7f3d0  /* */
--primary-300: #6ee7b7  /* */
--primary-400: #34d399  /* */
--primary-500: #10b981  /* Base */
--primary-600: #059669  /* Foncé (défaut boutons) */
--primary-700: #047857  /* */
--primary-800: #065f46  /* */
--primary-900: #064e3b  /* Très foncé */
```

### Secondaire (Blue/Bleu)
Utilisée pour les informations, liens, éléments secondaires.

```css
--secondary-50: #eff6ff   /* Très clair */
--secondary-100: #dbeafe  /* Clair */
--secondary-200: #bfdbfe  /* */
--secondary-300: #93c5fd  /* */
--secondary-400: #60a5fa  /* */
--secondary-500: #3b82f6  /* Base */
--secondary-600: #2563eb  /* Foncé */
--secondary-700: #1d4ed8  /* */
--secondary-800: #1e40af  /* */
--secondary-900: #1e3a8a  /* Très foncé */
```

## 🚦 Couleurs d'État

### Success (Vert)
```css
--success-50: #ecfdf5
--success-100: #d1fae5
--success-500: #10b981
--success-600: #059669
--success-700: #047857
```

### Warning (Orange)
```css
--warning-50: #fffbeb
--warning-100: #fef3c7
--warning-500: #f59e0b
--warning-600: #d97706
--warning-700: #b45309
```

### Error (Rouge)
```css
--error-50: #fef2f2
--error-100: #fee2e2
--error-500: #ef4444
--error-600: #dc2626
--error-700: #b91c1c
```

### Info (Bleu)
```css
--info-50: #eff6ff
--info-100: #dbeafe
--info-500: #3b82f6
--info-600: #2563eb
--info-700: #1d4ed8
```

## 🛠️ Utilisation

### Classes CSS Personnalisées

```html
<!-- Couleurs primaires -->
<div class="bg-primary-600 text-white">Bouton principal</div>
<div class="text-primary-600">Texte primaire</div>
<div class="border-primary-200">Bordure primaire</div>

<!-- Classes utilitaires -->
<input class="focus-primary" />
<button class="hover-primary">Bouton avec hover</button>
```

### Configuration TypeScript

```typescript
import { colorClasses, getColorClass } from '@/config/colors';

// Classes prédéfinies
const buttonClass = colorClasses.button.primary;
const badgeClass = colorClasses.badge.success;

// Génération dynamique
const bgClass = getColorClass.bg('primary', '600');
const textClass = getColorClass.text('secondary', '700');
```

### Composants Réutilisables

```tsx
import CustomButton from '@/components/ui/CustomButton';
import Badge, { StatusBadge } from '@/components/ui/Badge';

// Boutons
<CustomButton variant="primary">Action principale</CustomButton>
<CustomButton variant="secondary">Action secondaire</CustomButton>
<CustomButton variant="success">Valider</CustomButton>

// Badges
<Badge variant="primary">Nouveau</Badge>
<StatusBadge status="libre" />
<StatusBadge status="occupe" />
```

## 📦 Composants Disponibles

### CustomButton
- **Variantes** : `primary`, `secondary`, `success`, `warning`, `error`, `ghost`
- **Tailles** : `sm`, `md`, `lg`
- **Props** : `fullWidth`, `loading`, `icon`

### Badge
- **Variantes** : `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`
- **Tailles** : `sm`, `md`, `lg`
- **StatusBadge** : Badge spécialisé pour les statuts

## 🎨 Mapping des Statuts

```typescript
const statusColors = {
  libre: 'success',        // Vert
  occupe: 'info',         // Bleu
  en_travaux: 'warning',  // Orange
  actif: 'success',       // Vert
  inactif: 'neutral',     // Gris
  en_attente: 'warning',  // Orange
  rejete: 'error',        // Rouge
  valide: 'success',      // Vert
};
```

## 🔄 Migration

### Avant (classes Tailwind directes)
```html
<button class="bg-emerald-600 hover:bg-emerald-700 text-white">
  Bouton
</button>
```

### Après (système centralisé)
```html
<button class="bg-primary-600 hover-primary text-white">
  Bouton
</button>
```

Ou mieux encore :
```tsx
<CustomButton variant="primary">Bouton</CustomButton>
```

## ✅ Avantages

1. **Cohérence** : Couleurs uniformes dans toute l'application
2. **Maintenabilité** : Changement centralisé des couleurs
3. **Accessibilité** : Contrastes et états de focus standardisés
4. **Performance** : Variables CSS natives, pas de JavaScript
5. **Flexibilité** : Système extensible et configurable
6. **Type Safety** : Types TypeScript pour éviter les erreurs

## 🚀 Bonnes Pratiques

1. **Utilisez les composants** plutôt que les classes directes
2. **Respectez la hiérarchie** : primary > secondary > neutral
3. **Utilisez les couleurs d'état** pour les feedbacks
4. **Testez l'accessibilité** avec les contrastes
5. **Documentez** les nouvelles couleurs ajoutées

## 📝 Exemples Concrets

### Formulaire
```tsx
<input className="focus-primary" />
<CustomButton variant="primary" type="submit">
  Envoyer
</CustomButton>
<CustomButton variant="ghost" type="button">
  Annuler
</CustomButton>
```

### Alertes
```tsx
<div className="bg-success-light border-success text-success-light">
  Succès !
</div>
<div className="bg-error-light border-error text-error-light">
  Erreur !
</div>
```

### Navigation
```tsx
<nav className="border-primary-200">
  <a className="text-primary-600 hover-primary-light">
    Lien actif
  </a>
</nav>
``` 