"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-30 m-6 flex items-center justify-between lg:absolute lg:inset-x-0 lg:top-0 lg:m-0 lg:px-10 lg:py-6">
      <div className="flex items-center">
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
          <Link className="hover:font-bold lg:text-2xl" href="/serveurs">
            Serveurs
          </Link>
          <Link className="hover:font-bold lg:text-2xl" href="/categories">
            Catégories
          </Link>
        </nav>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        className=" cursor-pointer lg:hidden"
      >
        <Icon
          icon={isOpen ? "radix-icons:cross-1" : "radix-icons:hamburger-menu"}
          width="50"
          height="50"
          color="var(--color-white)"
          className="lg:hidden"
          aria-label="Menu"
        />
      </button>

      {/* Menu déroulant (Mobile uniquement) */}
      {isOpen && (
  <nav
    id="mobile-menu"
    className="absolute inset-x-0 top-full z-40 mt-6 flex flex-col items-center gap-5 rounded-xl border-2 border-pink bg-dark/95 p-6 text-lg shadow-[0_0_15px_var(--color-pink)] backdrop-blur-sm lg:hidden"
  >
    <Link href="/serveurs" onClick={() => setIsOpen(false)}>
      Serveurs
    </Link>
    <Link href="/categories" onClick={() => setIsOpen(false)}>
      Catégories
    </Link>
    <Link
      href="/connexion"
      onClick={() => setIsOpen(false)}
    >
      Se connecter
    </Link>
  </nav>
)}

      <div className="hidden items-center gap-4 text-sm lg:flex">
        <a className="hover:font-bold lg:text-2xl" href="/connexion">
          Connexion
        </a>
        <a
          href="#"
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
      </div>
    </header>
  );
}
