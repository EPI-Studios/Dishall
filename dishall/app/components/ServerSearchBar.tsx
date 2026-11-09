"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { ServerType } from "@/@types/type";

export default function ServerSearchBar({
  servers,
}: {
  servers: ServerType[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const results = search
    ? servers
        .filter((server) => server.name.toLowerCase().includes(search))
        .slice(0, 5) // Pour avoir 5 suggestions de serveurs maximimum
    : [];

  return (
    <div className="relative z-25 flex h-full items-center justify-center p-4 lg:items-end lg:pb-32">
      <form
        className="relative flex w-full max-w-2xl justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          // Entrée : ouvre le premier résultat
          if (results[0]) {
            router.push(`/serveurs/${results[0].id}`);
            setQuery("");
          }
        }}
      >
        <div className="flex w-full items-center gap-3 rounded-xl bg-pink px-4 py-2 text-dark shadow-[0_0_30px_var(--color-pink)] lg:gap-4 lg:px-8">
          <Icon
            icon="radix-icons:magnifying-glass"
            width="28"
            height="28"
            aria-hidden="true"
            className="shrink-0"
          />
          <input
            type="search"
            name="server"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un serveur"
            placeholder="Rechercher un serveur"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-dark"
          />
          <button
            type="submit"
            aria-label="Lancer la recherche"
            className="shrink-0 cursor-pointer"
          >
            <Icon
              icon="radix-icons:arrow-right"
              width="28"
              height="28"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Suggestions sous la barre */}
        {search && (
          <ul className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border-2 border-pink bg-dark text-white shadow-[0_0_15px_var(--color-pink)]">
            {results.length > 0 ? (
              results.map((server) => (
                <li key={server.id}>
                  <Link
                    href={`/serveurs/${server.uuid}`}
                    onClick={() => setQuery("")}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-pink/20"
                  >
                    <span className="truncate font-bold">{server.name}</span>
                    <span className="shrink-0 text-xs text-orange">
                      {server.category}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm">Aucun serveur trouvé.</li>
            )}
          </ul>
        )}
      </form>
    </div>
  );
}
