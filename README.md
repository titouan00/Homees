# Homees

**Homees** est une plateforme SaaS de gestion immobilière nouvelle génération, pensée pour les propriétaires et les gestionnaires. Elle permet de centraliser la gestion des biens, la communication, la recherche de gestionnaires, le suivi des demandes, la comparaison de profils, et bien plus encore.

---

## 🚀 Fonctionnalités principales

- **Dashboard propriétaire** :  
  - Vue d'ensemble de vos biens, demandes, gestionnaires contactés, etc.
  - Comparateur de gestionnaires avancé (filtres, notes, certifications…)
  - Messagerie intégrée, gestion des demandes, notifications.
  - Gestion du profil, paramètres, support.

- **Dashboard gestionnaire** :  
  - Suivi des demandes reçues, gestion des biens, messagerie.
  - Profil public personnalisable (zones, certifications, services…)
  - Statistiques d'activité, notifications, paramètres avancés.

- **Landing page & parcours public** :  
  - Présentation de la solution, KPIs, témoignages, onboarding moderne.

- **Sécurité & Authentification** :  
  - Authentification sécurisée via Supabase.
  - Gestion des rôles (propriétaire, gestionnaire).

- **Expérience utilisateur moderne** :  
  - UI/UX soignée (Next.js, React 19, TailwindCSS, Phosphor Icons…)
  - Composants réutilisables, design responsive, animations.

---

## 🏗️ Architecture technique

- **Frontend** : Next.js 15 (App Router), React 19, TypeScript, TailwindCSS
- **Backend & Auth** : Supabase (PostgreSQL, Auth, Storage)
- **Gestion d'état** : Hooks React, contextes, useMemo/useEffect
- **Composants** : Architecture modulaire (`src/components/`), design system, hooks personnalisés
- **API** : Appels directs à Supabase via `src/lib/supabase-client.ts`
- **Tests** : Structure prête pour tests unitaires et d'intégration

---

## 📁 Structure du projet

```
src/
  app/                # Pages Next.js (public, dashboard, api, etc.)
    dashboard/
      proprietaire/   # Espace propriétaire (biens, demandes, comparateur, etc.)
      gestionnaire/   # Espace gestionnaire (biens, demandes, profil, etc.)
    ...
  components/         # Composants UI réutilisables (navigation, cards, forms, etc.)
  hooks/              # Hooks personnalisés (auth, data, notifications, etc.)
  lib/                # Clients API, helpers (ex: supabase-client.ts)
  services/           # Services métier (notifications, etc.)
  types/              # Types TypeScript partagés
  utils/              # Fonctions utilitaires
  constants/          # Constantes globales
  config/             # Fichiers de configuration
  public/             # Assets statiques (images, icônes, etc.)
```

---

## ⚙️ Installation & démarrage

### 1. Cloner le projet

```bash
git clone https://github.com/ton-org/homees.git
cd homees
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine avec :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
> Récupère ces infos dans ton projet Supabase.

### 4. Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Scripts utiles

- `npm run dev` : Lancer le serveur de développement
- `npm run build` : Build de l'application pour la production
- `npm run start` : Lancer le serveur en mode production
- `npm run lint` : Linter le code

---

## 🧩 Technologies principales

- **Next.js 15** (App Router, SSR/SSG, API routes)
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **Supabase** (auth, base de données, stockage)
- **Phosphor Icons**, **Framer Motion**, **React Hook Form**, **Zod**…

---

## 🔒 Sécurité & bonnes pratiques

- Authentification sécurisée (Supabase)
- Séparation stricte des rôles (propriétaire/gestionnaire)
- Données sensibles jamais exposées côté client
- Respect des conventions de nommage, code commenté et maintenable

---

## 💡 Principe du projet

Homees vise à simplifier la gestion immobilière pour les propriétaires et à offrir aux gestionnaires un outil moderne pour piloter leur activité.  
L'accent est mis sur :
- La centralisation des échanges et des documents
- La transparence (notes, avis, certifications)
- L'automatisation des tâches récurrentes
- L'expérience utilisateur (UI/UX SaaS, responsive, animations)

---

## 📣 Contribution

Les contributions sont les bienvenues !
- Forkez le repo, créez une branche, proposez vos PR.
- Merci de respecter la structure, les conventions et d'ajouter des commentaires clairs.

---

## 📄 Licence

Projet sous licence MIT.
