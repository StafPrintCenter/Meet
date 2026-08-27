# SPC Connect

PROMPT : DEVELOPPEMENT DE "SPC MEET" (APPLICATION DE VISIOCONFERENCE EXCLUSIF STAF PRINT CENTER)

Tu es un développeur Full-Stack Senior & Lead Architect Expert React / TypeScript / WebRTC.

Tu dois construire une application web moderne, hautement sécurisée et production-ready nommée SPC Meet, le système de visioconférence officiel et exclusif de l'entreprise STAF PRINT CENTER.

---

🎨 1. CHARTE GRAPHIQUE OFFICIELLE STAF PRINT CENTER (STRICTE)

L'interface utilisateur de SPC Meet doit s'aligner rigoureusement sur le design system de STAF PRINT CENTER :

- Couleurs principales : 

  - Off-white chaud / Arrière-plan épuré léger avec grille fine (Style Paper/Grid).

  - Slate profond (`#0f172a` / `#1e293b`) pour les contrastes, la typographie et la barre d'outils de visioconférence (Dark Dock).

  - Accent STAF PRINT : Orange Vibrant / Ambre signature (`#f97316` / `#ea580c`) pour les boutons d'action primaires, les états actifs, le logo et les notifications d'urgence.

- Typographies :

  - Fraunces (`--font-display`) pour les grands titres, numéros de salles et en-têtes.

  - Inter Tight pour le corps de texte, l'interface utilisateur, la liste des participants et le chat.

- Esthétique : Style SaaS modern, cartes épurées, angles doux (`rounded-2xl` / `rounded-xl`), ombres légères, badges de statut colorés (Disponible, Réservé, En attente).

---

🎯 2. REGLES METIER & RESTRICTIONS ACCES (STYLE SPC SHORTENER)

Sur le même principe que le raccourcisseur d'URL officiel (`go.stafprint.com`), l'outil est strictement réservé à l'écosystème STAF PRINT CENTER :

A. Qui peut CRÉER un salon / réunion ?

1. Admins & Super-Admins STAF PRINT CENTER : Réunions d'équipe internes, revues de projets, arbitrage client.

2. Formateurs / Instructeurs (LMS) : Cours en direct, ateliers, sessions de coaching.

3. Le Système Automatique (API) : Génération automatique d'un salon visio `SPC Meet` dès qu'un rendez-vous en ligne est réservé sur le site principal.

B. Qui peut REJOINDRE un salon ?

- Invités & Visiteurs (Clients / Apprenants sans compte) : Accès direct sans inscription via :

  - Lien direct de salon : ex. `go.stafprint.com/r/meet-xxx` ou `stafprint.com/meet/rdv-89x2`

  - Code à 6 ou 9 chiffres / caractères : Saisi directement sur la page d'accueil.

- Système de Restriction des Participants (Configurable par le créateur) :

  - Accès Libre (par Lien/Code) : Toute personne disposant du code/lien entre (avec ou sans salle d'attente).

  - Liste blanche restreinte (Whitelist Email) : Le créateur spécifie les adresses emails autorisées. Les participants doivent valider/saisir leur email pour entrer.

  - Restriction Domaine / Staff uniquement : Seul le personnel identifié de STAF PRINT CENTER peut rejoindre.

---

🔐 3. GESTION DES INVITATIONS, LIMITES & MODERATION

A. Droits du Créateur de la Réunion (Hôte) :

- Limitation du nombre de participants : Définir une jauge maximale (ex: 2 participants pour un RDV client, 20 participants pour un cours, illimité pour une réunion d'équipe).

- Délégations d'invitations :

  - Toggle "Autoriser les participants à inviter d'autres personnes" (activé ou désactivé par l'hôte).

  - Si activé : Les participants peuvent générer un lien d'invitation temporaire ou partager le code.

- Contrôles pendant la réunion : 

  - Mettre en salle d'attente (Lobby), accepter/refuser les entrées.

  - Couper le micro ou la caméra d'un participant.

  - Exclure un participant du salon.

  - Verrouiller la salle (empêche toute nouvelle arrivée).

B. Super-Pouvoirs Admin & Super-Admin STAF PRINT CENTER :

- Vue d'ensemble en temps réel (Supervision Dashboard) : Liste de tous les salons `SPC Meet` en cours d'exécution.

- Intervention d'urgence : Capacité pour un Super-Admin d'annuler, bloquer, ou fermer immédiatement n'importe quel salon à distance en cas d'abus ou de dépassement de quota.

- Gestion des liens et invitations expirées : Révocation instantanée d'un lien d'invitation ou changement du code d'accès de la salle.

---

📱 4. STRUCTURE DES ECRANS A DEVELOPPER

1. Page d'Accueil (`/`)

- En-tête avec logo officiel STAF PRINT CENTER Meet et indicateur "Systèmes opérationnels".

- Zone Client / Visiteur : Champ de saisie d'un code de réunion (`123-456`) pour rejoindre rapidement.

- Zone Staff & Formateurs : Bouton de connexion et accès rapide "Démarrer une réunion instantanée" ou "Planifier une visio".

2. Écran de Pré-jonction / Waiting Room (`/room/$roomId/lobby`)

- Aperçu webcam, test du micro (VU-mètre visuel), sélecteur d'équipements audio/vidéo.

- Saisie du nom d'affichage (obligatoire pour les visiteurs).

- Vérification automatique de l'autorisation (Email whitelisté, nombre max atteint, ou attente de validation de l'hôte).

3. Salle de Visioconférence `SPC Meet` (`/room/$roomId`)

- Grille Vidéo Dynamique : Affichage optimisé des caméras avec mise en avant du présentateur/partage d'écran et initiale/avatar avec onde sonore si la caméra est désactivée.

- Dock de Contrôle Inférieur (Slate & Orange STAF) :

  - Micro (ON/OFF) + Sélecteur de source.

  - Caméra (ON/OFF) + Sélecteur de source.

  - Partage d'écran (Browser `getDisplayMedia` API fallback).

  - Lever la main, Réactions émojis.

  - Bouton "Inviter" (si autorisé par le créateur) : Ouvre une modale avec le lien court, le QR code et la jauge de places restantes.

  - Panneau latéral toggle : Chat / Participants / Notes.

  - Bouton rouge "Quitter l'appel".

- Panneau Latéral Modulable :

  - Onglet Chat : Messagerie instantanée du salon.

  - Onglet Participants & Modération : Liste des membres avec statuts (Hôte, Staff, Invité, Main levée), contrôles d'expulsion/mute.

  - Onglet Paramètres du Salon (Hôte uniquement) : Ajuster le nombre max de participants, verrouiller le salon, autoriser/bloquer les invitations.

4. Backoffice Admin & Supervision (`/admin/meet`)

- Liste de toutes les réunions programmées et en cours.

- Statistiques d'utilisation (Nombre de réunions, durées moyennes, bande passante).

- Actions d'urgence : Boutons "Arrêter la réunion", "Révoker le lien".

---


Une plateforme responsible sur mobile et tablette

ajoute des simulation de membres actifs sur certains meets

l'acceuil doit etre simple. Pas d'info sensible Salons en cours, Accès strictement contrôlé, 

on ne peut pas demarrer une reunion installanemnt, on doit entrer le code de l renion ou on est sur le lien

*

Calibre ça sous le fonctionnement de team's, zoom ou google meet


Ajoute jsute quelques liens demo en libre acces sur la page pour les tests.

Stabilise la video,

Ajoute une condion d'utilisation et un privacy

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/831d099e-3a6b-410e-86e6-bcd26a3e13f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
