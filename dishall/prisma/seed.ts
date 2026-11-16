import { prisma } from "@/lib/prisma";

// ---------- Helpers ----------
// Génère des UUID lisibles et stables : uuid("a1", 3) -> a1000000-0000-4000-8000-000000000003
const uuid = (prefix: string, n: number) =>
  `${prefix}000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

const U = (n: number) => uuid("a1", n); // user
const S = (n: number) => uuid("b2", n); // server
const SC = (n: number) => uuid("c3", n); // score
const C = (n: number) => uuid("d4", n); // critic
const M = (n: number) => uuid("e5", n); // mod_action
const T = (n: number) => uuid("f6", n); // tag

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000);
const daysAgo = (d: number) => hoursAgo(d * 24);

// ---------- Nettoyage + remise à zéro des identités ----------
// (deleteMany ne remet pas les auto-increment à 1, donc on TRUNCATE)
await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE "server_tag", "report", "tag", "mod_action", "critic",
                 "score", "server_stats", "server", "user"
  RESTART IDENTITY CASCADE
`);

// ---------- Users (10) : ids 1 à 10 ----------
await prisma.user.createMany({
  data: [
    { uuid: U(1), discord_id: "810000000000000001", pseudo: "Mathieu", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "admin" },
    { uuid: U(2), discord_id: "810000000000000002", pseudo: "LunaMod", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "moderator" },
    { uuid: U(3), discord_id: "810000000000000003", pseudo: "Kaiju_Mod", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "moderator" },
    { uuid: U(4), discord_id: "810000000000000004", pseudo: "NoctisBeats", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "member" },
    { uuid: U(5), discord_id: "810000000000000005", pseudo: "Eryndor", avatar: "", role: "member" },
    { uuid: U(6), discord_id: "810000000000000006", pseudo: "SpeedyGonzo", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "member" },
    { uuid: U(7), discord_id: "810000000000000007", pseudo: "CodeNinja", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "member" },
    { uuid: U(8), discord_id: "810000000000000008", pseudo: "CineMaxime", avatar: "", role: "member" },
    { uuid: U(9), discord_id: "810000000000000009", pseudo: "PixelPaula", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "member" },
    { uuid: U(10), discord_id: "810000000000000010", pseudo: "BeatMaker42", avatar: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", role: "member" },
  ],
});

// ---------- Servers (10) : user n -> server n ----------
await prisma.server.createMany({
  data: [
    { uuid: S(1), guild_id: "910000000000000001", name: "Les Gamers du Dimanche", description: "Communauté de joueurs francophones : soirées multi, tournois et bonne humeur.", link: "https://discord.gg/gamersdimanche", category: "gaming", country: "FR", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "https://t3.ftcdn.net/jpg/09/52/53/26/360_F_952532630_9G7un5D1DTLHlHXkMVUM9MeSH7j27itm.jpg", status: "approved", created_at: daysAgo(300), user_id: 1, },
    { uuid: S(2), guild_id: "910000000000000002", name: "Otaku Café", description: "Discussions manga, anime et simulcasts, avec des salons spoilers séparés.", link: "https://discord.gg/otakucafe", category: "anime", country: "FR", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "", status: "approved", created_at: daysAgo(210), user_id: 2 },
    { uuid: S(3), guild_id: "910000000000000003", name: "Dev Zone FR", description: "Entraide entre développeurs : web, mobile, DevOps. Code reviews et projets collaboratifs.", link: "https://discord.gg/devzonefr", category: "technologie", country: "FR", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "https://t3.ftcdn.net/jpg/09/52/53/26/360_F_952532630_9G7un5D1DTLHlHXkMVUM9MeSH7j27itm.jpg", status: "approved", created_at: daysAgo(500), user_id: 3 },
    { uuid: S(4), guild_id: "910000000000000004", name: "Lofi Lounge", description: "Salon vocal lofi 24/7 pour bosser, réviser ou se détendre.", link: "https://discord.gg/lofilounge", category: "musique", country: "BE", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "", status: "approved", created_at: daysAgo(120), user_id: 4 },
    { uuid: S(5), guild_id: "910000000000000005", name: "Eryndor RP", description: "Serveur de jeu de rôle textuel dans un univers médiéval-fantastique.", link: "https://discord.gg/eryndorrp", category: "roleplay", country: "FR", icon: "", banner: "https://t3.ftcdn.net/jpg/09/52/53/26/360_F_952532630_9G7un5D1DTLHlHXkMVUM9MeSH7j27itm.jpg", status: "approved", created_at: daysAgo(260), user_id: 5 },
    { uuid: S(6), guild_id: "910000000000000006", name: "Speedrun Academy", description: "Apprends les techniques de speedrun et partage tes records.", link: "https://discord.gg/speedrunacademy", category: "gaming", country: "CA", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "", status: "approved", created_at: daysAgo(90), user_id: 6 },
    { uuid: S(7), guild_id: "910000000000000007", name: "Code & Chill", description: "Un coin tranquille pour coder ensemble, en vocal ou en écrit.", link: "https://discord.gg/codeandchill", category: "technologie", country: "FR", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "https://t3.ftcdn.net/jpg/09/52/53/26/360_F_952532630_9G7un5D1DTLHlHXkMVUM9MeSH7j27itm.jpg", status: "approved", created_at: daysAgo(400), user_id: 7 },
    { uuid: S(8), guild_id: "910000000000000008", name: "Ciné Club Discord", description: "Ciné-club : sorties de la semaine, critiques et projections en stream.", link: "https://discord.gg/cineclub", category: "cinema", country: "FR", icon: "", banner: "", status: "pending", created_at: daysAgo(15), user_id: 8 },
    { uuid: S(9), guild_id: "910000000000000009", name: "Pixel Atelier", description: "Atelier de pixel art : tutoriels, défis hebdo et retours bienveillants.", link: "https://discord.gg/pixelatelier", category: "communaute", country: "CH", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "https://t3.ftcdn.net/jpg/09/52/53/26/360_F_952532630_9G7un5D1DTLHlHXkMVUM9MeSH7j27itm.jpg", status: "approved", created_at: daysAgo(180), user_id: 9 },
    { uuid: S(10), guild_id: "910000000000000010", name: "Beat Makers", description: "Producteurs de beats : partage de samples, feedback et collabs.", link: "https://discord.gg/beatmakers", category: "musique", country: "DE", icon: "https://img.magnific.com/psd-gratuit/discord-logo-3d-icone-medias-sociaux-isole_47987-11941.jpg?semt=ais_hybrid&w=740&q=80", banner: "", status: "rejected", created_at: daysAgo(30), user_id: 10 },
  ],
});

// ---------- Server stats (10) ----------
await prisma.server_Stats.createMany({
  data: [
    { server_bump: true, last_bump_at: hoursAgo(2), users_nb: 1520, created_at: daysAgo(300), server_id: 1 },
    { server_bump: true, last_bump_at: daysAgo(1), users_nb: 860, created_at: daysAgo(210), server_id: 2 },
    { server_bump: true, last_bump_at: hoursAgo(5), users_nb: 3400, created_at: daysAgo(500), server_id: 3 },
    { server_bump: false, last_bump_at: daysAgo(6), users_nb: 410, created_at: daysAgo(120), server_id: 4 },
    { server_bump: true, last_bump_at: daysAgo(3), users_nb: 975, created_at: daysAgo(260), server_id: 5 },
    { server_bump: false, last_bump_at: daysAgo(12), users_nb: 230, created_at: daysAgo(90), server_id: 6 },
    { server_bump: true, last_bump_at: hoursAgo(8), users_nb: 2100, created_at: daysAgo(400), server_id: 7 },
    { server_bump: false, last_bump_at: daysAgo(15), users_nb: 75, created_at: daysAgo(15), server_id: 8 },
    { server_bump: true, last_bump_at: daysAgo(2), users_nb: 640, created_at: daysAgo(180), server_id: 9 },
    { server_bump: false, last_bump_at: daysAgo(30), users_nb: 40, created_at: daysAgo(30), server_id: 10 },
  ],
});

// ---------- Scores (10) : total = somme des 4 critères ----------
await prisma.score.createMany({
  data: [
    { uuid: SC(1), total_score: 85, completitude: 22, activity: 20, conformity: 25, critic: 18, server_id: 1 },
    { uuid: SC(2), total_score: 65, completitude: 18, activity: 15, conformity: 20, critic: 12, server_id: 2 },
    { uuid: SC(3), total_score: 94, completitude: 25, activity: 23, conformity: 24, critic: 22, server_id: 3 },
    { uuid: SC(4), total_score: 51, completitude: 15, activity: 10, conformity: 18, critic: 8, server_id: 4 },
    { uuid: SC(5), total_score: 77, completitude: 20, activity: 18, conformity: 22, critic: 17, server_id: 5 },
    { uuid: SC(6), total_score: 45, completitude: 12, activity: 8, conformity: 15, critic: 10, server_id: 6 },
    { uuid: SC(7), total_score: 90, completitude: 24, activity: 21, conformity: 25, critic: 20, server_id: 7 },
    { uuid: SC(8), total_score: 63, completitude: 17, activity: 14, conformity: 19, critic: 13, server_id: 8 },
    { uuid: SC(9), total_score: 79, completitude: 21, activity: 19, conformity: 23, critic: 16, server_id: 9 },
    { uuid: SC(10), total_score: 37, completitude: 10, activity: 6, conformity: 14, critic: 7, server_id: 10 },
  ],
});

// ---------- Critics (13) : un auteur ne note jamais son propre serveur ----------
await prisma.critic.createMany({
  data: [
    { uuid: C(1), comment: "Super ambiance, les tournois sont très bien organisés !", rate: 5, status: "approved", created_at: daysAgo(40), updated_at: daysAgo(40), server_id: 1, user_id: 2 },
    { uuid: C(2), comment: "Serveur actif et accueillant, je recommande.", rate: 4, status: "approved", created_at: daysAgo(35), updated_at: daysAgo(35), server_id: 1, user_id: 3 },
    { uuid: C(3), comment: "Bon contenu, mais les salons spoilers sont parfois mal respectés.", rate: 4, status: "approved", created_at: daysAgo(30), updated_at: daysAgo(28), server_id: 2, user_id: 1 },
    { uuid: C(4), comment: "La meilleure communauté dev francophone, réponses rapides.", rate: 5, status: "approved", created_at: daysAgo(45), updated_at: daysAgo(45), server_id: 3, user_id: 4 },
    { uuid: C(5), comment: "Entraide au top, j'ai appris énormément.", rate: 5, status: "approved", created_at: daysAgo(25), updated_at: daysAgo(25), server_id: 3, user_id: 5 },
    { uuid: C(6), comment: "Un peu calme, peu de monde en vocal le soir.", rate: 2, status: "approved", created_at: daysAgo(20), updated_at: daysAgo(20), server_id: 4, user_id: 6 },
    { uuid: C(7), comment: "Univers riche et bien écrit, RP de qualité.", rate: 4, status: "approved", created_at: daysAgo(18), updated_at: daysAgo(18), server_id: 5, user_id: 7 },
    { uuid: C(8), comment: "Nul, serveur sans intérêt.", rate: 1, status: "hidden", created_at: daysAgo(15), updated_at: daysAgo(10), server_id: 6, user_id: 8 },
    { uuid: C(9), comment: "Parfait pour coder dans une bonne ambiance détendue.", rate: 5, status: "approved", created_at: daysAgo(12), updated_at: daysAgo(12), server_id: 7, user_id: 9 },
    { uuid: C(10), comment: "Correct, mais je reviendrai quand il y aura plus de contenu.", rate: 3, status: "pending", created_at: daysAgo(3), updated_at: daysAgo(3), server_id: 8, user_id: 10 },
    { uuid: C(11), comment: "Défis hebdo motivants, les retours sont bienveillants.", rate: 4, status: "approved", created_at: daysAgo(9), updated_at: daysAgo(9), server_id: 9, user_id: 1 },
    { uuid: C(12), comment: "Bonne idée mais manque d'organisation pour le moment.", rate: 3, status: "pending", created_at: daysAgo(2), updated_at: daysAgo(2), server_id: 2, user_id: 6 },
    { uuid: C(13), comment: "Peu d'activité, serveur presque vide.", rate: 2, status: "approved", created_at: daysAgo(7), updated_at: daysAgo(7), server_id: 10, user_id: 3 },
  ],
});

// ---------- Mod actions (10) : par l'admin (1) et les modérateurs (2, 3) ----------
await prisma.mod_Action.createMany({
  data: [
    { uuid: M(1), action: "approve", reason: "Fiche complète et conforme.", target: S(1), type: "server", created_at: daysAgo(290), user_id: 1 },
    { uuid: M(2), action: "approve", reason: "Fiche complète et conforme.", target: S(2), type: "server", created_at: daysAgo(200), user_id: 1 },
    { uuid: M(3), action: "approve", reason: "Fiche complète et conforme.", target: S(3), type: "server", created_at: daysAgo(490), user_id: 2 },
    { uuid: M(4), action: "approve", reason: "Fiche conforme aux règles.", target: S(4), type: "server", created_at: daysAgo(110), user_id: 2 },
    { uuid: M(5), action: "approve", reason: "Fiche conforme aux règles.", target: S(5), type: "server", created_at: daysAgo(250), user_id: 3 },
    { uuid: M(6), action: "reject", reason: "Contenu non conforme aux règles de la plateforme.", target: S(10), type: "server", created_at: daysAgo(25), user_id: 1 },
    { uuid: M(7), action: "hide", reason: "Plus de 3 signalements, propos jugés injurieux.", target: C(8), type: "critic", created_at: daysAgo(10), user_id: 2 },
    { uuid: M(8), action: "warn", reason: "Avis injurieux masqué : avertissement.", target: U(8), type: "user", created_at: daysAgo(10), user_id: 2 },
    { uuid: M(9), action: "approve", reason: "Avis conforme et constructif.", target: C(1), type: "critic", created_at: daysAgo(39), user_id: 3 },
    { uuid: M(10), action: "approve", reason: "Fiche conforme aux règles.", target: S(7), type: "server", created_at: daysAgo(390), user_id: 3 },
  ],
});

// ---------- Tags (10) ----------
await prisma.tag.createMany({
  data: [
    { uuid: T(1), name: "Francophone", slug: "francophone" },
    { uuid: T(2), name: "Gaming", slug: "gaming" },
    { uuid: T(3), name: "Chill", slug: "chill" },
    { uuid: T(4), name: "Entraide", slug: "entraide" },
    { uuid: T(5), name: "Roleplay", slug: "roleplay" },
    { uuid: T(6), name: "Dev", slug: "dev" },
    { uuid: T(7), name: "Musique", slug: "musique" },
    { uuid: T(8), name: "Anime", slug: "anime" },
    { uuid: T(9), name: "Pixel Art", slug: "pixel-art" },
    { uuid: T(10), name: "Cinéma", slug: "cinema" },
  ],
});

// ---------- Server tags (20) : 2 tags par serveur ----------
const serverTags: [number, number, number][] = [
  [1, 2, 1], [2, 8, 3], [3, 6, 4], [4, 7, 3], [5, 5, 1],
  [6, 2, 3], [7, 6, 1], [8, 10, 3], [9, 9, 4], [10, 7, 2],
];

await prisma.serverHasTag.createMany({
  data: serverTags.flatMap(([server, tagA, tagB]) => [
    { server_uuid: S(server), tag_uuid: T(tagA) },
    { server_uuid: S(server), tag_uuid: T(tagB) },
  ]),
});

// ---------- Reports (10) : l'avis n°8 a 4 signalements (> 3) -> masqué ----------
await prisma.report.createMany({
  data: [
    { user_uuid: U(1), critic_uuid: C(8), reason: "Propos injurieux", created_at: daysAgo(14) },
    { user_uuid: U(2), critic_uuid: C(8), reason: "Propos injurieux", created_at: daysAgo(13) },
    { user_uuid: U(3), critic_uuid: C(8), reason: "Avis sans argument, haineux", created_at: daysAgo(12) },
    { user_uuid: U(4), critic_uuid: C(8), reason: "Harcèlement envers le serveur", created_at: daysAgo(11) },
    { user_uuid: U(4), critic_uuid: C(6), reason: "Avis jugé hors sujet", created_at: daysAgo(18) },
    { user_uuid: U(2), critic_uuid: C(12), reason: "Soupçon d'avis de concurrent", created_at: daysAgo(1) },
    { user_uuid: U(3), critic_uuid: C(10), reason: "Avis non pertinent", created_at: daysAgo(2) },
    { user_uuid: U(7), critic_uuid: C(4), reason: "Suspicion d'avis complaisant", created_at: daysAgo(30) },
    { user_uuid: U(9), critic_uuid: C(2), reason: "Avis possiblement fake", created_at: daysAgo(33) },
    { user_uuid: U(5), critic_uuid: C(13), reason: "Avis trop sévère", created_at: daysAgo(6) },
  ],
});

console.log("📊 Échantillonnage effectué avec succès.");
await prisma.$disconnect();