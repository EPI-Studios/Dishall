"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "./Navbar";
import { Icon } from "@iconify/react";
import { useUser } from "@/lib/getUser";

export default function Header() {
  const { user, loading, logout } = useUser();

  return (
    <header className="relative z-30 m-6 flex items-center justify-between lg:absolute lg:inset-x-0 lg:top-0 lg:m-0 lg:px-10 lg:py-6">
      <div className="relative z-50 flex items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            width={60}
            height={65}
            alt="logo Dishall"
            loading="eager"
            className="h-auto w-[60px] shrink-0"
          />
        </Link>

        <h1 className="font-title text-gradient-title ml-4 text-4xl tracking-[0.05em] lg:sr-only">
          DISHALL
        </h1>

        {/* Navigation Desktop */}
        <nav className="ml-8 hidden gap-8 text-sm lg:flex">
          <Link className="hover:font-bold lg:text-xl" href="/serveurs">
            Serveurs
          </Link>
          <Link className="hover:font-bold lg:text-xl" href="/categories">
            Catégories
          </Link>
        </nav>
      </div>

      <div className="hidden items-center gap-4 text-sm lg:flex">
        {loading ? (
          <div className="size-12 rounded-full bg-white/10" />
        ) : user ? (
          <>
          <Link className="hover:font-bold lg:text-xl mr-8" href="/api/auth/discord/guild/login">
            Ajouter mon serveur
            </Link>
            <Link className="hover:font-bold lg:text-xl mr-8" href="/profil">
            Mon Profil
            </Link>
            <button className="hover:font-bold lg:text-xl mr-8" onClick={logout}>
            Déconnexion
            </button>
            <Image
              src={user.avatar}
              width={48}
              height={48}
              alt={`Avatar de ${user.pseudo}`}
              className="size-12 rounded-full object-cover"
            />
          </>
        ) : (
          <>
            <a
              className="hover:font-bold lg:text-xl"
              href="/api/auth/discord/login"
            >
              Connexion
            </a>
            <a
              href="http://discord.com"
              aria-label="Logo Discord"
              className="flex size-12 items-center justify-center rounded-full bg-[#5865F2]"
            >
              <Icon
                icon="radix-icons:discord-logo"
                width="30"
                height="30"
                color="var(--color-white)"
              />
            </a>
          </>
        )}
      </div>

      {/* Navbar pour téléphone */}
      <NavBar user={user} logout={logout}/>
    </header>
  );
}
