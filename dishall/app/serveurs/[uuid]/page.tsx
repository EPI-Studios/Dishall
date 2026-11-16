import Image from "next/image";
import Link from "next/link";
import ReviewSummary from "@/app/components/ReviewSummary";
import LatestReviews from "@/app/components/LatestReviews";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { getServerByUuid } from "@/lib/servers/servers.server";
import { getReviewsByServerUuid } from "@/lib/reviews";
import { Suspense } from "react";
import discordServerIcon from "@/util/discordImage";

type Props = { params: Promise<{ uuid: string }> };

export const metadata: Metadata = {
  title: "DisHall | Serveur",
};

export default async function ServerPage({ params }: Props) {
  return (
    <>
      <Header />

      <main className="mx-6 lg:mx-auto lg:mt-32 lg:mb-24 lg:max-w-4xl">
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

        <Suspense
          fallback={
            <p className="py-10 text-center">Chargement du serveur...</p>
          }
        >
          <ServerContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

async function ServerContent({ params }: Props) {
  const { uuid } = await params;
  const server = await getServerByUuid(uuid);
  const reviews = await getReviewsByServerUuid(uuid);

  if (!server) notFound();
  return (
    <>
      {/* Bannière du serveur */}
      {server.banner && (
        <section className="mb-8 overflow-hidden rounded-xl border-2 border-pink bg-dark shadow-[0_0_10px_var(--color-pink)]">
          <Image
            src={server.banner}
            width={800}
            height={300}
            alt=""
            aria-hidden="true"
            className="h-32 w-full object-cover lg:h-48"
          />
        </section>
      )}

      {/* Informations du serveur */}
      <section className="mb-8 rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-6">
          {server.icon && (
            <Image
            src={discordServerIcon(server.guild_id, server.icon)} 
            width={130}
            height={130}
            alt={`Logo du serveur ${server.name}`}
            className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)] lg:size-32"
          />
          )}
          
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <h1 className="min-w-0 truncate text-2xl font-bold lg:text-4xl">
                {server.name}
              </h1>
              <Icon
                icon={`flag:${server.country.toLowerCase()}-4x3`}
                width="48"
                height="36"
                role="img"
                aria-label={`Drapeau : ${server.country.toUpperCase()}`}
                className="shrink-0 rounded-sm lg:block"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <span className="rounded-xl border border-orange px-4 py-1 text-sm text-orange">
                {server.category}
              </span>

              {server.tags.map((tag) => (
                <span
                  className="rounded-xl border border-orange px-3 py-0.5 text-xs text-orange"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-self-center lg:flex-col lg:gap-0 lg:justify-self-auto">
            <Icon
              icon="radix-icons:person"
              width="32"
              height="32"
              aria-hidden="true"
            />
            <span className="text-lg">
              {server.members}
              <span className="sr-only"> membres</span>
            </span>
          </div>

          <a
            href={server.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-xl bg-(image:--gradient-bump-btn) px-6 py-3 text-center text-xl font-bold leading-tight shadow-[0_0_10px_var(--color-pink)] transition hover:brightness-125"
          >
            Rejoindre
            <br className="hidden lg:block" />
            <span className="hidden lg:inline"> le serveur</span>
            <span className="sr-only">
              {" "}
              (ouvre Discord dans un nouvel onglet)
            </span>
          </a>
        </div>
      </section>

      {/* Description */}
      <section className="rounded-xl border-2 border-pink bg-dark p-5 shadow-[0_0_10px_var(--color-pink)] mb-8">
        <h2 className="font-title text-gradient-subtitle text-center mb-4 text-xl uppercase tracking-[0.1em]">
          Description
        </h2>
        <p className="leading-relaxed">{server.description}</p>
      </section>

      {/* Avis */}

      <ReviewSummary reviews={reviews} />
      <LatestReviews reviews={reviews} />
    </>
  );
}
