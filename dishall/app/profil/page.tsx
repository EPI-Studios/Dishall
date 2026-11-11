"use client";

import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import UserSection from "./components/UserSection";
import ServersSection from "./components/ServersSection";
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

      <main className="mx-6 lg:mx-auto lg:mt-32 lg:mb-24 lg:max-w-4xl">
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

        <h3 className="lg:text-2xl font-title text-gradient-subtitle mb-4 text-center text-lg tracking-[0.1em] uppercase">
          Mon profil
        </h3>

        <UserSection user={user} />

        <h3 className="lg:text-2xl font-title text-gradient-subtitle mb-4 text-center text-lg tracking-[0.1em] uppercase">
          Mes serveurs
        </h3>

        <ServersSection />
        
      </main>

      <Footer />
    </>
  );
}
