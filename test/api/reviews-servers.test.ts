// À placer dans : test/api/reviews-servers.test.ts
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/lib/prisma";
import { S, api, resetDb } from "./helpers";

before(() => resetDb());
after(() => prisma.$disconnect());

const COMMENT = "Un commentaire d'au moins dix caractères.";

describe("POST /api/reviews", () => {
  const post = (body: unknown, as?: "member" | "moderator" | "admin") =>
    api("/api/reviews", { method: "POST", as, body });

  it("401 sans session", async () => {
    assert.equal((await post({ serverUuid: S(2), rate: 4, comment: COMMENT })).status, 401);
  });

  it("400 si la note est hors limites", async () => {
    assert.equal((await post({ serverUuid: S(2), rate: 6, comment: COMMENT }, "member")).status, 400);
  });

  it("400 si le commentaire est trop court", async () => {
    assert.equal((await post({ serverUuid: S(2), rate: 4, comment: "court" }, "member")).status, 400);
  });

  it("404 sur un serveur en attente (serveur 8)", async () => {
    assert.equal((await post({ serverUuid: S(8), rate: 4, comment: COMMENT }, "member")).status, 404);
  });

  it("403 sur son propre serveur (le membre possède le serveur 4)", async () => {
    assert.equal((await post({ serverUuid: S(4), rate: 5, comment: COMMENT }, "member")).status, 403);
  });

  it("201 sur le serveur d'un autre", async () => {
    const res = await post({ serverUuid: S(2), rate: 5, comment: COMMENT }, "member");
    assert.equal(res.status, 201);

    const review = await res.json();
    assert.equal(review.rate, 5);
    // La réponse ne doit pas exposer d'identifiant interne
    assert.equal("id" in review, false);
    assert.equal("user_id" in review, false);
  });

  it("409 pour un deuxième avis sur le même serveur", async () => {
    assert.equal((await post({ serverUuid: S(2), rate: 3, comment: COMMENT }, "member")).status, 409);
  });
});

describe("PATCH et DELETE /api/servers/[uuid] (propriétaire)", () => {
  const description = "Une description de test qui dépasse largement les cinquante caractères exigés.";

  it("401 sans session", async () => {
    assert.equal((await api(`/api/servers/${S(4)}`, { method: "PATCH", body: { category: "gaming" } })).status, 401);
  });

  it("403 sur le serveur d'un autre (serveur 3)", async () => {
    const res = await api(`/api/servers/${S(3)}`, { method: "PATCH", as: "member", body: { category: "gaming" } });
    assert.equal(res.status, 403);
  });

  it("404 pour supprimer le serveur d'un autre, qui reste en base", async () => {
    const res = await api(`/api/servers/${S(3)}`, { method: "DELETE", as: "member" });
    assert.equal(res.status, 404);
    assert.ok(await prisma.server.findUnique({ where: { uuid: S(3) } }));
  });

  it("400 si la description est trop courte", async () => {
    const res = await api(`/api/servers/${S(4)}`, { method: "PATCH", as: "member", body: { description: "trop court" } });
    assert.equal(res.status, 400);
  });

  it("400 si le lien n'est pas une invitation Discord", async () => {
    const res = await api(`/api/servers/${S(4)}`, {
      method: "PATCH",
      as: "member",
      body: { link: "https://example.com/invite/abc" },
    });
    assert.equal(res.status, 400);
  });

  it("ignore un statut envoyé par le propriétaire", async () => {
    const res = await api(`/api/servers/${S(4)}`, {
      method: "PATCH",
      as: "member",
      body: { category: "musique", status: "rejected", score: 10 },
    });
    assert.equal(res.status, 200);

    const server = await prisma.server.findUnique({ where: { uuid: S(4) }, select: { status: true, category: true } });
    assert.equal(server?.category, "musique");
    assert.equal(server?.status, "approved"); // changer la catégorie ne touche pas au statut
  });

  // Nécessite la remise en attente après modification du contenu (voir ma réponse sur le PATCH du serveur)
  it("remet le serveur en attente quand la description change", async () => {
    const res = await api(`/api/servers/${S(4)}`, { method: "PATCH", as: "member", body: { description } });
    assert.equal(res.status, 200);

    const server = await prisma.server.findUnique({ where: { uuid: S(4) }, select: { status: true } });
    assert.equal(server?.status, "pending");
  });

  // Pas encore corrigé : un uuid mal formé donne un 500 au lieu d'un 404. 
  it("404 pour un uuid mal formé", async () => {
    const res = await api("/api/servers/pas-un-uuid", { method: "PATCH", as: "member", body: { category: "gaming" } });
    assert.equal(res.status, 404);
  });
});