"use client";

import Image from "next/image";
import Link from "next/link";
import discordServerIcon from "@/util/discordImage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  handleAdminDeleteServer,
  handleUpdateServerStatus,
} from "@/lib/servers/servers.client";

type ModerationServer = {
  uuid: string;
  guild_id: string;
  name: string;
  status: string;
  icon: string | null;
  serverStats: {
    server_bump: boolean;
    last_bump_at: Date | null;
    users_nb: number;
  } | null;
  score: {
    total_score: number;
  } | null;
};

export default function ServerCase({ server, canDelete }: { server: ModerationServer, canDelete: boolean }) {
  const router = useRouter();
  const [serverToDelete, setServerToDelete] = useState<ModerationServer | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [serverToUpdate, setServerToUpdate] = useState<ModerationServer | null>(
    null,
  );
  const [updateError, setUpdateError] = useState<string | null>(null);

  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  const lastBump = server.serverStats?.last_bump_at;

  let emoji = "❓";
  if (server.status === "approved") {
    emoji = "✅";
  } else if (server.status === "pending") {
    emoji = "⌛";
  } else if (server.status === "rejected") {
    emoji = "🚫";
  }

  function closeModal() {
    setServerToDelete(null);
    setDeleteError(null);
    setServerToUpdate(null);
    setUpdateError(null);
  }

  async function confirmDelete() {
    if (!serverToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await handleAdminDeleteServer(serverToDelete.uuid);
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
    if (!serverToUpdate) return;

    const status = formData.get("status") as string;
    const reason = String(formData.get("reason")).trim();

    if (
      status !== "rejected" &&
      status !== "pending" &&
      status !== "approved"
    ) {
      setUpdateError("Choisis un statut");
      return;
    }

    if (reason.length < 5) {
      setUpdateError("Indique une raison d'au moins 5 caractères.");
      return;
    }

    try {
      await handleUpdateServerStatus(serverToUpdate.uuid, status, reason);
      setServerToUpdate(null);
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
      <article
        key={server.uuid}
        className="group relative rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]"
      >
        <Link href={`/serveurs/${server.uuid}`} className="block h-full">
          <div className="flex items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-6">
            <Image
              src={discordServerIcon(server.guild_id, server.icon)}
              width={130}
              height={130}
              alt={`Logo du serveur ${server.name}`}
              className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)] lg:size-32"
            />

            <div className="min-w-0 flex-1 pr-20">
              <h3
                className="min-w-0 text-xl line-clamp-1 font-bold lg:text-xl"
                title={server.name}
              >
                {server.name}
              </h3>
              <span>
                {emoji} {server.status}
              </span>
              <p>
                {server.serverStats?.server_bump
                  ? "Bump actif"
                  : "Pas de bump"}{" "}
              </p>
              <p>
                Dernier bump :{" "}
                {lastBump ? dateFormatter.format(lastBump) : "jamais"}
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-lg font-bold">
              {server.score?.total_score
                ? `Score Total : ${server.score?.total_score}`
                : "Pas de note pour le moment"}
            </p>
          </div>
        </Link>

        <div className="absolute right-4 top-4 flex items-center gap-2 opacity-100 transition-opacity duration-200 lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100">
          <button
            type="button"
            aria-label={`Modifier statut de ${server.name}`}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-pink"
            onClick={() => setServerToUpdate(server)}
          >
            <Icon
              icon="radix-icons:pencil-1"
              width="24"
              height="24"
              color="var(--color-white)"
            />
          </button>
          {canDelete && (
          <button
            type="button"
            aria-label={`Supprimer ${server.name}`}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-pink"
            onClick={() => setServerToDelete(server)}
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

      {serverToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-lg">
              Supprimer le serveur{" "}
              <span className="font-bold">{serverToDelete.name}</span> ? Cette
              action est irréversible.
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

      {serverToUpdate && (
        <form
          action={handleAction}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 "
        >
          <div className="flex flex-col rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex flex-col items-center justify-center mb-8">
              <label className="text-xl mb-4">Rôle</label>
              <select
                name="status"
                defaultValue={serverToUpdate.status}
                className="border text-center border-pink rounded-xl p-2"
                required
              >
                <option value="">Choisis un statut</option>
                <option value="approved">Approuvé</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
              <label htmlFor="reason" className="text-xl mb-4">
                Raison
              </label>
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
