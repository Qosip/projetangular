# 🧠 NeuroTerminal

NeuroTerminal est une interface de chat IA ultra-rapide et moderne construite avec **Angular 21**, **Tailwind CSS 4** et **DaisyUI 5**. Elle offre une expérience utilisateur premium inspirée des terminaux cyberpunk, avec un support multi-modèles et un streaming en temps réel extrêmement fluide.

## ✨ Fonctionnalités Clés

### 💬 Chat & Streaming
- **Support Multi-Modèles** : Discutez avec plusieurs IA simultanément (GPT-4, Claude 3, Mistral, etc.).
- **Streaming en temps réel** : Les réponses s'affichent mot à mot avec un indicateur de curseur clignotant.
- **Watchdog Intelligent** : Système de détection automatique des flux interrompus ou bloqués avec reprise d'erreur.
- **Gestion des conflits** : Reprise automatique du stream en cas de déconnexion réseau (HTTP 409/ECONNRESET).

### 🗂️ Organisation & Gestion
- **Historique des Conversations** : Enregistrement local des discussions avec recherche et filtrage.
- **Favoris** : Épinglez vos conversations importantes en haut de la liste.
- **Édition Rapide** : Renommez ou supprimez vos chats directement depuis la barre latérale.
- **Sélection de Modèles** : Personnalisez les agents actifs pour chaque discussion.

### 🎨 Design & Expérience
- **Interface Cyberpunk** : Design sombre et épuré avec glassmorphism et micro-animations.
- **Gestionnaire de Thèmes** : Basculez entre de nombreux thèmes DaisyUI (Dark, Aqua, Synthwave, Cyberpunk, etc.).
- **Notifications Toast** : Système d'alerte non-intrusif pour les succès et les erreurs.
- **Mode Zoneless** : Optimisation maximale des performances grâce à la suppression de `zone.js`.

---

## 🛠️ Stack Technique

- **Framework** : Angular v21.1 (Standalone components, Signals, Computed, Effects)
- **Styling** : Tailwind CSS v4 & DaisyUI v5
- **Tests** : Vitest (Remplaçant Karma/Jasmine pour une exécution instantanée)
- **State Management** : Angular Signals & RxJS
- **Routing** : Angular Router avec Guards et Interceptors

---

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
```

### Lancer l'application (Développement)
```bash
npm start
```
L'application sera disponible sur `http://localhost:4200`.

---

## 🧪 Tests & Qualité

Le projet utilise **Vitest** pour garantir une rapidité d'exécution et une intégration parfaite avec le compilateur Angular.

### Lancer les tests unitaires
```bash
npm test
```

### Lancer les tests avec couverture (Coverage)
Cette commande génère un rapport complet de couverture de code dans le dossier `coverage/`.
```bash
ng test --watch=false --coverage
```

### Voir le rapport de couverture
Après avoir lancé la commande ci-dessus, ouvrez le fichier `index.html` généré :
```bash
# Windows
start coverage/ProjetAngular/index.html

# Mac/Linux
open coverage/ProjetAngular/index.html
```

---

## 📂 Structure du Projet

- `src/app/core/` : Services globaux, Authentification, Guards et Interceptors.
- `src/app/features/` : Modules fonctionnels (Chat, Home, Login).
  - `chat/` : Logique de streaming, gestion des modèles, stockage local.
- `src/app/layout/` : Composants de structure (Sidebar, Topbar, MainLayout).
- `src/app/shared/` : Composants et services réutilisables (Toast, ThemePicker).

---

## 🔐 Sécurité

Le projet inclut :
- Un `AuthInterceptor` qui injecte automatiquement le token JWT dans les en-têtes Authorization.
- Un `AuthGuard` qui protège les routes sensibles et redirige vers `/login`.

---

Développé avec ❤️ pour une expérience IA futuriste.
