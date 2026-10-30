"use client";

import Header from "./Header";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { servers } from "../data/servers";
import Link from "next/link";

export default function Hero() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();
  const results = search
    ? servers
        .filter((server) => server.name.toLowerCase().includes(search))
        .slice(0, 5) // Pour avoir 5 suggestions de serveurs maximimum
    : [];

  if (pathname === "/") {
    return (
      <div className="relative">
        <Header />

        <section className="relative mx-6 mb-8 h-[284px] w-auto overflow-hidden rounded-xl lg:mx-0 lg:mb-12 lg:h-[600px] lg:rounded-none">
          <div className="absolute inset-0 z-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 lg:opacity-100 lg:bg-top"></div>

          {/* Dégradé pour assombrir le fond*/}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-linear-to-t from-dark via-dark/20 to-transparent"
          ></div>

          <p
            aria-hidden="true"
            className="font-title glow-title absolute left-1/2 top-[30%] z-10 hidden -translate-x-1/2 text-8xl lg:block -rotate-4"
          >
            DISHALL
          </p>

          <div className="relative z-10 p-4 lg:flex lg:h-full lg:items-end lg:justify-between lg:px-10 lg:pb-8">
            <div>
              <h2 className="font-title text-2xl lg:text-5xl leading-normal tracking-[0.05em] lg:tracking-[0.1em]  drop-shadow-[0_0_10px_var(--color-pink)] mb-8">
                Trouve ton <br /> serveur Discord
              </h2>

              <p className="mt-4 text-sm lg:text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="mt-10 flex justify-evenly lg:mr-20 lg:mb-5 lg:gap-20">
              <Link href="/serveurs">
                <button className="lg:h-[70px] lg:w-[200px] h-[45px] w-[135px] lg:text-xl rounded-xl bg-orange text-sm leading-tight tracking-[0.05em] text-[var(--color-dark)] hover:font-bold">
                  Explorer les <br />
                  serveurs
                </button>
              </Link>
              <button className="lg:h-[70px] lg:w-[200px] h-[45px] w-[135px] lg:text-xl rounded-xl border-2 border-pink bg-dark text-sm tracking-[0.05em] text-[var(--color-white)] shadow-[0_0_10px_var(--color-pink)] hover:font-bold">
                Ajouter le mien
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <Header />

        <section className="relative mx-6 mb-8 h-[175px] w-auto lg:mx-0 lg:mb-12 lg:h-[600px]">
          {/* Fonds : c'est eux qui sont coupés aux coins arrondis */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-xl lg:rounded-none">
            <div className="absolute inset-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 lg:bg-top lg:opacity-100"></div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-dark via-dark/20 to-transparent"
            ></div>
          </div>

          <p
            aria-hidden="true"
            className="font-title glow-title absolute left-1/2 top-[30%] z-10 hidden -translate-x-1/2 -rotate-4 text-8xl lg:block"
          >
            DISHALL
          </p>

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
                          href={`/serveurs/${server.id}`}
                          onClick={() => setQuery("")}
                          className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-pink/20"
                        >
                          <span className="truncate font-bold">
                            {server.name}
                          </span>
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
        </section>
      </div>
    );
  }
}
