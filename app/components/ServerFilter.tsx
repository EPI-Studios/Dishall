"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import type { ServerType } from "@/@types/type";
import ServerList from "./ServerList";

export default function ServerFilter({ servers }: { servers: ServerType[] }) {
  const [sortBy, setSortBy] = useState("score");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const SORT_OPTIONS = [
    { value: "score", label: "Meilleur score" },
    { value: "popularity", label: "Popularité" },
    { value: "name", label: "Nom (A-Z)" },
    { value: "rating", label: "Avis" },
  ];

  // Copie obligatoire : sort() modifierait le tableau reçu en props
  const sorted = [...servers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name, "fr");
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "popularity") return b.members - a.members;
    return b.score - a.score || b.members - a.members; // score, puis membres en cas d'égalité
  });

  return (
    <>
      <div className="relative mb-8">
        <div
          ref={menuRef}
          className="absolute right-0 -top-4 z-20 -translate-y-1/2"
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

              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={sortBy === option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-left transition hover:bg-pink/20 ${
                    sortBy === option.value ? "bg-pink/30 font-bold" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ServerList sorted={sorted} />
    </>
  );
}
