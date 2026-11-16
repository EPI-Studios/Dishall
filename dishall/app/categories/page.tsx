import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryFilter from "../components/CategoryFilter";
import ServerCard from "../components/ServerCard";
import { categories } from "../../data/categories";
import { Metadata } from "next";
import { getServers } from "@/lib/servers/servers.server";
import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "DisHall | Catégories",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  return (
    <>
      <Hero />

      <main className="lg:mx-auto lg:max-w-4xl mx-6 mb-8">
        <Suspense fallback={<p className="text-center">Chargement...</p>}>
          <CategoryContent searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

async function CategoryContent({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  const category = categories.find((c) => c.slug === slug);

  const servers = slug
    ? (await getServers()).filter(
        (server) => server.category?.toLowerCase() === slug.toLowerCase(),
      )
    : [];

  return (
    <>
      <h3 className="lg:text-2xl font-title text-gradient-subtitle text-center text-lg tracking-[0.1em] uppercase mb-8">
        {category ? category.name : "Toutes les catégories"}
      </h3>

      {slug ? (
        <>
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-2 text-sm transition hover:text-pink"
        >
          <Icon
            icon="radix-icons:arrow-left"
            width="20"
            height="20"
            aria-hidden="true"
          />
          Retour aux catégories
        </Link>
        <div className="flex flex-col gap-4">
          {servers.length > 0 ? (
            servers.map((server) => (
              <ServerCard key={server.uuid} server={server} />
            ))
          ) : (
            <p className="text-center">Aucun serveur dans cette catégorie.</p>
          )}
        </div>
        </>
      ) : (
        <CategoryFilter categories={categories} />
      )}
    </>
  );
}
