"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import type { ServerType } from "@/@types/type";
import ServerCard from "./ServerCard";

export default function ServerList({ servers }: { servers: ServerType[] }) {
  const [sortBy, setSortBy] = useState("popularity");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Copie obligatoire : sort() modifierait le tableau reçu en props
  const sorted = [...servers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name, "fr");
    if (sortBy === "rating") return b.rating - a.rating;
    return b.members - a.members;
  });

  return (
    <>
      <div className="relative mb-8">

        <div
          ref={menuRef}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2"
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Filtrer les serveurs"
            aria-expanded={isOpen}
            aria-controls="sort-menu"
            className="cursor-pointer"
          >
            <Icon
              icon="energy-icons:filter-48"
              width="40"
              height="40"
              aria-hidden="true"
              color="var(--color-pink)"
            />
          </button>

          {isOpen && (
            <div
              id="sort-menu"
              className="absolute right-0 top-full z-20 mt-2 flex w-48 flex-col gap-1 rounded-xl border-2 border-pink bg-dark p-2 text-sm shadow-[0_0_15px_var(--color-pink)]"
            >
              <p className="px-3 py-1 text-xs opacity-70">Trier par</p>
              
                <button
                  key="popularity"
                  type="button"
                  aria-pressed={sortBy === "popularity"}
                  onClick={() => {
                    setSortBy("popularity");
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-left transition hover:bg-pink/20 ${
                    sortBy === "popularity" ? "bg-pink/30 font-bold" : ""
                  }`}
                >
                  <p>Popularité</p>
                </button>
                <button
                  key="name"
                  type="button"
                  aria-pressed={sortBy === "name"}
                  onClick={() => {
                    setSortBy("name");
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-left transition hover:bg-pink/20 ${
                    sortBy === "name" ? "bg-pink/30 font-bold" : ""
                  }`}
                >
                  <p>Nom (A-Z)</p>
                </button>
                <button
                  key="rating"
                  type="button"
                  aria-pressed={sortBy === "rating"}
                  onClick={() => {
                    setSortBy("rating");
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-left transition hover:bg-pink/20 ${
                    sortBy === "rating" ? "bg-pink/30 font-bold" : ""
                  }`}
                >
                  <p>Avis</p>
                </button>
              
            </div>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sorted.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </section>
    </>
  );
}
