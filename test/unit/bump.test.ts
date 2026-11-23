import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isBumped, BUMP_DURATION_MS } from "@/util/bump";

describe("isBumped", () => {
  it("renvoie false si jamais bumpé", () => {
    assert.equal(isBumped(null), false);
  });

  it("renvoie true pour un bump de 10 minutes", () => {
    assert.equal(isBumped(new Date(Date.now() - 10 * 60_000)), true);
  });

  it("renvoie true juste avant la fin de la durée", () => {
    assert.equal(isBumped(new Date(Date.now() - BUMP_DURATION_MS + 60_000)), true);
  });

  it("renvoie false quand la durée est écoulée", () => {
    assert.equal(isBumped(new Date(Date.now() - BUMP_DURATION_MS)), false);
  });
});