"use client"

export async function handleDeleteReview(uuid: string) {
  let response: Response;

  try {
    response = await fetch(`/api/reviews/${uuid}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // fetch lui-même a échoué (réseau coupé, serveur injoignable)
    throw new Error("Impossible de contacter le serveur");
  }

  if (!response.ok) {
    // Une erreur a un body { error }, le 204 de succès n'en a pas
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "La suppression a échoué");
  }
};

export async function handleUpdateReviewStatus(uuid: string, status: string) {
  let response: Response;

  try {
    response = await fetch(`/api/reviews/${uuid}/`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch {
    throw new Error("Impossible de contacter le serveur");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "La modification a échoué");
  }
};

