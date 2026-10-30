"use client";

import CategoryCard from "../components/CategoryCard";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Icon } from "@iconify/react";
import { useState } from "react";

const categories = [
  { id: 1, name: "Gaming", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "boxicons:gaming", nb_user: 100, nb_server: 20 },
  { id: 2, name: "Musique", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "arcticons:emoji-musical-note", nb_user: 80, nb_server: 15 },
  { id: 3, name: "Technologie", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "arcticons:emoji-desktop-computer", nb_user: 40, nb_server: 2 },
  { id: 4, name: "Cinéma", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "arcticons:google-movies", nb_user: 60, nb_server: 10 },
  { id: 5, name: "Anime", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "arcticons:line-manga", nb_user: 95, nb_server: 18 },
  { id: 6, name: "Communauté", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "fluent:people-community-32-light", nb_user: 70, nb_server: 25 },
  { id: 7, name: "Esport", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "streamline-flex:esports", nb_user: 50, nb_server: 9 },
  { id: 8, name: "Mêmes & Humour", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "mynaui:funny", nb_user: 85, nb_server: 12 },
  { id: 9, name: "Roleplay", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "arcticons:idle-fantasy", nb_user: 30, nb_server: 6 },
  { id: 10, name: "Streaming", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: "hugeicons:live-streaming-02", nb_user: 45, nb_server: 7 },
];

export default function Categories() {
  const [sortBy, setSortBy] = useState("popularity");
  const [searchTerm, setSearchTerm] = useState("");

  // .filter crée un nouveau tableau, pas besoin de faire une copie avec [...categories]
  const sorted = categories
    .filter((category) => {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  
    .sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name, "fr"); // Ordre alphabétique
    if (sortBy === "servers") return b.nb_server - a.nb_server; // Ordre par nombre de serveurs
    return b.nb_user - a.nb_user // Ordre par popularité, nombre de membres 
  });



  return (
    <>
      <Hero />
      <main className="lg:mx-auto lg:max-w-4xl mx-6 mb-8">
        <h3 className="lg:text-2xl font-title text-gradient-subtitle text-center text-lg tracking-[0.1em] uppercase mb-8">
          Toutes les catégories
        </h3>

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
            <CategoryCard key={category.id} {...category} />
          ))}        
        </section>

        {sorted.length === 0 && (
          <p className="text-center">Aucune catégorie ne correspond à votre recherche.</p>
        )}
      </main>

      <Footer />
    </>
  );
}
