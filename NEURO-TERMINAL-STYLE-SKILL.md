---
name: neuro-terminal-ui
description: >
  Design system and style guide for a retro-futuristic, terminal-inspired Angular AI chat application.
  Projet final Angular — interface chat multi-LLM (groupe de discussion avec plusieurs agents IA).
  Utilise DaisyUI + Tailwind comme framework CSS, customisé avec un thème terminal sombre.
  Ce skill couvre : styling, composants, animations, UX flows, routing, auth, streaming, multi-model.
  Trigger on: any mention of styling, theming, components, layout, animations, UX flows,
  responsive design, visual identity, DaisyUI config, pages, or Angular architecture for this app.
---

# NEURO-TERMINAL — Design System & Style Skill

> **Philosophie** : Un terminal de commande du futur — si Blade Runner avait
> conçu une interface de chat IA. Minimaliste dans la structure, riche dans les
> détails. Chaque pixel est intentionnel. Chaque animation raconte une histoire.

---

## TABLE DES MATIÈRES

0. Cahier des Charges — Mapping Paliers → UI
1. Stack Technique & DaisyUI Setup
2. Identité Visuelle & Direction Artistique
3. Palette de Couleurs & Thème DaisyUI
4. Typographie
5. Grille & Layout System
6. Pages & Routing (Architecture Angular)
7. Composants — Catalogue Complet
8. Animations & Micro-interactions
9. UX Flows & Patterns
10. Multi-Model System — Les IA se répondent entre elles
11. Streaming des réponses IA
12. Responsive & Adaptabilité
13. Accessibilité
14. États de chargement & Gestion d'erreurs
15. Anti-Patterns — Ce qu'on ne fait JAMAIS

---

## 0. CAHIER DES CHARGES — MAPPING PALIERS → UI

Ce design system est construit pour couvrir **les 4 paliers du CDC** :

### Palier 1 — Chat minimal
| Exigence CDC | Composant UI | Section |
|---|---|---|
| Afficher les messages (GET + liste) | `<app-message-list>` + `<app-message-bubble>` | §7.1, §7.2 |
| Envoyer un message (formulaire + POST) | `<app-input-bar>` avec textarea + btn send | §7.3 |
| Voir les réponses IA apparaître | Streaming cursor + typing indicator | §8, §11 |
| Distinguer visuellement user vs chaque IA | Couleur par modèle, border-left, avatar, position | §3, §7.1, §7.2 |

### Palier 2 — Multi-conversations
| Exigence CDC | Composant UI | Section |
|---|---|---|
| Route accueil + `/chat/:id` | `<app-home>`, `<app-chat>` | §6 |
| Sidebar : liste des chats | `<app-sidebar>` avec liste de conversations | §7.4 |
| Bouton "Nouveau chat" | Btn primary dans sidebar | §7.4 |
| Navigation entre conversations | RouterLink + animation de transition | §6, §8 |

### Palier 3 — Auth + configuration
| Exigence CDC | Composant UI | Section |
|---|---|---|
| Page de login (formulaire) | `<app-login>` — page dédiée, full-screen | §6.1 |
| Guard sur routes protégées | Pas de style mais UX : redirect + toast | §14 |
| Formulaire de création de chat + choix modèles | `<app-new-chat-modal>` ou page dédiée | §7.8 |

### Palier 4 — Expérience complète
| Exigence CDC | Composant UI | Section |
|---|---|---|
| Sauvegarder une config de modèles | `<app-model-presets>` dans sidebar/settings | §7.9 |
| Streaming des réponses IA | Intégration du service fourni + cursor animation | §11 |
| UX soignée (responsive, animations, loading, erreurs) | TOUT ce document | §8, §12, §13, §14 |

### Concept clé du CDC : "Les IAs se répondent entre elles"

C'est le cœur du projet. Visuellement, ça signifie :
- Les messages IA ne sont PAS des réponses isolées — ils forment une **conversation de groupe**
- Chaque IA a son identité visuelle propre (couleur, avatar, nom)
- Quand une IA "rebondit" sur le message d'une autre IA, on le montre visuellement avec une
  flèche/référence ou un indent subtil
- Le fil de discussion est un flux continu où user et IAs sont tous des participants au même niveau
- Voir section §10 pour les patterns UX détaillés

---

## 1. STACK TECHNIQUE & DAISYUI SETUP

### Stack

- **Angular** (dernière version stable)
- **Tailwind CSS** via `@angular-builders/custom-webpack` ou native Angular Tailwind support
- **DaisyUI** comme bibliothèque de composants Tailwind
- **SCSS** pour les variables custom et animations avancées non couvertes par DaisyUI
- **Google Fonts** ou **Fontsource** pour la typographie

### Installation DaisyUI

```bash
npm install daisyui@latest
```

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["neuroterminal"],  // notre thème custom
    darkTheme: "neuroterminal",
    logs: false,
  },
}
```

### Thème DaisyUI Custom — "neuroterminal"

DaisyUI utilise des CSS variables sur `[data-theme]`. On crée un thème complet :

```js
// tailwind.config.js
module.exports = {
  // ...
  daisyui: {
    themes: [
      {
        neuroterminal: {
          // ── Couleurs sémantiques DaisyUI ──────────────────
          "primary":          "#00FF88",     // Accent phosphore (vert terminal)
          "primary-content":  "#0A0A0F",     // Texte sur primary (quasi noir)
          "secondary":        "#8B8B9E",     // Gris moyen pour éléments secondaires
          "secondary-content":"#E8E8ED",     // Texte sur secondary
          "accent":           "#5B8DEF",     // Bleu info pour accents ponctuels
          "accent-content":   "#0A0A0F",     // Texte sur accent
          "neutral":          "#13131B",     // Fond des panneaux (surface-1)
          "neutral-content":  "#E8E8ED",     // Texte sur neutral
          "base-100":         "#0E0E14",     // Fond principal (surface-0)
          "base-200":         "#13131B",     // Fond surélevé (surface-1)
          "base-300":         "#1A1A24",     // Fond carte/hover (surface-2)
          "base-content":     "#E8E8ED",     // Texte principal
          "info":             "#5B8DEF",     // Bleu calme
          "info-content":     "#0A0A0F",
          "success":          "#00FF88",     // Vert phosphore
          "success-content":  "#0A0A0F",
          "warning":          "#FFB800",     // Ambre
          "warning-content":  "#0A0A0F",
          "error":            "#FF3B5C",     // Rouge vif
          "error-content":    "#0A0A0F",

          // ── Paramètres visuels ────────────────────────────
          "--rounded-box":    "0.75rem",     // 12px — cards, modals
          "--rounded-btn":    "0.5rem",      // 8px — boutons
          "--rounded-badge":  "99rem",       // Pill shape — badges
          "--tab-radius":     "0.25rem",     // 4px — tabs
          "--animation-btn":  "0.2s",        // Durée anim boutons
          "--animation-input":"0.2s",        // Durée anim inputs
          "--btn-focus-scale":"0.98",        // Scale on press
          "--border-btn":     "1px",         // Épaisseur bordure boutons
          "--tab-border":     "1px",         // Épaisseur bordure tabs
        },
      },
    ],
  },
}
```

### Comment utiliser DaisyUI dans ce projet

**Règle d'or : DaisyUI pour la structure, custom CSS pour l'identité.**

| Utiliser DaisyUI pour... | NE PAS utiliser DaisyUI pour... |
|---|---|
| `btn`, `btn-primary`, `btn-ghost`, `btn-sm` | Le style final des boutons (on override) |
| `input`, `textarea`, `select` | Le glow effect au focus (custom) |
| `card`, `card-body` | La barre latérale colorée des messages (custom) |
| `drawer`, `menu`, `navbar` | La sidebar collapse animation (custom) |
| `modal`, `dropdown` | Les toasts terminaux (custom) |
| `badge`, `tooltip`, `loading` | Les scanlines, le cursor blink (custom) |
| `form-control`, `label` | Le typing indicator (custom) |
| `chat`, `chat-bubble` | Le layout multi-model / split-view (custom) |
| `join` (groupes de boutons) | L'effet de streaming (custom) |
| `skeleton` (loading states) | L'animation de boot/onboarding (custom) |
| `tabs` pour le model switcher | Le glow par modèle (custom) |

### Overrides DaisyUI — Fichier `_daisy-overrides.scss`

```scss
// On force le thème terminal sur tous les composants DaisyUI

// Boutons — ajouter le glow terminal
.btn-primary {
  text-transform: uppercase;
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 0 20px oklch(var(--p) / 0.25);
  }
}

// Inputs — glow au focus
.input:focus,
.textarea:focus {
  border-color: oklch(var(--p));
  box-shadow: 0 0 0 3px oklch(var(--p) / 0.06), 0 0 20px oklch(var(--p) / 0.15);
}

// Chat bubbles — supprimer les arrondis excessifs de DaisyUI
.chat-bubble {
  border-radius: 2px 12px 12px 2px;  // Sharp left, round right (IA)
}
.chat-end .chat-bubble {
  border-radius: 12px 12px 2px 12px;  // Sharp bottom-right (user)
}

// Cards — fond terminal
.card {
  background: var(--fallback-b2, oklch(var(--b2)));
  border: 1px solid rgba(255, 255, 255, 0.06);
}

// Modal — fond et backdrop
.modal-box {
  background: var(--fallback-b2, oklch(var(--b2)));
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.modal-backdrop {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

// Menu (sidebar) — items
.menu li > a {
  border-radius: 0.375rem;
  transition: all 0.15s ease;
}
.menu li > a:hover {
  background: rgba(255, 255, 255, 0.04);
}
.menu li > a.active {
  background: rgba(0, 255, 136, 0.06);
  border-left: 2px solid oklch(var(--p));
}

// Skeleton — couleurs terminal
.skeleton {
  background: rgba(255, 255, 255, 0.04);
}
```

### Composants DaisyUI recommandés par page

```
PAGE LOGIN:
  - card, card-body (conteneur du form)
  - form-control, label, input (champs)
  - btn btn-primary (submit)
  - alert (erreurs d'auth)
  - loading (spinner pendant l'auth)

PAGE ACCUEIL (home):
  - hero (section d'accueil si pas de conversations)
  - card (preview des conversations récentes)
  - btn btn-primary (nouveau chat)

PAGE CHAT:
  - drawer (sidebar mobile)
  - navbar (top bar)
  - menu (liste des conversations dans sidebar)
  - chat, chat-start, chat-end (messages)
  - chat-bubble (contenu des messages)
  - chat-header, chat-footer (métadonnées)
  - textarea (input message)
  - btn, btn-circle (envoi, actions)
  - dropdown (model selector)
  - badge (model chips)
  - tooltip (actions secondaires)
  - modal (nouveau chat, paramètres)
  - skeleton (loading des messages)
  - loading loading-dots (typing indicator fallback)
  - toast (notifications)
  - tabs (switch de vue multi-model)
```

---

## 2. IDENTITÉ VISUELLE & DIRECTION ARTISTIQUE

### Concept Central

L'interface est un **terminal neuronal** : l'utilisateur est un opérateur qui
pilote des IA comme on piloterait des systèmes dans un cockpit futuriste.
L'esthétique mélange trois influences :

- **Terminal rétro** : monospace, curseurs clignotants, scanlines subtiles, prompt `>`
- **Futurisme minimal** : lignes fines, géométrie nette, lueur (glow) contrôlée
- **Brutalisme élégant** : hiérarchie forte, espaces généreux, contrastes marqués

### Mots-clés esthétiques

`noir profond` · `lueurs phosphore` · `lignes de scan` · `monospace sacré` ·
`glass morphism léger` · `grille invisible` · `micro-glow` · `silence visuel` ·
`précision chirurgicale` · `asymétrie contrôlée`

### Principe fondamental

> **La beauté vient de la retenue.** Chaque élément gagne sa place à l'écran.
> Si un élément n'a pas de raison fonctionnelle ET esthétique, il n'existe pas.

---

## 3. PALETTE DE COULEURS

### Système de couleurs — Variables CSS Custom (en plus du thème DaisyUI)

Les variables DaisyUI gèrent les couleurs sémantiques. On ajoute des variables custom
pour les effets terminaux et l'identité par modèle.

```scss
:root[data-theme="neuroterminal"] {
  // ── SURFACES ADDITIONNELLES ──────────────────────────────
  --void:           #0A0A0F;
  --surface-0:      #0E0E14;
  --surface-1:      #13131B;
  --surface-2:      #1A1A24;
  --surface-3:      #22222E;
  --surface-hover:  #2A2A38;

  // ── BORDURES ─────────────────────────────────────────────
  --border-subtle:  rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong:  rgba(255, 255, 255, 0.14);
  --border-glow:    rgba(0, 255, 136, 0.15);

  // ── TEXTE ADDITIONNEL ────────────────────────────────────
  --text-ghost:     #3A3A4A;

  // ── ACCENT GLOW ──────────────────────────────────────────
  --accent-glow:    rgba(0, 255, 136, 0.25);
  --accent-ghost:   rgba(0, 255, 136, 0.06);

  // ── COULEURS PAR MODÈLE IA ──────────────────────────────
  --model-claude:     #D4A574;
  --model-gpt:        #74B9A5;
  --model-gemini:     #7B8FD4;
  --model-mistral:    #D47B7B;
  --model-llama:      #A57BD4;
  --model-custom:     #D4C974;
  --model-cohere:     #D474A5;
  --model-deepseek:   #74D4C9;

  // ── EFFETS SPÉCIAUX ─────────────────────────────────────
  --scanline-color: rgba(255, 255, 255, 0.015);
  --glow-spread:    20px;

  // ── FONTS ────────────────────────────────────────────────
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;
  --font-body:    'Satoshi', 'DM Sans', sans-serif;
  --font-display: 'Space Grotesk', 'Outfit', sans-serif;
}
```

### Règles d'usage couleurs

- **JAMAIS** de blanc pur (#FFFFFF) — le max est #E8E8ED
- **JAMAIS** de noir pur (#000000) sauf pour des ombres
- Le vert phosphore (DaisyUI `primary`) est RÉSERVÉ aux éléments interactifs et indicateurs actifs
- Chaque modèle IA a sa couleur dédiée `var(--model-<n>)`. Appliquer via :
  - `border-left: 3px solid var(--model-color)` sur ses messages
  - Dot indicateur dans le header du message
  - Glow subtil `box-shadow: 0 0 12px var(--model-color)` sur son avatar
  - Couleur du curseur de typing pendant la génération

### Assigner dynamiquement la couleur d'un modèle (Angular)

```html
<!-- Dans le template du message -->
<div class="chat chat-start"
     [style.--model-color]="getModelColor(message.model)">
  <div class="chat-image avatar">
    <div class="w-8 rounded-lg ring ring-offset-2"
         [style.ring-color]="'var(--model-color)'"
         [style.box-shadow]="'0 0 12px var(--model-color)'">
      <!-- avatar icon -->
    </div>
  </div>
  <div class="chat-bubble border-l-[3px]"
       style="border-left-color: var(--model-color)">
    {{ message.content }}
  </div>
</div>
```

```ts
// Dans le composant
getModelColor(modelId: string): string {
  const colors: Record<string, string> = {
    'claude':   'var(--model-claude)',
    'gpt-4':    'var(--model-gpt)',
    'gemini':   'var(--model-gemini)',
    'mistral':  'var(--model-mistral)',
    'llama':    'var(--model-llama)',
    'deepseek': 'var(--model-deepseek)',
  };
  return colors[modelId] ?? 'var(--model-custom)';
}
```

---

## 4. TYPOGRAPHIE

### Fonts Stack

```scss
--font-mono:    'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
--font-body:    'Satoshi', 'General Sans', 'DM Sans', sans-serif;
--font-display: 'Space Grotesk', 'Outfit', sans-serif;
// NOTE: Substituer Space Grotesk par 'Syne' ou 'Anybody' si trop commun
```

### Chargement via Google Fonts (dans `index.html`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

Pour Satoshi (non disponible sur Google Fonts) : utiliser Fontsource ou DM Sans en fallback.

### Classes Tailwind custom (via `tailwind.config.js`)

```js
theme: {
  extend: {
    fontFamily: {
      mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      body:    ['Satoshi', 'DM Sans', 'sans-serif'],
      display: ['Space Grotesk', 'Outfit', 'sans-serif'],
    },
  },
}
```

Usage dans les templates : `class="font-mono"`, `class="font-body"`, `class="font-display"`

### Règles typographiques

- **Labels** et **métadonnées** → `font-mono uppercase tracking-widest text-xs`
- **Messages IA** → `font-body text-[0.9375rem] leading-relaxed`
- **Code blocks** → `font-mono text-sm` sur fond `bg-base-300`
- **Input utilisateur** → `font-mono` pour renforcer l'effet terminal
- **Noms de modèles** → `font-mono uppercase text-xs tracking-wider`
- **Pas de texte en dessous de 11px** (0.6875rem)

---

## 5. GRILLE & LAYOUT SYSTEM

### Structure globale — Utilisant le Drawer DaisyUI

```html
<!-- app.component.html (pour les pages authentifiées) -->
<div class="drawer lg:drawer-open" data-theme="neuroterminal">
  <!-- Sidebar toggle (mobile) -->
  <input id="sidebar" type="checkbox" class="drawer-toggle" />

  <!-- Main content area -->
  <div class="drawer-content flex flex-col h-screen">
    <!-- Top Bar -->
    <app-topbar class="h-12 shrink-0"></app-topbar>

    <!-- Router Outlet (chat ou home) -->
    <main class="flex-1 overflow-hidden">
      <router-outlet></router-outlet>
    </main>

    <!-- Status Bar -->
    <app-statusbar class="h-7 shrink-0"></app-statusbar>
  </div>

  <!-- Sidebar -->
  <div class="drawer-side z-30">
    <label for="sidebar" class="drawer-overlay"></label>
    <app-sidebar class="w-72 h-full"></app-sidebar>
  </div>
</div>
```

### Layout ASCII de référence

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (48px)  — ☰ logo │ conv title │ model chips │ ⚙ 👤 │
├─────────┬────────────────────────────────────────────────────┤
│         │                                                    │
│ SIDEBAR │              MAIN CHAT AREA                        │
│ (288px) │              max-w-[760px] mx-auto                 │
│         │                                                    │
│ drawer  │  ┌── messages scroll ──────────────────────────┐   │
│ lg:open │  │                                              │  │
│         │  │  [User msg]         → aligné droite          │  │
│ • new + │  │  [Claude msg]       → aligné gauche, ambre   │  │
│ • convs │  │  [GPT-4 msg]        → aligné gauche, menthe  │  │
│ • ──────│  │  [Gemini reply]     → aligné gauche, lavande │  │
│ • models│  │  [Claude reply]     → aligné gauche, ambre   │  │
│ • config│  │  [Claude to Gemini] ← les IA se parlent !    │  │
│         │  │                                              │  │
│         │  └──────────────────────────────────────────────┘  │
│         │                                                    │
│         │  ┌── input bar sticky bottom ──────────────────┐   │
│         │  │  [ModelSelect ▾] [Textarea ...........] [⬆] │   │
│         │  └──────────────────────────────────────────────┘  │
├─────────┴────────────────────────────────────────────────────┤
│  STATUS BAR (28px) — ● Online │ Claude │ 1,247 tokens │ 1.2s│
└──────────────────────────────────────────────────────────────┘
```

### Sizing constraints

```scss
$chat-max-width:      760px;    // max-w-[760px]
$sidebar-width:       288px;    // w-72
$topbar-height:       48px;     // h-12
$statusbar-height:    28px;     // h-7
$input-min-height:    52px;     // min-h-[52px]
$input-max-height:    200px;    // max-h-[200px]
```

---

## 6. PAGES & ROUTING (Architecture Angular)

### Routes de l'application

```ts
// app.routes.ts
export const routes: Routes = [
  // ── Routes publiques ──────────────────────────────
  { path: 'login',    component: LoginComponent },

  // ── Routes protégées (AuthGuard) ──────────────────
  {
    path: '',
    component: MainLayoutComponent,  // contient drawer+sidebar+topbar+statusbar
    canActivate: [authGuard],
    children: [
      { path: '',           component: HomeComponent },
      { path: 'chat/:id',   component: ChatComponent },
      { path: 'settings',   component: SettingsComponent },  // optionnel
    ]
  },

  // ── Fallback ──────────────────────────────────────
  { path: '**', redirectTo: '' },
];
```

### 6.1 Page Login — `/login`

**Layout** : Plein écran, centré, sans sidebar ni topbar.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    ◆ NEUROTERMINAL                         │
│                    ────────────────                        │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │                          │                  │
│              │  > IDENTIFICATION_       │                  │
│              │                          │                  │
│              │  ┌── Email ───────────┐  │                  │
│              │  │                    │  │                  │
│              │  └────────────────────┘  │                  │
│              │                          │                  │
│              │  ┌── Password ────────┐  │                  │
│              │  │ ••••••••           │  │                  │
│              │  └────────────────────┘  │                  │
│              │                          │                  │
│              │  [    CONNECT    ]       │                  │
│              │                          │                  │
│              │  ┌── Alert (si err) ──┐  │                  │
│              │  │ ⚠ Invalid creds   │  │                  │
│              │  └────────────────────┘  │                  │
│              │                          │                  │
│              └──────────────────────────┘                  │
│                                                            │
│              > system v1.0 — ready_                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Composants DaisyUI utilisés :**
```html
<div class="min-h-screen bg-base-100 flex items-center justify-center p-4">
  <!-- Scanlines overlay -->
  <div class="scanlines pointer-events-none fixed inset-0 z-50"></div>

  <div class="card w-full max-w-sm bg-base-200 border border-base-300">
    <div class="card-body gap-6">
      <!-- Logo -->
      <div class="text-center">
        <h1 class="font-display text-2xl font-bold text-primary">◆ NEUROTERMINAL</h1>
        <div class="divider my-1"></div>
      </div>

      <!-- Titre terminal -->
      <p class="font-mono text-xs uppercase tracking-widest text-base-content/40">
        > identification_
      </p>

      <!-- Formulaire -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-mono text-xs uppercase tracking-wider">Email</span>
        </label>
        <input type="email" class="input input-bordered w-full font-mono"
               placeholder="operator@neuro.dev" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text font-mono text-xs uppercase tracking-wider">Password</span>
        </label>
        <input type="password" class="input input-bordered w-full font-mono" />
      </div>

      <!-- Bouton submit -->
      <button class="btn btn-primary w-full font-mono uppercase tracking-wider">
        Connect
      </button>

      <!-- Erreur (conditionnel) -->
      <div class="alert alert-error" *ngIf="loginError">
        <span class="font-mono text-sm">{{ loginError }}</span>
      </div>
    </div>
  </div>

  <!-- Texte ambiance en bas -->
  <p class="fixed bottom-4 font-mono text-xs text-base-content/20">
    > system v1.0 — ready_
  </p>
</div>
```

**Effets spéciaux de la page login :**
- Le titre "NEUROTERMINAL" apparaît lettre par lettre (typing effect, 1.5s)
- Le curseur `_` clignote après "identification"
- Au focus sur un input : glow vert phosphore
- Au submit : le bouton affiche un `loading loading-dots` pendant la requête
- En cas d'erreur : shake animation (0.3s) sur la card + alert error
- Au succès : la card se "dissout" (scale 0.95 + fade out, 0.4s) avant la navigation

### 6.2 Page Home — `/`

**Layout** : À l'intérieur du MainLayout (avec sidebar). S'affiche quand aucune
conversation n'est sélectionnée.

**Deux états :**

**A) Aucune conversation existante** → Écran d'accueil hero
```html
<div class="flex flex-col items-center justify-center h-full gap-8 p-8">
  <div class="text-center max-w-md">
    <h1 class="font-display text-4xl font-bold mb-4">
      Bienvenue, <span class="text-primary">Opérateur</span>
    </h1>
    <p class="font-body text-base-content/60 text-lg">
      Initiez une conversation de groupe avec vos agents IA.
    </p>
  </div>

  <button class="btn btn-primary btn-lg font-mono uppercase tracking-wider gap-2"
          (click)="openNewChatModal()">
    <svg><!-- icon terminal --></svg>
    Nouveau Chat
  </button>

  <!-- Suggestions rapides (optionnel) -->
  <div class="flex flex-wrap gap-3 max-w-lg justify-center">
    <button class="btn btn-ghost btn-sm font-mono text-xs border border-base-300">
      "Comparez vos réponses sur..."
    </button>
    <button class="btn btn-ghost btn-sm font-mono text-xs border border-base-300">
      "Débattez de l'IA générative"
    </button>
  </div>
</div>
```

**B) Conversations existantes** → Grille de cartes des conversations récentes
```html
<div class="p-6 max-w-4xl mx-auto">
  <div class="flex justify-between items-center mb-6">
    <h2 class="font-display text-xl font-semibold">Conversations récentes</h2>
    <button class="btn btn-primary btn-sm font-mono uppercase">+ Nouveau</button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a *ngFor="let conv of conversations"
       [routerLink]="['/chat', conv.id]"
       class="card bg-base-200 border border-base-300 hover:border-primary/20
              transition-all duration-200 cursor-pointer group">
      <div class="card-body p-4">
        <h3 class="card-title text-sm font-mono">{{ conv.title }}</h3>
        <p class="text-xs text-base-content/40 font-mono">{{ conv.lastMessage | slice:0:80 }}...</p>
        <div class="flex gap-1.5 mt-2">
          <!-- Model dots -->
          <span *ngFor="let model of conv.models"
                class="badge badge-xs"
                [style.background]="getModelColor(model)">
          </span>
        </div>
      </div>
    </a>
  </div>
</div>
```

### 6.3 Page Chat — `/chat/:id`

C'est la page principale. Voir sections §7 et suivantes pour le détail de chaque composant.

**Structure du composant :**
```html
<div class="flex flex-col h-full">
  <!-- Messages area (scrollable) -->
  <div class="flex-1 overflow-y-auto scroll-smooth" #messagesContainer>
    <div class="max-w-[760px] mx-auto px-4 py-6 space-y-3">
      <!-- Messages -->
      <app-message-bubble *ngFor="let msg of messages; trackBy: trackByMessageId"
                          [message]="msg"
                          [@messageEnter]>
      </app-message-bubble>

      <!-- Typing indicators (un par modèle en train de répondre) -->
      <app-typing-indicator *ngFor="let model of typingModels"
                            [model]="model">
      </app-typing-indicator>
    </div>
  </div>

  <!-- Gradient fade above input -->
  <div class="h-8 bg-gradient-to-t from-base-100 to-transparent pointer-events-none -mt-8 relative z-10"></div>

  <!-- Input bar -->
  <app-input-bar class="shrink-0 px-4 pb-4"
                 (messageSent)="onSendMessage($event)">
  </app-input-bar>
</div>
```

---

## 7. COMPOSANTS — CATALOGUE COMPLET

### 7.1 Message Bubble — IA

Utilise le composant `chat` de DaisyUI, customisé :

```html
<!-- message-bubble.component.html (cas IA) -->
<div class="chat chat-start group" [style.--model-color]="modelColor">
  <!-- Avatar -->
  <div class="chat-image avatar">
    <div class="w-8 rounded-lg"
         [class]="'ring-1 ring-offset-1 ring-offset-base-100'"
         [style.ring-color]="modelColor"
         [style.box-shadow]="'0 0 10px ' + modelColor + '40'">
      <img [src]="modelIcon" [alt]="modelName" class="rounded-lg" />
    </div>
  </div>

  <!-- Header : nom du modèle + métadonnées -->
  <div class="chat-header flex items-center gap-2 mb-1">
    <span class="font-mono text-xs uppercase tracking-wider"
          [style.color]="modelColor">
      {{ modelName }}
    </span>
    <span class="text-[10px] text-base-content/30 font-mono">
      {{ message.timestamp | date:'HH:mm' }}
      · {{ message.tokens }} tokens
      · {{ message.latency }}s
    </span>
  </div>

  <!-- Bulle du message -->
  <div class="chat-bubble bg-base-200 text-base-content border-l-[3px]
              rounded-tl-sm font-body leading-relaxed"
       [style.border-left-color]="modelColor">
    <!-- Contenu markdown rendu -->
    <div [innerHTML]="message.content | markdown"></div>

    <!-- Curseur de streaming (si en cours) -->
    <span *ngIf="message.isStreaming" class="streaming-cursor"
          [style.background]="modelColor"></span>
  </div>

  <!-- Actions (visibles au hover) -->
  <div class="chat-footer opacity-0 group-hover:opacity-100
              transition-opacity duration-200 mt-1">
    <div class="flex gap-1">
      <button class="btn btn-ghost btn-xs font-mono">Copy</button>
      <button class="btn btn-ghost btn-xs font-mono">Retry</button>
      <button class="btn btn-ghost btn-xs font-mono">···</button>
    </div>
  </div>
</div>
```

### 7.2 Message Bubble — Utilisateur

```html
<!-- message-bubble.component.html (cas User) -->
<div class="chat chat-end">
  <div class="chat-bubble bg-primary/5 border border-primary/10
              text-base-content rounded-br-sm font-mono">
    {{ message.content }}
  </div>
  <div class="chat-footer text-[10px] text-base-content/30 font-mono mt-0.5">
    {{ message.timestamp | date:'HH:mm' }}
  </div>
</div>
```

### 7.3 Input Bar

```html
<!-- input-bar.component.html -->
<div class="max-w-[760px] mx-auto w-full">
  <div class="flex items-end gap-3 bg-base-200 border border-base-300
              rounded-2xl p-3 transition-all duration-300
              focus-within:border-primary/40 focus-within:shadow-[0_0_20px_rgba(0,255,136,0.1)]">

    <!-- Model Selector -->
    <div class="dropdown dropdown-top">
      <label tabindex="0" class="btn btn-ghost btn-sm gap-1.5 font-mono text-xs">
        <span class="w-2 h-2 rounded-full" [style.background]="currentModelColor"></span>
        {{ currentModelName }}
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </label>
      <ul tabindex="0" class="dropdown-content menu bg-base-200 border border-base-300
                              rounded-xl w-56 p-2 shadow-xl z-50 mb-2">
        <li *ngFor="let model of availableModels">
          <a (click)="selectModel(model)"
             class="font-mono text-xs gap-2"
             [class.active]="model.id === currentModel.id">
            <span class="w-2 h-2 rounded-full" [style.background]="model.color"></span>
            {{ model.name }}
          </a>
        </li>
        <div class="divider my-1 px-2"></div>
        <li>
          <a class="font-mono text-xs text-primary" (click)="sendToAll()">
            ⚡ Envoyer à tous
          </a>
        </li>
      </ul>
    </div>

    <!-- Textarea auto-expand -->
    <textarea class="textarea textarea-ghost flex-1 min-h-[40px] max-h-[200px]
                     resize-none font-mono text-sm leading-relaxed
                     placeholder:italic placeholder:text-base-content/20"
              placeholder="Message NeuroTerminal..."
              [(ngModel)]="messageContent"
              (keydown.enter)="onEnterKey($event)"
              (input)="autoResize($event)"
              rows="1">
    </textarea>

    <!-- Send button -->
    <button class="btn btn-primary btn-sm btn-circle"
            [disabled]="!messageContent.trim()"
            (click)="sendMessage()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  </div>

  <!-- Hint sous l'input -->
  <p class="text-center text-[10px] text-base-content/20 font-mono mt-2">
    Enter pour envoyer · Shift+Enter pour sauter une ligne
  </p>
</div>
```

### 7.4 Sidebar

```html
<!-- sidebar.component.html -->
<aside class="bg-base-200 h-full flex flex-col border-r border-base-300">
  <!-- Logo -->
  <div class="p-4 flex items-center gap-2">
    <span class="text-primary text-lg">◆</span>
    <span class="font-display font-bold text-sm">NEUROTERMINAL</span>
  </div>

  <!-- Bouton nouveau chat -->
  <div class="px-3 mb-2">
    <button class="btn btn-primary btn-sm w-full font-mono uppercase tracking-wider gap-2"
            (click)="openNewChat()">
      <svg class="w-4 h-4"><!-- + icon --></svg>
      Nouveau Chat
    </button>
  </div>

  <!-- Liste des conversations -->
  <div class="flex-1 overflow-y-auto px-2">
    <!-- Groupe : Aujourd'hui -->
    <p class="font-mono text-[10px] uppercase tracking-widest text-base-content/20
              px-2 py-2 mt-2">
      Aujourd'hui
    </p>
    <ul class="menu menu-sm gap-0.5">
      <li *ngFor="let conv of todayConversations">
        <a [routerLink]="['/chat', conv.id]"
           routerLinkActive="active"
           class="flex items-center gap-2 py-2 text-sm">
          <!-- Dots des modèles de cette conversation -->
          <span class="flex gap-0.5">
            <span *ngFor="let model of conv.models"
                  class="w-1.5 h-1.5 rounded-full"
                  [style.background]="getModelColor(model)">
            </span>
          </span>
          <span class="truncate">{{ conv.title }}</span>
        </a>
      </li>
    </ul>

    <!-- Groupe : 7 derniers jours -->
    <p class="font-mono text-[10px] uppercase tracking-widest text-base-content/20
              px-2 py-2 mt-2">
      7 derniers jours
    </p>
    <ul class="menu menu-sm gap-0.5">
      <!-- ... mêmes items ... -->
    </ul>
  </div>

  <!-- Section bas : Modèles + Settings -->
  <div class="border-t border-base-300 p-3 space-y-2">
    <!-- Modèles actifs -->
    <p class="font-mono text-[10px] uppercase tracking-widest text-base-content/20">
      Modèles
    </p>
    <div class="flex flex-wrap gap-1.5">
      <span *ngFor="let model of activeModels"
            class="badge badge-sm gap-1 font-mono text-[10px]"
            [style.background]="getModelColor(model) + '15'"
            [style.color]="getModelColor(model)"
            [style.border-color]="getModelColor(model) + '30'">
        <span class="w-1.5 h-1.5 rounded-full" [style.background]="getModelColor(model)"></span>
        {{ model.name }}
      </span>
    </div>

    <!-- Configs sauvegardées (Palier 4) -->
    <p class="font-mono text-[10px] uppercase tracking-widest text-base-content/20 mt-3"
       *ngIf="presets.length">
      Configs sauvegardées
    </p>
    <ul class="menu menu-sm gap-0.5" *ngIf="presets.length">
      <li *ngFor="let preset of presets">
        <a class="flex items-center gap-2 text-xs font-mono"
           (click)="newChatFromPreset(preset)">
          <span class="flex gap-0.5">
            <span *ngFor="let m of preset.models"
                  class="w-1.5 h-1.5 rounded-full"
                  [style.background]="m.color"></span>
          </span>
          {{ preset.name }}
        </a>
      </li>
    </ul>

    <!-- Settings -->
    <a routerLink="/settings" class="btn btn-ghost btn-sm justify-start w-full gap-2 font-mono text-xs">
      ⚙ Paramètres
    </a>
  </div>
</aside>
```

### 7.5 Top Bar

```html
<!-- topbar.component.html -->
<nav class="navbar bg-base-100/85 backdrop-blur-md border-b border-base-300
            h-12 min-h-0 px-4 z-40">
  <!-- Hamburger (mobile) -->
  <label for="sidebar" class="btn btn-ghost btn-sm btn-circle lg:hidden">
    <svg class="w-5 h-5"><!-- menu icon --></svg>
  </label>

  <!-- Titre de la conversation (éditable au double-click) -->
  <div class="flex-1 ml-2">
    <h1 class="font-mono text-sm truncate cursor-pointer hover:text-primary
               transition-colors"
        (dblclick)="editTitle()">
      {{ currentConversation?.title || 'Nouvelle conversation' }}
    </h1>
  </div>

  <!-- Model chips actifs dans cette conversation -->
  <div class="hidden sm:flex gap-1.5 mr-4">
    <span *ngFor="let model of currentModels"
          class="badge badge-sm gap-1 font-mono text-[10px]"
          [style.background]="getModelColor(model) + '12'"
          [style.color]="getModelColor(model)">
      <span class="w-1.5 h-1.5 rounded-full"
            [style.background]="getModelColor(model)"></span>
      {{ model.shortName }}
    </span>
  </div>

  <!-- Actions -->
  <div class="flex gap-1">
    <button class="btn btn-ghost btn-sm btn-circle">⚙</button>
    <div class="avatar placeholder">
      <div class="w-7 rounded-lg bg-base-300 text-base-content">
        <span class="text-xs font-mono">U</span>
      </div>
    </div>
  </div>
</nav>
```

### 7.6 Status Bar

```html
<!-- statusbar.component.html -->
<footer class="bg-base-100 border-t border-base-300 h-7 flex items-center
               px-4 gap-4 font-mono text-[10px] text-base-content/30
               hidden md:flex">
  <!-- Connection status -->
  <div class="flex items-center gap-1.5">
    <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
    <span>Connected</span>
  </div>

  <span class="text-base-content/10">│</span>

  <!-- Modèle actif -->
  <span [style.color]="currentModelColor">{{ currentModelName }}</span>

  <span class="text-base-content/10">│</span>

  <!-- Tokens -->
  <span>Tokens: {{ totalTokens | number }}</span>

  <span class="text-base-content/10">│</span>

  <!-- Latence -->
  <span>{{ lastLatency }}s</span>

  <span class="flex-1"></span>

  <!-- Keyboard shortcut hint -->
  <span class="text-base-content/15">Ctrl+/ pour raccourcis</span>
</footer>
```

### 7.7 Typing Indicator

```html
<!-- typing-indicator.component.html -->
<div class="chat chat-start">
  <div class="chat-image avatar">
    <div class="w-8 rounded-lg opacity-60">
      <img [src]="model.icon" [alt]="model.name" />
    </div>
  </div>
  <div class="chat-bubble bg-base-200 border-l-[3px] rounded-tl-sm
              min-h-0 py-3 px-4"
       [style.border-left-color]="model.color">
    <span class="loading loading-dots loading-xs"
          [style.color]="model.color"></span>
  </div>
</div>
```

### 7.8 Modal — Nouveau Chat (avec choix des modèles — Palier 3)

```html
<!-- new-chat-modal.component.html -->
<dialog class="modal" #newChatModal>
  <div class="modal-box bg-base-200 border border-base-300 max-w-lg">
    <!-- Header -->
    <h3 class="font-display text-lg font-semibold mb-1">Nouveau Chat</h3>
    <p class="font-mono text-xs text-base-content/40 uppercase tracking-wider mb-6">
      > configurer la session_
    </p>

    <!-- Nom du chat -->
    <div class="form-control mb-4">
      <label class="label">
        <span class="label-text font-mono text-xs uppercase tracking-wider">Titre</span>
      </label>
      <input type="text" class="input input-bordered font-mono text-sm"
             placeholder="Ma conversation..."
             [(ngModel)]="chatTitle" />
    </div>

    <!-- Sélection des modèles IA -->
    <div class="form-control mb-6">
      <label class="label">
        <span class="label-text font-mono text-xs uppercase tracking-wider">
          Agents IA (sélectionnez 1+)
        </span>
      </label>
      <div class="grid grid-cols-2 gap-2">
        <label *ngFor="let model of allModels"
               class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                      transition-all duration-200"
               [class.border-base-300]="!isSelected(model)"
               [class.bg-base-100]="!isSelected(model)"
               [class.border-opacity-40]="isSelected(model)"
               [style.border-color]="isSelected(model) ? model.color : null"
               [style.background]="isSelected(model) ? model.color + '08' : null">
          <input type="checkbox" class="checkbox checkbox-sm checkbox-primary"
                 [checked]="isSelected(model)"
                 (change)="toggleModel(model)" />
          <span class="w-2.5 h-2.5 rounded-full" [style.background]="model.color"></span>
          <span class="font-mono text-xs">{{ model.name }}</span>
        </label>
      </div>
    </div>

    <!-- Charger une config sauvegardée (Palier 4) -->
    <div class="collapse collapse-arrow bg-base-300 rounded-xl mb-4" *ngIf="savedPresets.length">
      <input type="checkbox" />
      <div class="collapse-title font-mono text-xs uppercase tracking-wider py-3">
        Configurations sauvegardées
      </div>
      <div class="collapse-content">
        <div class="flex flex-wrap gap-2">
          <button *ngFor="let preset of savedPresets"
                  class="btn btn-ghost btn-xs font-mono gap-1"
                  (click)="loadPreset(preset)">
            <span class="flex gap-0.5">
              <span *ngFor="let m of preset.models"
                    class="w-1.5 h-1.5 rounded-full"
                    [style.background]="m.color"></span>
            </span>
            {{ preset.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="modal-action">
      <button class="btn btn-ghost font-mono text-xs" (click)="close()">Annuler</button>
      <button class="btn btn-ghost btn-sm font-mono text-xs"
              *ngIf="selectedModels.length > 0"
              (click)="saveAsPreset()">
        Sauvegarder config
      </button>
      <button class="btn btn-primary font-mono uppercase tracking-wider"
              [disabled]="selectedModels.length === 0"
              (click)="createChat()">
        Lancer
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
```

### 7.9 Code Blocks (dans les messages IA)

```html
<div class="rounded-lg overflow-hidden border border-base-300 my-3">
  <!-- Header -->
  <div class="flex justify-between items-center px-3 py-1.5 bg-base-300
              font-mono text-[10px] uppercase tracking-wider text-base-content/30">
    <span>{{ language }}</span>
    <button class="btn btn-ghost btn-xs font-mono"
            (click)="copyCode()">
      {{ copied ? '✓ Copied' : 'Copy' }}
    </button>
  </div>
  <!-- Code body -->
  <pre class="p-4 overflow-x-auto bg-[var(--void)] font-mono text-sm leading-relaxed">
    <code [innerHTML]="highlightedCode"></code>
  </pre>
</div>
```

**Syntax highlighting — thème terminal custom :**
```scss
.hljs-keyword    { color: #FF79C6; }
.hljs-string     { color: #F1FA8C; }
.hljs-number     { color: #BD93F9; }
.hljs-comment    { color: #44475A; }
.hljs-function   { color: #50FA7B; }
.hljs-variable   { color: #8BE9FD; }
.hljs-class      { color: #FFB86C; }
```

---

## 8. ANIMATIONS & MICRO-INTERACTIONS

### 8.0 Philosophie

> **Les animations ne décorent pas. Elles communiquent.** Chaque mouvement a
> un sens. Un élément qui apparaît glisse pour montrer d'où il vient. Un
> élément qui charge pulse pour dire "je travaille".

### 8.1 Variables d'animation (Tailwind extend)

```js
// tailwind.config.js → theme.extend
animation: {
  'cursor-blink': 'cursorBlink 0.8s step-end infinite',
  'glow-pulse':   'glowPulse 2s ease-in-out infinite',
  'message-in':   'messageIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
  'slide-up':     'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
  'slide-left':   'slideLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
  'fade-in':      'fadeIn 0.5s ease forwards',
  'toast-in':     'toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
  'shake':        'shake 0.3s ease',
},
keyframes: {
  cursorBlink: {
    '0%, 100%': { opacity: '1' },
    '50%':      { opacity: '0' },
  },
  glowPulse: {
    '0%, 100%': { boxShadow: '0 0 8px var(--glow-color, rgba(0,255,136,0.25))' },
    '50%':      { boxShadow: '0 0 20px var(--glow-color, rgba(0,255,136,0.25))' },
  },
  messageIn: {
    from: { opacity: '0', transform: 'translateY(12px)' },
    to:   { opacity: '1', transform: 'translateY(0)' },
  },
  slideUp: {
    from: { opacity: '0', transform: 'translateY(20px)' },
    to:   { opacity: '1', transform: 'translateY(0)' },
  },
  slideLeft: {
    from: { opacity: '0', transform: 'translateX(-20px)' },
    to:   { opacity: '1', transform: 'translateX(0)' },
  },
  fadeIn: {
    from: { opacity: '0' },
    to:   { opacity: '1' },
  },
  toastIn: {
    from: { opacity: '0', transform: 'translateX(100%) scale(0.95)' },
    to:   { opacity: '1', transform: 'translateX(0) scale(1)' },
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%':      { transform: 'translateX(-4px)' },
    '75%':      { transform: 'translateX(4px)' },
  },
},
```

### 8.2 Angular Animations (pour transitions et messages)

```ts
// animations.ts
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const messageEnterAnimation = trigger('messageEnter', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('400ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);

export const staggerMessages = trigger('staggerMessages', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' }),
      stagger(50, [
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);
```

### 8.3 Streaming Cursor

```scss
.streaming-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  vertical-align: text-bottom;
  margin-left: 2px;
  background: var(--model-color, oklch(var(--p)));
  animation: cursorBlink 0.8s step-end infinite;
}
```

### 8.4 Scanlines (overlay global)

```scss
.scanlines::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--scanline-color) 2px,
    var(--scanline-color) 4px
  );
  opacity: 0.4;
  mix-blend-mode: overlay;
}

@media (prefers-reduced-motion: reduce) {
  .scanlines::after { display: none; }
}
```

### 8.5 Boot Screen (Onboarding — Première visite)

```
> INITIALIZING NEUROTERMINAL v1.0...
> LOADING NEURAL CORES... ████████░░ 80%
> CONNECTING TO LANGUAGE MODELS...
> SYSTEM READY_
```

- Texte en `font-mono`, apparaît lettre par lettre
- Durée : ~3 secondes, skip au click/touch/keyboard
- Fond `var(--void)`, texte `primary`
- Après boot → redirect vers login ou home

### 8.6 Animations interdites

- ❌ Bounce / jiggle (sauf erreur contrôlée via shake)
- ❌ Rotation 360°
- ❌ Scale > 1.05
- ❌ Animations > 1s (sauf boot screen)
- ❌ Parallax scroll
- ❌ Auto-play vidéos/GIFs dans l'UI

---

## 9. UX FLOWS & PATTERNS

### 9.1 Flow de conversation

1. User tape → bouton send s'active (transition)
2. Envoi → message user apparaît instantanément (optimistic UI)
3. Input se vide → typing indicator(s) du/des modèle(s) cible(s)
4. Réponse streaming → typing disparaît → texte progressif + cursor
5. Auto-scroll suit le texte (sauf si user a scrollé vers le haut)
6. Fin → curseur disparaît, métadonnées apparaissent
7. **Les autres IA peuvent répondre automatiquement** (voir §10)

### 9.2 Raccourcis clavier

| Raccourci | Action |
|---|---|
| `Enter` | Envoyer le message |
| `Shift+Enter` | Nouvelle ligne |
| `Ctrl+Shift+A` | Envoyer à tous les modèles |
| `Ctrl+Shift+N` | Nouvelle conversation |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+/` | Afficher raccourcis |
| `↑` (input vide) | Éditer dernier message |

### 9.3 Auth Flow & Guard

- **Non authentifié** → redirect `/login` + toast "Connexion requise"
- **Token expiré** → redirect `/login` + toast "Session expirée"
- **Login réussi** → redirect `/` ou URL initialement demandée
- **Logout** → clear token + redirect `/login`

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) return true;
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

---

## 10. MULTI-MODEL SYSTEM — LES IA SE RÉPONDENT ENTRE ELLES

C'est le concept central du projet : un **groupe de discussion** où les IA interagissent.

### 10.1 Fil de conversation de groupe

Le fil est un flux continu unique, chronologique :

```
[User]     → "Qu'est-ce que le quantique ?"
[Claude]   → "Le computing quantique utilise..."
[GPT-4]    → "Pour compléter ce que Claude a dit..."
[Gemini]   → "Je nuancerais en ajoutant..."
[Claude]   → "Bon point Gemini, effectivement..."
[User]     → "Qui a raison ?"
[GPT-4]    → "En fait, nous sommes tous d'accord sur..."
```

Chaque message identifié par : couleur border-left, avatar avec glow, nom coloré,
position (user → droite, toutes les IA → gauche).

### 10.2 Quand une IA répond à une autre IA

Ajouter un **quote/référence** subtile :

```html
<div class="text-xs text-base-content/30 font-mono mb-2 pl-3
            border-l-2 border-base-content/10 italic">
  En réponse à <span [style.color]="referencedModel.color">{{ referencedModel.name }}</span>
</div>
```

### 10.3 Vue côte-à-côte (optionnel Palier 4+)

```html
<div class="tabs tabs-boxed bg-base-200 mb-4 font-mono text-xs">
  <a class="tab" [class.tab-active]="view === 'sequential'"
     (click)="view = 'sequential'">≡ Séquentiel</a>
  <a class="tab" [class.tab-active]="view === 'split'"
     (click)="view = 'split'">⫼ Côte-à-côte</a>
</div>

<div *ngIf="view === 'split'" class="grid grid-cols-2 gap-4">
  <div *ngFor="let model of activeModels"
       class="border border-base-300 rounded-xl p-4"
       [style.border-color]="model.color + '30'">
    <div class="flex items-center gap-2 mb-3">
      <span class="w-2 h-2 rounded-full" [style.background]="model.color"></span>
      <span class="font-mono text-xs uppercase" [style.color]="model.color">
        {{ model.name }}
      </span>
    </div>
    <div class="font-body text-sm leading-relaxed">
      {{ getResponseForModel(model.id)?.content }}
    </div>
  </div>
</div>
```

---

## 11. STREAMING DES RÉPONSES IA

Le formateur fournit un **service de streaming Angular**. Intégration visuelle :

### 11.1 Cycle visuel

1. **Envoi** → message user apparaît, input se vide
2. **Attente** → typing indicator (`loading loading-dots`) coloré par modèle
3. **Premier token** → typing disparaît, message IA commence
4. **Pendant streaming** → texte progressif + `.streaming-cursor` clignotant
5. **Fin** → curseur disparaît (fade), métadonnées apparaissent (tokens, latence)

### 11.2 Intégration composant

```ts
sendMessage(content: string) {
  // 1. Message user (optimistic)
  this.messages.push({ role: 'user', content, timestamp: new Date() });

  // 2. Pour chaque modèle actif, lancer le streaming
  for (const model of this.activeModels) {
    const aiMessage: Message = {
      role: 'assistant', model: model.id,
      content: '', isStreaming: true, timestamp: new Date()
    };
    this.messages.push(aiMessage);
    this.typingModels.push(model);

    // Service fourni par le formateur
    this.streamingService.stream(model.id, content).subscribe({
      next: (token: string) => {
        this.typingModels = this.typingModels.filter(m => m.id !== model.id);
        aiMessage.content += token;
        this.scrollToBottom();
      },
      complete: () => {
        aiMessage.isStreaming = false;
        // calculer tokens et latence
      },
      error: (err) => {
        aiMessage.isStreaming = false;
        aiMessage.error = err.message;
      }
    });
  }
}
```

### 11.3 État d'erreur pendant le streaming

```html
<div *ngIf="message.error" class="mt-2">
  <div class="alert alert-error py-2 px-3 text-xs font-mono">
    <span>⚠ {{ message.error }}</span>
    <button class="btn btn-ghost btn-xs" (click)="retry(message)">Retry</button>
  </div>
</div>
```

---

## 12. RESPONSIVE & ADAPTABILITÉ

### Breakpoints (Tailwind natifs)

| Prefix | Min-width | Usage |
|---|---|---|
| (default) | 0px | Mobile-first |
| `sm` | 640px | Petits ajustements |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop — sidebar ouverte |
| `xl` | 1280px | Large desktop |

### Adaptations clés

**Mobile (< 768px)** :
- Sidebar → drawer overlay (DaisyUI `drawer` sans `lg:drawer-open`)
- Messages → padding `px-3`
- Model chips topbar → `hidden sm:flex`
- Split view → désactivée
- Status bar → `hidden md:flex`
- Input → `safe-area-inset-bottom` pour iOS

**Tablette (768px – 1024px)** :
- Sidebar collapsed par défaut
- Split view limitée à 2 colonnes

**Desktop (1024px+)** :
- Sidebar ouverte (`lg:drawer-open`)
- Toutes les fonctionnalités

---

## 13. ACCESSIBILITÉ

- **WCAG 2.1 AA** minimum
- Contrastes : 4.5:1 min
- Focus visible sur tous les interactifs
- `aria-label` sur boutons icône
- `role="log"` + `aria-live="polite"` sur zone de messages
- Navigation clavier complète
- `prefers-reduced-motion` :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    .scanlines::after { display: none; }
  }
  ```

---

## 14. ÉTATS DE CHARGEMENT & GESTION D'ERREURS

### Loading States (DaisyUI `skeleton`)

```html
<!-- Chargement conversation -->
<div class="space-y-4 p-6 max-w-[760px] mx-auto">
  <div class="flex gap-3 items-start" *ngFor="let i of [1,2,3]">
    <div class="skeleton w-8 h-8 rounded-lg shrink-0"></div>
    <div class="space-y-2 flex-1">
      <div class="skeleton h-3 w-24"></div>
      <div class="skeleton h-4 w-full"></div>
      <div class="skeleton h-4 w-3/4"></div>
    </div>
  </div>
</div>
```

### Toasts

```html
<div class="toast toast-end z-[80]">
  <div *ngFor="let t of toasts"
       class="alert font-mono text-sm animate-toast-in border-l-[3px]"
       [class.alert-error]="t.type === 'error'"
       [class.alert-success]="t.type === 'success'"
       [class.alert-warning]="t.type === 'warning'">
    <span>{{ t.message }}</span>
    <button class="btn btn-ghost btn-xs" (click)="dismiss(t)">✕</button>
  </div>
</div>
```

### Gestion d'erreurs réseau

| Situation | Comportement UI |
|---|---|
| Réseau coupé | Toast warning + dot status bar rouge |
| Rate limit | Message inline avec countdown |
| Erreur modèle | Alert error sous le message + Retry |
| Timeout (>30s) | "Toujours en cours..." + Annuler |
| 401 Unauthorized | Redirect `/login` + toast "Session expirée" |
| 500 Server Error | Toast error générique |

---

## 15. ANTI-PATTERNS — CE QU'ON NE FAIT JAMAIS

### Design
- ❌ Fond blanc / thème clair — DARK ONLY
- ❌ Gradients multicolores flashy
- ❌ Bordures > 2px (sauf border-left messages)
- ❌ Box-shadow géantes
- ❌ border-radius > 16px (sauf pill badges)
- ❌ Texte centré dans les messages
- ❌ Icônes colorées (sauf dots de modèle)
- ❌ Emojis dans l'UI
- ❌ Carrousel

### UX
- ❌ Modal de confirmation pour actions réversibles → undo
- ❌ Loading spinners classiques → skeleton / typing indicator
- ❌ Pagination dans le chat → scroll infini
- ❌ Forcer config avant le premier chat → modèle par défaut prêt

### Code Angular
- ❌ Styles inline dans templates
- ❌ `!important` (sauf reduced-motion)
- ❌ z-index arbitraires — système : z-10→z-100
- ❌ Composants DaisyUI sans override terminal
- ❌ `ngStyle` pour couleurs de modèle → `[style.--model-color]` + CSS var

---

## ANNEXE A — Structure fichiers recommandée

```
src/
├── styles/
│   ├── _tokens.scss
│   ├── _typography.scss
│   ├── _animations.scss
│   ├── _daisy-overrides.scss
│   ├── _scanlines.scss
│   ├── _scrollbar.scss
│   └── _syntax-highlight.scss
├── styles.scss
└── tailwind.config.js
```

---

## ANNEXE B — Checklist commit UI

- [ ] Fonctionne sur mobile (320px min)
- [ ] Focus ring visible (`:focus-visible`)
- [ ] Animations respectent `prefers-reduced-motion`
- [ ] Couleurs modèle via `var(--model-color)`
- [ ] Classes DaisyUI en premier, custom CSS ensuite
- [ ] Aucun `!important`
- [ ] Contraste texte 4.5:1 min
- [ ] Hover/active avec feedback
- [ ] Skeleton loaders pour chargements
- [ ] Erreurs avec état visuel + action

---

## ANNEXE C — Arborescence Angular

```
src/app/
├── layouts/
│   └── main-layout/              ← drawer + sidebar + topbar + statusbar + outlet
├── pages/
│   ├── login/                    ← plein écran (Palier 3)
│   ├── home/                     ← conversations récentes (Palier 2)
│   ├── chat/                     ← page chat (Palier 1)
│   └── settings/                 ← optionnel Palier 4
├── components/
│   ├── sidebar/
│   ├── topbar/
│   ├── statusbar/
│   ├── message-bubble/
│   ├── message-list/
│   ├── input-bar/
│   ├── typing-indicator/
│   ├── model-chip/
│   ├── new-chat-modal/
│   ├── code-block/
│   └── toast/
├── guards/
│   └── auth.guard.ts             ← Palier 3
├── services/
│   ├── auth.service.ts
│   ├── chat.service.ts
│   ├── streaming.service.ts      ← fourni par le formateur
│   └── model.service.ts
└── animations/
    └── animations.ts
```

---

> **NOTE FINALE** : Ce design system couvre les 4 paliers du CDC. Commencer par
> le Palier 1 (message-bubble + input-bar + message-list) et itérer. Le style
> terminal est le fil rouge. DaisyUI fournit la structure, les overrides et
> le custom CSS fournissent l'âme.
