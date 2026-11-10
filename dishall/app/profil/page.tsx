"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Icon } from "@iconify/react";
import { useUser } from "@/lib/getUser";

export default function ProfilPage() {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Chargement du profil...</p>;
  }

  if (!user) {
    return <p>Utilisateur non connecté</p>;
  }

  return (
    <>
      <Header />

      <main className="mx-6 lg:mx-auto lg:mt-32 lb:mb-24 lg:max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm transition hover:text-pink"
        >
          <Icon
            icon="radix-icons:arrow-left"
            width="20"
            height="20"
            aria-hidden="true"
          />
          Retour à l&apos;accueil
        </Link>

        <section className="mb-8 rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-6">
            <Image
              src={user.avatar}
              width={130}
              height={130}
              alt={`Logo du serveur ${user.pseudo}`}
              className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)] lg:size-32"
            />

            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <h1 className="min-w-0 truncate text-2xl font-bold lg:text-4xl">
                  {user.pseudo}
                </h1>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
