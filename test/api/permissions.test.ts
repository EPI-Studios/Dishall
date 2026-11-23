// À placer dans : test/api/permissions.test.ts
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { C, S, USERS, api, resetDb, tokenFor } from "./helpers";

const REASON = "Raison de test suffisamment longue";

before(() => resetDb());
after(() => prisma.$disconnect());

describe("PATCH /api/admin/servers/[uuid] (statut d'un serveur)", () => {
  const url = `/api/admin/servers/${S(4)}`; // serveur 4 : approuvé dans le seed
  let logsBefore = 0;

  before(async () => {
    logsBefore = await prisma.mod_Action.count({ where: { target: S(4), type: "server" } });
  });

  it("401 sans session", async () => {
    const res = await api(url, { method: "PATCH", body: { status: "pending", reason: REASON } });
    assert.equal(res.status, 401);
  });

  it("403 pour un membre", async () => {
    const res = await api(url, { method: "PATCH", as: "member", body: { status: "pending", reason: REASON } });
    assert.equal(res.status, 403);
  });

  it("400 si la raison est trop courte", async () => {
    const res = await api(url, { method: "PATCH", as: "moderator", body: { status: "pending", reason: "non" } });
    assert.equal(res.status, 400);
  });

  it("400 si le statut n'existe pas", async () => {
    const res = await api(url, { method: "PATCH", as: "moderator", body: { status: "supprime", reason: REASON } });
    assert.equal(res.status, 400);
  });

  it("200 pour un modérateur", async () => {
    const res = await api(url, { method: "PATCH", as: "moderator", body: { status: "pending", reason: REASON } });
    assert.equal(res.status, 200);
  });

  it("409 si le serveur a déjà ce statut", async () => {
    const res = await api(url, { method: "PATCH", as: "admin", body: { status: "pending", reason: REASON } });
    assert.equal(res.status, 409);
  });

  it("200 pour un admin", async () => {
    const res = await api(url, { method: "PATCH", as: "admin", body: { status: "approved", reason: REASON } });
    assert.equal(res.status, 200);
  });

  it("n'écrit dans le journal que les deux changements réussis", async () => {
    const logsAfter = await prisma.mod_Action.count({ where: { target: S(4), type: "server" } });
    assert.equal(logsAfter, logsBefore + 2);
  });
});

describe("DELETE /api/admin/servers/[uuid] (réservé aux admins)", () => {
  const url = `/api/admin/servers/${S(10)}`; // serveur 10 : rejeté dans le seed

  it("401 sans session", async () => {
    assert.equal((await api(url, { method: "DELETE" })).status, 401);
  });

  it("403 pour un membre", async () => {
    assert.equal((await api(url, { method: "DELETE", as: "member" })).status, 403);
  });

  it("403 pour un modérateur", async () => {
    assert.equal((await api(url, { method: "DELETE", as: "moderator" })).status, 403);
  });

  it("204 pour un admin, puis 404", async () => {
    assert.equal((await api(url, { method: "DELETE", as: "admin" })).status, 204);
    assert.equal((await api(url, { method: "DELETE", as: "admin" })).status, 404);
  });
});

describe("PATCH /api/admin/reviews/[uuid] et DELETE (avis)", () => {
  // Avis 2 : approuvé dans le seed, sur le serveur 1 (qui n'est pas supprimé plus haut, contrairement au serveur 10)
  const url = `/api/admin/reviews/${C(2)}`;

  it("403 pour un membre", async () => {
    const res = await api(url, { method: "PATCH", as: "member", body: { status: "hidden", reason: REASON } });
    assert.equal(res.status, 403);
  });

  it("200 pour un modérateur (statut) et une ligne dans le journal", async () => {
    const before = await prisma.mod_Action.count({ where: { target: C(2), type: "review" } });
    const res = await api(url, { method: "PATCH", as: "moderator", body: { status: "hidden", reason: REASON } });
    assert.equal(res.status, 200);

    const after = await prisma.mod_Action.count({ where: { target: C(2), type: "review" } });
    assert.equal(after, before + 1);
  });

  it("403 pour un modérateur qui veut supprimer", async () => {
    assert.equal((await api(url, { method: "DELETE", as: "moderator" })).status, 403);
  });

  it("204 pour un admin qui supprime", async () => {
    assert.equal((await api(url, { method: "DELETE", as: "admin" })).status, 204);
  });
});

describe("PATCH /api/admin/users/[discord_id] (rôle d'un utilisateur)", () => {
  const eryndor = "810000000000000005"; // user 5, membre dans le seed
  const url = `/api/admin/users/${eryndor}`;

  it("401 sans session", async () => {
    const res = await api(url, { method: "PATCH", body: { role: "moderator", reason: REASON } });
    assert.equal(res.status, 401);
  });

  it("403 pour un membre", async () => {
    const res = await api(url, { method: "PATCH", as: "member", body: { role: "moderator", reason: REASON } });
    assert.equal(res.status, 403);
  });

  it("403 pour un modérateur (pas d'élévation de privilèges)", async () => {
    const res = await api(url, { method: "PATCH", as: "moderator", body: { role: "moderator", reason: REASON } });
    assert.equal(res.status, 403);

    const user = await prisma.user.findUnique({ where: { discord_id: eryndor }, select: { role: true } });
    assert.equal(user?.role, "member"); // rien n'a changé en base
  });

  it("400 pour un rôle admin (non autorisé par l'API)", async () => {
    const res = await api(url, { method: "PATCH", as: "admin", body: { role: "admin", reason: REASON } });
    assert.equal(res.status, 400);
  });

  it("403 si l'admin vise son propre rôle", async () => {
    const res = await api(`/api/admin/users/${USERS.admin.discordId}`, {
      method: "PATCH",
      as: "admin",
      body: { role: "member", reason: REASON },
    });
    assert.equal(res.status, 403);
  });

  it("200 pour un admin, avec une ligne role_change dans le journal", async () => {
    const before = await prisma.mod_Action.count({ where: { target: eryndor, action: "role_change" } });
    const res = await api(url, { method: "PATCH", as: "admin", body: { role: "moderator", reason: REASON } });
    assert.equal(res.status, 200);

    const user = await prisma.user.findUnique({ where: { discord_id: eryndor }, select: { role: true } });
    assert.equal(user?.role, "moderator");

    const after = await prisma.mod_Action.count({ where: { target: eryndor, action: "role_change" } });
    assert.equal(after, before + 1);
  });
});

describe("Jetons de session", () => {
  const url = `/api/admin/servers/${S(9)}`;

  it("le rôle d'un jeton forgé ne compte pas : la base fait foi", async () => {
    // Un membre dont le jeton prétend être admin
    const forged = tokenFor(USERS.member.discordId, "admin");
    const res = await api(url, { method: "DELETE", token: forged });
    assert.equal(res.status, 403);
  });

  it("401 pour un jeton signé avec un autre secret", async () => {
    const token = tokenFor(USERS.admin.discordId, "admin", { secret: "autre-secret" });
    assert.equal((await api(url, { method: "DELETE", token })).status, 401);
  });

  it("401 pour un jeton expiré", async () => {
    const token = jwt.sign(
      { sub: USERS.admin.discordId, role: "admin", exp: Math.floor(Date.now() / 1000) - 60 },
      process.env.JWT_SECRET!,
      { algorithm: "HS256" },
    );
    assert.equal((await api(url, { method: "DELETE", token })).status, 401);
  });

  it("401 pour un jeton non signé (alg none)", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ sub: USERS.admin.discordId, role: "admin" })).toString("base64url");
    assert.equal((await api(url, { method: "DELETE", token: `${header}.${payload}.` })).status, 401);
  });
});