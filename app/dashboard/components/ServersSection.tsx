"use client";

import Image from "next/image";
import { categories } from "@/data/categories";
import { Icon } from "@iconify/react";
import { ServerType } from "@/@types/type";
import { useEffect, useState } from "react";
import {
  getServersByUser,
  handleDeleteServer,
  handleUpdateServer,
} from "@/lib/servers/servers.client";
import discordServerIcon from "@/util/discordImage";
import Link from "next/link";

export default function ServersSection() {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [serverUpdate, setServerUpdate] = useState<ServerType | null>(null);
  const [serverToDelete, setServerToDelete] = useState<ServerType | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      try {
        const data = await getServersByUser();
        setServers(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchServers();
  }, []);

  async function confirmDelete() {
    if (!serverToDelete) return;

    try {
      await handleDeleteServer(serverToDelete.uuid);

      setServers((prev) =>
        prev.filter((server) => server.uuid !== serverToDelete.uuid),
      );
      setServerToDelete(null);
    } catch (error) {
      console.error(error);
    }
  }

  const handleAction = async (formData: FormData) => {
    if (!serverUpdate) return;
    setFormError(null);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const country = formData.get("country") as string;
    const category = formData.get("category") as string;
    const link = formData.get("link") as string;

    try {
      const updated = await handleUpdateServer(
        serverUpdate.uuid,
        name,
        description,
        country,
        category,
        link,
      );

      setServers((prev) =>
        prev.map((server) =>
          server.uuid === updated.uuid ? { ...server, ...updated } : server,
        ),
      );
      setServerUpdate(null);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    }
  };

  return (
    <>
      {servers.map((server: ServerType) => (
        <article
          key={server.uuid}
          className="relative mb-8 rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]"
        >
          <Link href={`/serveurs/${server.uuid}`} className="block h-full">
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-6">
              <Image
                src={discordServerIcon(server.guild_id, server.icon)}
                width={130}
                height={130}
                alt={`Logo du serveur ${server.name}`}
                className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)] lg:size-32"
              />

              <div className="flex min-w-0 flex-col gap-3">
                <h3
                  className="min-w-0 text-xl line-clamp-2 text-center font-bold lg:text-3xl"
                  title={server.name}
                >
                  {server.name}
                </h3>
              </div>
            </div>
          </Link>

          <div className="flex gap-8 justify-center">
            <button
              aria-label="Modifier le serveur"
              className="flex size-10 items-center justify-center rounded-full bg-pink lg:absolute lg:-right-5 lg:top-6"
              onClick={() => {
                setFormError(null);
                setServerUpdate(server);
              }}
            >
              <Icon
                icon="radix-icons:pencil-1"
                width="30"
                height="30"
                color="var(--color-white)"
                className="cursor-pointer"
              />
            </button>
            <button
              aria-label="Supprimer le serveur"
              className="flex size-10 items-center justify-center rounded-full bg-pink lg:absolute lg:-right-5 lg:bottom-6"
              onClick={() => setServerToDelete(server)}
            >
              <Icon
                icon="radix-icons:trash"
                width="30"
                height="30"
                color="var(--color-white)"
                className="cursor-pointer"
              />
            </button>
          </div>
        </article>
      ))}

      {serverToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setServerToDelete(null)}
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

            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="rounded-xl border-2 border-pink bg-pink px-4 py-2 font-bold text-[var(--color-white)]"
                onClick={confirmDelete}
              >
                Oui, supprimer
              </button>
              <button
                type="button"
                className="rounded-xl border-2 border-pink px-4 py-2 text-[var(--color-white)]"
                onClick={() => setServerToDelete(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {serverUpdate && (
        <form
          action={handleAction}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
        >
          <div className="flex flex-col rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex flex-col items-center justify-center mb-8">
              <label className="text-xl mb-2">Nom du serveur</label>
              <input
                name="name"
                type="text"
                minLength={2}
                maxLength={100}
                className="border text-center border-pink rounded-xl p-2 mb-4"
                placeholder={serverUpdate.name}
              />

              <label className="text-xl mb-2">Description</label>
              <textarea
                name="description"
                className="border text-center border-pink rounded-xl px-10 pb-16 mb-4"
                minLength={50}
                maxLength={1000}
                placeholder={serverUpdate.description}
              />

              <label className="text-xl mb-2">Catégorie</label>
              <select
                name="category"
                className="border text-center border-pink rounded-xl p-2 mb-4"
              >
                <option value={serverUpdate.category}>
                  {serverUpdate.category}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label className="text-xl mb-2">Pays du serveur</label>
              <select
                name="country"
                className="border text-center border-pink rounded-xl p-2 mb-4"
              >
                <option value={serverUpdate.country}>
                  {serverUpdate.country}
                </option>
                <option value="FR">France</option>
                <option value="US">Etats-Unis</option>
                <option value="UK">Royaume-Uni</option>
                <option value="CA">Canada</option>
                <option value="DE">Allemagne</option>
              </select>

              <label className="text-xl mb-2">Lien du serveur</label>
              <input
                name="link"
                type="url"
                className="border text-center border-pink rounded-xl p-2 mb-4"
                placeholder={serverUpdate.link}
              />
            </div>

            {formError && <p className="mb-4 z-60 text-red-500">{formError}</p>}

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
                onClick={() => {
                  setFormError(null);
                  setServerUpdate(null);
                }}
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
