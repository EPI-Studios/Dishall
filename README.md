# Dishall

Dishall est un annuaire de serveurs Discord : les utilisateurs peuvent chercher des serveurs, les rejoindre et les noter. Les propriétaires gèrent leurs serveurs depuis un tableau de bord, et l'équipe de modération dispose d'outils dédiés.

## Fonctionnalités

- **Annuaire** : liste des serveurs approuvés, page de détail, recherche et catégories
- **Connexion avec Discord** (OAuth2) : aucun mot de passe à gérer
- **Import de ses serveurs** : un propriétaire autorise l'accès à ses serveurs Discord pour les ajouter à l'annuaire
- **Avis et notes** (1 à 5) : un avis par utilisateur et par serveur, impossible de noter son propre serveur
- **Tableau de bord** : modification et suppression de ses serveurs, modification de son pseudo
- **Modération** : validation des serveurs et des avis, journal des actions de modération
- **Administration** : gestion des utilisateurs et des rôles, suppression de serveurs

## Rôles

| Rôle | Droits |
|---|---|
| `member` | Noter des serveurs, gérer ses propres serveurs |
| `moderator` | Changer le statut des serveurs et des avis, consulter le journal de modération |
| `admin` | Tout ce que fait le modérateur, plus la gestion des utilisateurs et des rôles et la suppression de serveurs |

## Stack technique

- [Next.js](https://nextjs.org/) 16 (App Router) et React 19
- TypeScript
- Tailwind CSS 4
- [Prisma](https://www.prisma.io/) 7 avec PostgreSQL
- [Zod](https://zod.dev/) 4 pour la validation des données
- Authentification : Discord OAuth2 et JWT (cookie `httpOnly`)

## Prérequis

- Node.js (version LTS récente)
- Une base PostgreSQL
- Une application Discord créée sur le [Developer Portal](https://discord.com/developers/applications)

## Installation

```bash
git clone https://github.com/EPI-Studios/Dishall.git
cd Dishall
npm install
```

### Configuration de l'application Discord

Dans le Developer Portal, onglet **OAuth2**, ajoute deux URL de redirection :

- `http://localhost:3000/api/auth/discord/callback` (connexion)
- `http://localhost:3000/api/auth/discord/guild/callback` (import des serveurs)

Utilise le même hôte (`localhost`) partout : mélanger `localhost` et `127.0.0.1` empêche le cookie de contrôle OAuth d'être retrouvé.

### Variables d'environnement

Crée un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/dishall"

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/discord/callback"
DISCORD_GUILD_REDIRECT_URI="http://localhost:3000/api/auth/discord/guild/callback"

# Chaîne aléatoire longue, par exemple : openssl rand -base64 48
JWT_SECRET=""

# URL vers laquelle l'utilisateur est redirigé après connexion
CLIENT_REDIRECT_URL="http://localhost:3000/dashboard"
```

Ne commite jamais ce fichier.

### Base de données

```bash
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts   # optionnel : données de test
```

### Lancer le projet

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | Analyse du code avec ESLint |


## Structure du projet

```
app/            Pages (App Router) et routes API (app/api)
  admin/        Administration
  dashboard/    Tableau de bord utilisateur
  moderation/   Journal de modération
  serveurs/     Annuaire et pages de détail
lib/            Accès aux données et utilitaires
  *.server.ts   Code exécuté côté serveur uniquement (accès Prisma)
  *.client.ts   Appels à l'API depuis les composants client
prisma/         Schéma et migrations
proxy.ts        Protection des pages /dashboard, /admin et /moderation
```

## Sécurité

- Le jeton de session est un JWT signé (HS256) stocké dans un cookie `httpOnly`, valable 7 jours.
- Les flux OAuth utilisent un paramètre `state` à usage unique contre les attaques CSRF.
- `proxy.ts` ne protège que les pages : chaque route API vérifie elle-même l'authentification et le rôle en base.
- Les entrées sont validées avec Zod et les réponses publiques n'exposent que les champs nécessaires.

## Contribuer

1. Crée une branche à partir de `main`
2. Commite tes changements
3. Ouvre une pull request

## Licence

À définir.