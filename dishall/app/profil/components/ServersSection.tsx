import Image from "next/image";
import { Icon } from "@iconify/react";
import { ServerType } from "@/@types/type";
import { useEffect, useState } from "react";
import {
  getServersByUser,
  handleDeleteServer,
} from "@/lib/servers/servers.client";

export default function ServersSection() {
  const [serverToDelete, setServerToDelete] = useState<ServerType | null>(null);
  const [servers, setServers] = useState<ServerType[]>([]);

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

  function discordServerIcon(guildId: string, icon: string) {
    if (!icon) {
      return "/profil.png";
    }

    const extension = icon.startsWith("a_") ? "gif" : "webp";

    return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${extension}`;
  }

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

  return (
    <>
      {servers.map((server: ServerType) => (
        <article
          key={server.uuid}
          className="relative mb-8 rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]"
        >
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

          <div className="flex gap-8 justify-center">
            <button
              aria-label="Modifier le serveur"
              className="flex size-10 items-center justify-center rounded-full bg-pink lg:absolute lg:-right-5 lg:top-6"
            >
              <Icon
                icon="radix-icons:pencil-1"
                width="30"
                height="30"
                color="var(--color-white)"
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
          <div className="w-full max-w-md rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]">
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
    </>
  );
}
