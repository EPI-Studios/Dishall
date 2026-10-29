import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Header() {
  return (
    <header className="m-6 flex items-center justify-between lg:absolute lg:inset-x-0 lg:top-0 lg:z-20 lg:m-0 lg:px-10 lg:py-6">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            width={60}
            height={65}
            alt="logo Dishall"
            loading="eager"
          />
        </Link>

        <h1 className="font-title text-gradient-title ml-4 text-4xl tracking-[0.05em] lg:sr-only">
          DISHALL
        </h1>

        <nav className="ml-8 hidden gap-8 text-sm lg:flex">
          <Link className="hover:font-bold" href="/serveurs">
            Serveurs
          </Link>
          <Link className="hover:font-bold" href="/categories">
            Catégories
          </Link>
        </nav>
      </div>

      <Icon
        icon="radix-icons:hamburger-menu"
        width="50"
        height="50"
        color="var(--color-white)"
        className="lg:hidden"
        aria-label="Menu"
      />

      <div className="hidden items-center gap-4 text-sm lg:flex">
        <a className="hover:font-bold" href="#">
          Connexion
        </a>
        <a
          href="#"
          aria-label="Logo Discord"
          className="flex size-10 items-center justify-center rounded-full bg-[#5865F2]"
        >
          <Icon
            icon="radix-icons:discord-logo"
            width="22"
            height="22"
            color="var(--color-white)"
          />
        </a>
      </div>
    </header>
  );
}
