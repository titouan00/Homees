# Homees — Documentation technique approfondie

## 1. Présentation globale

Homees est une plateforme SaaS de gestion immobilière moderne, pensée pour les propriétaires et gestionnaires. Son architecture technique repose sur Next.js (React), TypeScript, TailwindCSS côté front et Supabase (PostgreSQL, Authentication, Storage, Realtime) côté back. L’expérience utilisateur et la sécurité sont au cœur des choix techniques.

---

## 2. Structure du code et organisation

### Organisation des dossiers principaux

```
src/
  app/                # Pages Next.js (public, dashboard, api, etc.)
    dashboard/
      proprietaire/   # Espace propriétaire (biens, demandes, comparateur…)
      gestionnaire/   # Espace gestionnaire (biens, demandes, profil…)
  components/         # Composants UI réutilisables (navigation, cards, forms…)
  hooks/              # Hooks custom (auth, data, notifications, messaging…)
  lib/                # Clients API, helpers (ex: supabase-client.ts)
  services/           # Services métier (notifications…)
  types/              # Types TypeScript partagés
  utils/              # Fonctions utilitaires
  constants/          # Constantes globales
  config/             # Fichiers de configuration
  public/             # Assets statiques (images, icônes…)
```

---

## 3. Fonctionnement détaillé du code

### a) **Gestion de l’authentification et des rôles**

- **Supabase** gère l’auth (signup/login/logout) et stocke les profils dans la table `utilisateurs` (champ `rôle` : propriétaire, gestionnaire, admin).
- Côté client : login/signup via `supabase.auth.*` (voir `/login/page.tsx` et les hooks dans `useAuth.ts`). Après connexion, on récupère le rôle pour router l’utilisateur vers le bon dashboard.
- Côté serveur : protection des routes sensibles via le middleware Next.js (`src/middleware.ts`) + fonctions utilitaires dans `lib/auth-server.ts` (ex : `requireAuth` redirige selon le rôle).

**Exemple (login / routing) :**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
// ...
const { data: userData } = await supabase.from('utilisateurs').select('rôle').eq('id', data.user.id).single();
router.push(`/dashboard/${role}`);
```

### b) **Pages, routing, layouts**

- La navigation est gérée par le système App Router de Next.js 15.
- Chaque espace (propriétaire, gestionnaire) a ses propres pages, layouts, et hooks dédiés.
- Les layouts (`layout.tsx`) intègrent la vérification d’auth côté serveur et injectent le profil utilisateur dans le dashboard.

### c) **Gestion d’état et hooks métier**

- **Hooks React** pour encapsuler la logique métier : 
  - `useAuth` (auth et profil utilisateur)
  - `useComparateur` (recherche et filtrage des gestionnaires)
  - `useMessaging` (messagerie temps réel, création et suivi des demandes)
  - `useBiensEnGestion`, `useDemandes`, etc.
- **Gestion du temps réel** : via Supabase Realtime, ex : sur ajout/message ou changement de statut, les hooks abonnent le client aux canaux pertinents et rafraîchissent automatiquement les listes concernées.

**Exemple (hook messaging) :**
```typescript
const demandeSubscription = supabase
  .channel('user-demandes')
  .on('postgres_changes', { event: 'INSERT', table: 'demande' }, fetchDemandes)
  .subscribe();
```

### d) **Gestion des rôles et sécurité**

- **Séparation stricte** : chaque dashboard est protégé, redirections automatiques selon le rôle (middleware + requireAuth).
- **Côté client** : les menus, actions et pages sont conditionnés par le rôle.
- **Côté serveur** : vérification systématique du rôle dans les layouts/pages sensibles.
- **Jamais de données sensibles exposées côté client**.

---

## 4. Flux applicatifs principaux

### a) **Connexion/inscription**
- Utilisateur choisit son rôle à l’inscription.
- Après login, récupération du rôle et redirection vers le dashboard adapté.

### b) **Gestion des demandes**
- Demandes = objet central pour la communication propriétaire/gestionnaire.
- Hooks dédiés pour créer, lister, mettre à jour le statut, et suivre en temps réel les échanges/messages.
- Statuts typiques : ouverte, acceptée, rejetée, terminée.

### c) **Comparateur de gestionnaires**
- Recherche avancée avec filtres (zone, tarif, langues, type, avis…).
- Appels directs à la vue Supabase `gestionnaires_complets`.
- Algorithme de filtrage côté client et côté base.

### d) **Messagerie intégrée**
- Chaque demande ouvre une conversation (table `message`).
- Actions (contacter, accepter, rejeter, terminer) modifient la demande et créent des messages en base, le tout en temps réel.

---

## 5. Sécurité et bonnes pratiques

- **Sécurité** : 
  - Authentification forte Supabase avec gestion des tokens/cookies.
  - Middleware Next.js pour vérifier l’auth sur chaque requête.
  - Séparation stricte des espaces, aucune fuite de données cross-rôle.
- **Conventions** : 
  - Typescript partout, typage strict des données.
  - Fichiers auto-documentés, hooks réutilisables, composants UI centralisés.
  - Utilisation de Zod/React Hook Form pour la validation des inputs.

---

## 6. Exemples de code clés

### a) **Accès protégé à un dashboard**
```typescript
// src/app/dashboard/gestionnaire/layout.tsx
export default async function GestionnaireLayout({ children }) {
  const user = await requireAuth('gestionnaire'); // Redirige si pas gestionnaire
  return <GestionnaireDashboardLayout userProfile={user}>{children}</GestionnaireDashboardLayout>
}
```

### b) **Logic métier d’une action (créer une demande/message)**
```typescript
const { data: newDemande } = await supabase
  .from('demande')
  .insert({ proprietaire_id, gestionnaire_id, statut: 'ouverte', message_initial })
  .select()
  .single();
if (messageInitial?.trim()) {
  await supabase.from('message').insert({ demande_id: newDemande.id, emetteur_id: proprietaire_id, contenu: messageInitial });
}
```

### c) **Gestion du temps réel**
```typescript
useEffect(() => {
  const demandeSubscription = supabase
    .channel('user-demandes')
    .on('postgres_changes', { event: 'INSERT', table: 'demande' }, fetchDemandes)
    .subscribe();
  return () => demandeSubscription.unsubscribe();
}, []);
```

---

## 7. Conclusion

On s’appuie sur une architecture solide et moderne : séparation stricte des rôles, gestion sécurisée de l’authentification, logique métier encapsulée dans des hooks, composants UI réutilisables, expérience utilisateur fluide et sécurisée, et intégration temps réel.  
Le code est modulaire, documenté, typé, prêt pour la montée en charge et l’évolution fonctionnelle.

---

