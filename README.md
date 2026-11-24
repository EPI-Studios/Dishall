# Dishall

Dishall est un annuaire de serveurs Discord : les utilisateurs cherchent des serveurs, les rejoignent et les notent. Les propriétaires gèrent leurs serveurs depuis un tableau de bord, et une équipe de modération valide les contenus.

Ce document explique **tout ce qu'il faut savoir pour reprendre le projet** : installation, fonctionnement, règles métier, tests, pièges connus et travail restant.

## Sommaire

1. [Fonctionnalités](#fonctionnalités)
2. [Stack technique](#stack-technique)
3. [Démarrage rapide](#démarrage-rapide)
4. [Configuration détaillée](#configuration-détaillée)
5. [Comptes de test et rôles](#comptes-de-test-et-rôles)
6. [Architecture du code](#architecture-du-code)
7. [Règles métier](#règles-métier)
8. [Sécurité](#sécurité)
9. [Base de données et Prisma](#base-de-données-et-prisma)
10. [Tests](#tests)
11. [Scripts npm](#scripts-npm)
12. [Pièges connus](#pièges-connus)
13. [Travail restant](#travail-restant)
14. [Contribuer](#contribuer)

---

## Fonctionnalités

- **Annuaire** : liste des serveurs approuvés, page de détail, recherche, catégories, tri (meilleur score, popularité, nom, avis).
- **Connexion avec Discord** (OAuth2) : aucun mot de passe à gérer.
- **Import de ses serveurs** : un propriétaire autorise l'accès à ses serveurs Discord pour les ajouter à l'annuaire.
- **Avis et notes** (1 à 5) : un avis par utilisateur et par serveur, impossible de noter son propre serveur.
- **Score sur 10** calculé pour chaque serveur (description, membres, avis, bump récent).
- **Tableau de bord** : modification et suppression de ses serveurs, modification de son pseudo.
- **Modération** : validation des serveurs et des avis, journal de toutes les actions.
- **Administration** : gestion des utilisateurs et des rôles, suppression de serveurs et d'avis.
- **Mentions légales** : page `/mentions-legales` (à compléter avec les vraies informations).

## Stack technique

- [Next.js](https://nextjs.org/) 16 (App Router, `cacheComponents` activé) et React 19
- TypeScript
- Tailwind CSS 4
- [Prisma](https://www.prisma.io/) 7 avec PostgreSQL (adapter `pg`)
- [Zod](https://zod.dev/) 4 pour la validation
- Authentification : Discord OAuth2 + JWT (`jsonwebtoken`) dans un cookie `httpOnly`
- Tests : `node:test` + `tsx` (aucune dépendance de test supplémentaire)

---

## Démarrage rapide

Prérequis : Node.js 22 LTS (ou plus récent), PostgreSQL, une application Discord.

```bash
git clone https://github.com/EPI-Studios/Dishall.git
cd Dishall
npm install
```

1. Crée l'application Discord et récupère ses identifiants ([voir plus bas](#1-application-discord)).
2. Crée la base PostgreSQL ([voir plus bas](#2-base-postgresql)).
3. Crée le fichier `.env` à la racine ([voir plus bas](#3-variables-denvironnement)).
4. Applique le schéma, génère le client Prisma et charge les données de test :

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
```

5. Lance le projet :

```bash
npm run dev
```

L'application est sur [http://localhost:3000](http://localhost:3000).

> Utilise toujours `localhost` (jamais `127.0.0.1`) : le cookie de contrôle OAuth est lié à l'hôte, et mélanger les deux fait échouer la connexion.

---

## Configuration détaillée

### 1. Application Discord

1. Va sur le [Developer Portal](https://discord.com/developers/applications) et crée une application.
2. Onglet **OAuth2** : copie le *Client ID* et le *Client Secret*.
3. Dans **Redirects**, ajoute **deux** URL :
   - `http://localhost:3000/api/auth/discord/callback` : connexion
   - `http://localhost:3000/api/auth/discord/guild/callback` : import des serveurs

Pourquoi deux callbacks ? Ils n'ont pas les mêmes droits (*scopes*). La connexion demande seulement l'identité ; l'import demande en plus la liste des serveurs de l'utilisateur. Séparer les deux évite de demander ce droit à tout le monde dès la connexion. Le flux « guild » vérifie aussi que c'est bien la même personne que celle connectée.

En production, ajoute les mêmes URL avec le vrai domaine.

### 2. Base PostgreSQL

Exemple avec `psql` (adapte le nom et le mot de passe) :

```bash
sudo -u postgres psql
```

```sql
CREATE USER dishall WITH PASSWORD 'un_mot_de_passe';
CREATE DATABASE dishall OWNER dishall;
```

### 3. Variables d'environnement

Crée `.env` à la racine (ne le commite jamais) :

```env
DATABASE_URL="postgresql://dishall:un_mot_de_passe@localhost:5432/dishall"

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/discord/callback"
DISCORD_GUILD_REDIRECT_URI="http://localhost:3000/api/auth/discord/guild/callback"

# Chaîne aléatoire longue, par exemple : openssl rand -base64 48
JWT_SECRET=""

# URL vers laquelle l'utilisateur est redirigé après connexion
CLIENT_REDIRECT_URL="http://localhost:3000/dashboard"
```

Changer `JWT_SECRET` déconnecte tout le monde (les anciens jetons deviennent invalides).

### 4. Devenir administrateur

Connecte-toi une première fois avec Discord (ton utilisateur est alors créé), puis passe ton rôle en `admin` :

```sql
UPDATE "user" SET role = 'admin' WHERE discord_id = 'TON_ID_DISCORD';
```

Pour un modérateur, même requête avec `role = 'moderator'`. La table s'appelle `"user"` (avec guillemets : `user` est un mot réservé en PostgreSQL).

Le rôle est aussi stocké dans le jeton de session.

---

## Comptes de test et rôles

Le seed (`prisma/seed.ts`) vide les tables puis les remplit avec des utilisateurs, serveurs, avis, statistiques et actions de modération. **Il fait un `TRUNCATE` : ne le lance jamais sur une base qui contient de vraies données.**

| Rôle | Droits |
|---|---|
| `member` | Noter des serveurs, gérer ses propres serveurs |
| `moderator` | Changer le statut des serveurs et des avis, consulter les listes de modération et le journal |
| `admin` | Tout ce que fait le modérateur, plus : changer le rôle d'un utilisateur, supprimer un utilisateur, un serveur ou un avis, lister les utilisateurs |

Statuts d'un **serveur** : `approved`, `pending`, `rejected`. Statuts d'un **avis** : `approved`, `pending`, `hidden`.

Un administrateur ne peut pas modifier son propre rôle ni celui d'un autre administrateur, et ne peut attribuer que `member` ou `moderator` (jamais `admin` via l'API : passe par SQL).

---

## Architecture du code

```
app/                    Pages (App Router) et routes API
  api/                  Routes API (auth, serveurs, avis, admin)
  dashboard/            Tableau de bord utilisateur
  moderation/           Serveurs, avis et utilisateurs à modérer
  journal/              Journal des actions de modération
  serveurs/             Annuaire et pages de détail
  mentions-legales/     Mentions légales
lib/
  auth/                 Session, JWT, lecture de l'utilisateur courant
  servers/              Accès aux serveurs (*.server.ts) et appels API (*.client.ts)
  reviews/              Idem pour les avis
  users/                Idem pour les utilisateurs
  mod_actions/          Journal de modération
  prisma.ts             Client Prisma
util/                   Fonctions pures : score, bump, pseudo, images Discord
@types/                 Types partagés (ServerType, ReviewType...)
generated/prisma/       Client Prisma généré (ne pas modifier)
prisma/                 schema.prisma, migrations, seed.ts
prisma7.config.ts       Configuration Prisma 7
proxy.ts                Protection des pages (équivalent de middleware)
test/                   Tests (unit/ et api/)
```

### Fichiers `.server.ts` et `.client.ts`

- `*.server.ts` commence par `import "server-only";`. Il peut utiliser Prisma directement : c'est ce qu'appellent les pages et composants serveur. Si un composant client l'importe par erreur, le build échoue, et c'est voulu.
- `*.client.ts` ne fait que des `fetch("/api/...")` (URLs relatives) vers les routes API, depuis les composants client.
- Les **routes API** (`app/api/**/route.ts`) servent aux composants client (formulaires, boutons). Les pages serveur n'ont pas besoin de passer par elles : elles appellent directement les fonctions `.server.ts`.

### Flux d'authentification

1. `/api/auth/discord` redirige vers Discord avec un paramètre `state` stocké dans un cookie à usage unique (protection CSRF).
2. Le callback vérifie le `state`, échange le code, récupère le profil Discord, crée ou retrouve l'utilisateur (`findOrCreateUser`) et pose le cookie `token`.
3. Le cookie `token` est un JWT HS256 valable 7 jours, avec `{ sub: discord_id, role }`.
4. `proxy.ts` protège **seulement les pages** (`/dashboard`, `/moderation`, `/journal`) à partir du rôle du jeton.
5. Chaque **route API** et chaque fonction d'accès aux données relit le rôle **en base** : le rôle du jeton n'est qu'une déclaration, jamais une preuve.

### Journal de modération (`mod_action`)

Toute action de modération (changement de statut d'un serveur ou d'un avis, changement de rôle, suppression) est enregistrée avec le modérateur, l'action, le type (`server`, `review`, `user`), la cible (uuid, ou `discord_id` pour un utilisateur) et une **raison obligatoire** au format `ancien → nouveau : raison`.

L'écriture se fait dans la **même transaction** que la modification :

```ts
await prisma.$transaction([
  prisma.server.update({ ... }),
  logModAction({ ... }),
]);
```

Si l'un des deux échoue, rien n'est enregistré. Le front doit toujours envoyer `reason` (5 caractères minimum).

---

## Règles métier

### Score sur 10 (`util/score.ts`)

Quatre critères, chacun noté sur 10, puis divisés par 4 :

- **Description** : plus elle est longue, plus la note est haute (paliers dans `descriptionPoints`).
- **Membres** : paliers sur `serverStats.users_nb`.
- **Avis** : moyenne des avis approuvés × 2 (5 si aucun avis).
- **Bump** : 10 points si bump récent, qui baissent par paliers jusqu'à 0 au bout de 3 heures.

Le score est **calculé à la lecture** (dans `toServerType` de `lib/servers/servers.server.ts`), pas stocké en base, parce que la partie bump change avec le temps. Les seuils sont de simples chiffres dans `util/score.ts` : ajuste-les librement.

### Bump (`util/bump.ts`)

`serverStats.last_bump_at` est une date (ou `null`). Un serveur est « bumpé » si ce bump a moins de `BUMP_DURATION_MS` (3 heures). Utilise toujours `isBumped(date)` plutôt que de recomparer à la main.

### Remise en attente après modification

Quand un propriétaire modifie le **nom, la description ou le lien** d'un serveur qui n'est pas déjà `pending`, le serveur repasse automatiquement en `pending` pour être revalidé. Changer la catégorie ou le pays ne déclenche rien. Le tableau de bord affiche un message pour le prévenir.

### Pseudo unique

Les pseudos sont uniques **sans tenir compte de la casse** grâce à un index SQL ajouté à la main dans une migration (Prisma ne sait pas décrire `lower(pseudo)`) :

```sql
CREATE UNIQUE INDEX "user_pseudo_lower_key" ON "user" (lower(pseudo));
```

Ne le supprime pas en régénérant les migrations. Une liste de pseudos réservés (`util/pseudo.ts`) empêche de se faire passer pour « admin », « modérateur », etc. Un doublon renvoie une erreur `409` (code Prisma `P2002`).

### Avis

Un seul avis par utilisateur et par serveur ; impossible de noter son propre serveur ou un serveur non approuvé ; commentaire de 10 caractères minimum ; note de 1 à 5.

### Validation

Toutes les entrées passent par Zod. Les identifiants `uuid` sont validés avec `z.uuid()` **avant** d'être envoyés à Prisma : les colonnes sont de type `@db.Uuid`, et un identifiant mal formé ferait planter la requête (erreur 500) au lieu d'un 404.

---

## Sécurité

- JWT HS256 dans un cookie `httpOnly` valable 7 jours.
- Flux OAuth protégés par un `state` à usage unique.
- Le rôle est **toujours relu en base** côté API ; `proxy.ts` n'est qu'un confort pour les pages.
- Les réponses publiques n'exposent que les champs nécessaires (`select` explicites, aucun identifiant interne).
- Les fichiers `*.server.ts` importent `server-only`.
- Les actions sensibles (rôles, suppressions) sont réservées aux administrateurs.

---

## Base de données et Prisma

Prisma 7 se comporte différemment des versions précédentes :

- **Toujours** ajouter `--config prisma7.config.ts` à chaque commande Prisma.
- `migrate dev` **ne lance plus `generate` automatiquement** : après chaque changement de schéma, lance `npx prisma generate --config prisma7.config.ts`, sinon TypeScript et le runtime ne connaîtront pas les nouveaux champs.
- Le client généré est importé depuis `@/generated/prisma/client`.

Commandes courantes :

```bash
# Créer une migration après avoir modifié schema.prisma
npx prisma migrate dev --name ma_migration --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts

# Appliquer les migrations existantes (nouvelle base, production, tests)
npx prisma migrate deploy --config prisma7.config.ts

# Recharger les données de test (ATTENTION : vide les tables)
npx prisma db seed --config prisma7.config.ts

# Explorer la base
npx prisma studio --config prisma7.config.ts
```

Erreur fréquente « The column ... does not exist in the current database » : le schéma et la base ne sont pas synchronisés. Lance `migrate deploy` (ou `migrate dev` en local), puis `generate`, et redémarre `npm run dev`.

---

## Tests

Deux familles, avec `node:test` et `tsx` :

- **Unitaires** (`test/unit/`) : fonctions pures (`bump`...). Rapides, sans serveur ni base.
- **API** (`test/api/`) : appellent de vraies routes d'un serveur Next lancé sur le port 3100, avec une **base séparée** `dishall_test`, remise à l'état du seed avant chaque fichier. Ils vérifient surtout les permissions (401/403/404/409), la validation et le journal de modération.

### Tests unitaires

```bash
npm run test:unit
```

### Tests API (mise en place, une seule fois)

1. Crée la base de test (son nom **doit finir par `_test`** : les tests refusent de tourner sinon, car le seed fait un `TRUNCATE`) :

```sql
CREATE DATABASE dishall_test OWNER dishall;
```

2. Crée `.env.test` à la racine avec des valeurs de test uniquement :

```env
DATABASE_URL="postgresql://dishall:un_mot_de_passe@localhost:5432/dishall_test"
JWT_SECRET="secret-de-test-uniquement"
DISCORD_CLIENT_ID="test"
DISCORD_CLIENT_SECRET="test"
DISCORD_REDIRECT_URI="http://localhost:3100/api/auth/discord/callback"
DISCORD_GUILD_REDIRECT_URI="http://localhost:3100/api/auth/discord/guild/callback"
CLIENT_REDIRECT_URL="http://localhost:3100/dashboard"
TEST_BASE_URL="http://localhost:3100"
```

3. Applique les migrations sur la base de test :

```bash
npm run test:db
```

### Lancer les tests API

Dans un premier terminal, démarre le serveur de test :

```bash
npm run test:server
```

Dans un second terminal :

```bash
npm run test:api
```

`test/run-with-env.mjs` charge `.env.test` puis lance la commande demandée : Node refuse `--env-file` dans `NODE_OPTIONS`, d'où ce petit lanceur.

### Écrire un nouveau test

- Fonction pure → `test/unit/nom.test.ts`.
- Route API → `test/api/nom.test.ts`, en utilisant les helpers de `test/api/helpers.ts` : `api(url, { method, as: "member" | "moderator" | "admin", body })`, `resetDb()`, et les identifiants du seed `S(n)` (serveurs) et `C(n)` (avis).
- Les noms de fichiers doivent finir par `.test.ts` dans le bon dossier, sinon ils ne sont pas détectés.

---

## Scripts npm

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | Analyse du code avec ESLint |
| `npm run test:unit` | Tests unitaires |
| `npm run test:db` | Applique les migrations sur la base de test |
| `npm run test:server` | Lance Next sur le port 3100 avec `.env.test` (arrêter la commande npm run dev avant de faire cette commande ci)|
| `npm run test:api` | Tests d'API (nécessite `test:server` dans un autre terminal) |

---

## Contribuer

1. Crée une branche à partir de `main`.
2. Fais tes changements ; lance `npm run lint` et `npm run test:unit` (et les tests API si tu touches aux routes).
3. Commite et ouvre une pull request.

Bonnes pratiques propres à ce projet :

- Ajoute toujours la validation Zod et la vérification du rôle **dans la route**, jamais seulement dans l'interface.
- Une action de modération doit écrire dans `mod_action` dans la même transaction, avec une raison.
- Pour tout nouvel accès aux données côté serveur, crée une fonction dans un fichier `*.server.ts` plutôt qu'une route, sauf si un composant client en a besoin.
- Ne renvoie jamais un objet Prisma brut : choisis les champs avec `select`.

## Licence

À définir.