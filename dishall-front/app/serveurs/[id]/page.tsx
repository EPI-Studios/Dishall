import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { Suspense } from "react";
import { servers } from "@/app/data/servers";

type Props = { params: Promise<{ id: string }> };

// Titre de l'onglet du navigateur, propre à chaque serveur
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const server = servers.find((s) => s.id === Number(id));
  return { title: server ? `${server.name} | DisHall` : "Serveur introuvable" };
}

export default async function ServerPage({ params }: Props) {
  const { id } = await params;
  const server = servers.find((s) => s.id === Number(id));

  if (!server) notFound(); // affiche la page 404

  const roundedRating = Math.round(server.rating * 2) / 2;

  return (
    <>
      <Hero />
      
      <main className="mx-6 mb-8 lg:mx-auto lg:max-w-4xl">
        <Link
          href="/serveurs"
          className="mb-6 inline-flex items-center gap-2 text-sm transition hover:text-pink"
        >
          <Icon
            icon="radix-icons:arrow-left"
            width="20"
            height="20"
            aria-hidden="true"
          />
          Retour aux serveurs
        </Link>

        {/* Carte d'identité du serveur */}
        <Suspense
          fallback={
            <div className="text-center py-10">Chargement du serveur...</div>
          }
        >
          <section className="mb-8 rounded-xl border-2 border-pink bg-dark p-5 shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex items-start gap-4">
              <Image
                src={server.guild_picture}
                width={80}
                height={80}
                alt={`Logo du serveur ${server.name}`}
                className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)]"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold">{server.name}</h1>
                  <Image
                    src="/flag.png"
                    width={90}
                    height={60}
                    alt="Drapeau pays d'origine du serveur"
                    className="h-4 w-6 object-cover"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="rounded-xl border border-orange px-3 py-0.5 text-xs text-orange">
                    {server.category}
                  </span>

                  <div
                    className="flex shrink-0 gap-0.5"
                    role="img"
                    aria-label={`Note : ${roundedRating} sur 5`}
                  >
                    {[...Array(5)].map((_, i) => {
                      const fill = Math.min(Math.max(roundedRating - i, 0), 1);

                      return (
                        <span
                          key={i}
                          className="relative inline-block size-[13px]"
                        >
                          <Icon
                            icon="radix-icons:star-filled"
                            width="13"
                            height="13"
                            color="var(--color-white)"
                            className="block"
                            aria-hidden="true"
                          />
                          <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fill * 100}%` }}
                          >
                            <Icon
                              icon="radix-icons:star-filled"
                              width="13"
                              height="13"
                              color="var(--color-gold)"
                              className="block"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  <span className="flex items-center gap-1">
                    <Icon
                      icon="radix-icons:person"
                      width="20"
                      height="20"
                      aria-hidden="true"
                    />
                    {server.members} membres
                  </span>
                </div>
              </div>
            </div>

            <a
              href={server.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(image:--gradient-bump-btn) p-3 font-title text-xl transition hover:brightness-125"
            >
              Rejoindre
              <span className="sr-only">
                (ouvre Discord dans un nouvel onglet)
              </span>
            </a>
          </section>
        </Suspense>

        {/* Description */}
        <section className="rounded-xl border-2 border-pink bg-dark p-5 shadow-[0_0_10px_var(--color-pink)]">
          <h2 className="font-title text-gradient-subtitle mb-4 text-xl uppercase tracking-[0.1em]">
            Description
          </h2>
          <p className="leading-relaxed">{server.description}</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
