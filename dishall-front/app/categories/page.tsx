import Hero from "../components/Hero";
import { Icon } from "@iconify/react";

export default function Categories() {
  return (
    <>
      <Hero />
      <main className="lg:mx-auto lg:max-w-4xl mx-6 mb-8">
        <h3 className="lg:text-2xl font-title text-gradient-subtitle mb-2 text-center text-lg tracking-[0.1em] uppercase mb-8">
          Toutes les catégories
        </h3>
        <section>
          <div className="flex gap-5">
            <div className="flex w-full max-w-1xl items-center gap-4 rounded-xl px-4 py-2 border-1 border-pink shadow-[0_0_10px_var(--color-pink)]">
              <Icon
                icon="radix-icons:magnifying-glass"
                width="28"
                height="28"
                aria-hidden="true"
                className="color-pink"
              />
              <input
                type="search"
                name="category"
                aria-label="Rechercher une catégorie"
                placeholder="Rechercher une catégorie"
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <select className="rounded-xl border-1 border-pink p-3 text-sm">
              <option>Tri par popularité</option>
              <option>1</option>
              <option>1</option>
              <option>1</option>

            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2"></section>
      </main>
    </>
  );
}
