"use client";

import { useState } from "react";
import { CategoryType } from "../../@types/type";
import { Icon } from "@iconify/react";
import CategoryCard from "./CategoryCard";

// TODO laisser le useState et ce qui le concerne ici et mettre le reste dans catégorie

export default function CategoryList({ categories }: { categories: CategoryType[] }) {
  const [sortBy, setSortBy] = useState("popularity");
  const [searchTerm, setSearchTerm] = useState("");

  // .filter crée un nouveau tableau, pas besoin de faire une copie avec [...categories]
  const sorted = categories
    .filter((category: CategoryType) => {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase());
    })

    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "fr"); // Ordre alphabétique
      if (sortBy === "servers") return b.nb_server - a.nb_server; // Ordre par nombre de serveurs
      return b.nb_user - a.nb_user; // Ordre par popularité, nombre de membres
    });

  return (
    <>

      <section className="mx-auto mb-8 flex w-full flex-col items-center gap-3 lg:max-w-2xl lg:flex-row lg:items-stretch">
        <div className="flex w-full items-center gap-4 rounded-xl px-4 py-2 border-1 border-pink shadow-[0_0_10px_var(--color-pink)] lg:flex-1">
          <Icon
            icon="radix-icons:magnifying-glass"
            width="28"
            height="28"
            aria-hidden="true"
            color="var(--color-pink)"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Rechercher une catégorie"
            placeholder="Rechercher une catégorie"
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Trier les catégories"
          className="rounded-xl border-1 border-pink p-3 text-sm"
        >
          <option value="popularity">Tri par popularité</option>
          <option value="name">Tri par nom (A-Z)</option>
          <option value="servers">Tri par nombre de serveurs</option>
        </select>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sorted.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </section>

      {sorted.length === 0 && (
        <p className="text-center">
          Aucune catégorie ne correspond à votre recherche.
        </p>
      )}
    </>
  );
}
