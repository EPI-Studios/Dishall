"use client";

import {
  handleDeleteReview,
  handleUpdateReviewStatus,
} from "@/lib/reviews/reviews.client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ModerationReview = {
  uuid: string;
  comment: string;
  rate: number;
  status: string;
  created_at: Date;
  user: { pseudo: string } | null;
  server: { name: string };
};

export default function ReviewCase({
  review,
  isAdmin,
}: {
  review: ModerationReview;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [reviewToDelete, setReviewToDelete] = useState<ModerationReview | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [reviewToUpdate, setReviewToUpdate] = useState<ModerationReview | null>(
    null,
  );
  const [updateError, setUpdateError] = useState<string | null>(null);

  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  const formattedDate = dateFormatter.format(review.created_at);

  let emoji = "❓";
  if (review.status === "approved") {
    emoji = "✅";
  } else if (review.status === "pending") {
    emoji = "⌛";
  } else if (review.status === "hidden") {
    emoji = "🚫";
  }

  function closeModal() {
    setReviewToDelete(null);
    setDeleteError(null);
    setReviewToUpdate(null);
    setUpdateError(null);
  }

  async function confirmDelete() {
    if (!reviewToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await handleDeleteReview(reviewToDelete.uuid);
      closeModal();
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "La suppression a échoué",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const handleAction = async (formData: FormData) => {
    if (!reviewToUpdate) return;

    const status = formData.get("status") as string;
    const reason = String(formData.get("reason")).trim();

    if (status !== "approved" && status !== "pending" && status !== "hidden") {
      setUpdateError("Choisis un statut");
      return;
    }

    if (reason.length < 5) {
      setUpdateError("Indique une raison d'au moins 5 caractères.");
      return;
    }

    try {
      await handleUpdateReviewStatus(reviewToUpdate.uuid, status, reason);
      setReviewToUpdate(null);
      setUpdateError(null);
      router.refresh();
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "La modification a échoué",
      );
    }
  };

  return (
    <>
      <article className="group relative rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]">
        <div className="min-w-0">
          {/* pr-24 : garde la place des boutons sur les deux premières lignes */}
          <h3 className="line-clamp-1 pr-24 text-xl font-bold">
            De {review.user?.pseudo || "Utilisateur supprimé"}
          </h3>
          <p className="pr-24 font-bold">Sur {review.server.name}</p>
          <p>
            le{" "}
            <time dateTime={review.created_at.toISOString()}>
              {formattedDate}
            </time>
          </p>
          <span className="font-bold">{review.rate}/5 ⭐</span>
          <p className="break-words">{review.comment}</p>
          <span>
            {emoji} {review.status}
          </span>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-2 opacity-100 transition-opacity duration-200 lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100">
          <button
            type="button"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-pink"
            aria-label={`Modifier le statut du commentaire de ${review.user?.pseudo ?? "un utilisateur supprimé"}`}
            onClick={() => setReviewToUpdate(review)}
          >
            <Icon
              icon="radix-icons:pencil-1"
              width="24"
              height="24"
              color="var(--color-white)"
            />
          </button>
          {isAdmin && (
            <button
              type="button"
              aria-label={`Supprimer le commentaire de ${review.user?.pseudo ?? "un utilisateur supprimé"}`}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-pink"
              onClick={() => setReviewToDelete(review)}
            >
              <Icon
                icon="radix-icons:trash"
                width="24"
                height="24"
                color="var(--color-white)"
              />
            </button>
          )}
        </div>
      </article>

      {reviewToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-lg">
              Supprimer le commentaire de{" "}
              <span className="font-bold">
                {reviewToDelete.user?.pseudo ?? "un utilisateur supprimé"}
              </span>{" "}
              ? Cette action est irréversible.
            </p>

            {deleteError && (
              <p role="alert" className="mb-6 text-red-400">
                {deleteError}
              </p>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-xl border-2 border-pink bg-pink px-4 py-2 font-bold text-[var(--color-white)]"
                onClick={confirmDelete}
              >
                {isDeleting ? "Suppression..." : "Oui, supprimer"}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-xl border-2 border-pink px-4 py-2 text-[var(--color-white)]"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewToUpdate && (
        <form
          action={handleAction}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
        >
          <div className="flex flex-col rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex flex-col items-center justify-center mb-8">
              <label className="text-xl mb-4">Statut du commentaire</label>
              <select
                name="status"
                defaultValue={reviewToUpdate.status}
                className="border text-center border-pink rounded-xl p-2"
                required
              >
                <option value="">Choisis un statut</option>
                <option value="approved">Approuvé</option>
                <option value="pending">En attente</option>
                <option value="hidden">Caché</option>
              </select>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
              <label className="text-xl mb-4">Raison</label>
              <textarea
                name="reason"
                rows={3}
                required
                minLength={5}
                maxLength={500}
                placeholder="Pourquoi ce changement ?"
                className="w-full min-w-64 resize-none rounded-xl border border-pink bg-transparent p-2"
              />
            </div>

            {updateError && (
              <p role="alert" className="mb-6 text-red-400">
                {updateError}
              </p>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="rounded-xl border-2 border-pink bg-pink px-4 py-2 font-bold text-[var(--color-white)]"
              >
                Valider
              </button>
              <button
                type="button"
                className="rounded-xl border-2 border-pink px-4 py-2 text-[var(--color-white)]"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
