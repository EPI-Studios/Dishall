import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mb-4 grid grid-cols-3 items-center px-6 lg:px-10">
      <p className="text-xs">© 2026 - DisHall</p>
      <Link href="/mentions-legales" className="justify-self-center text-xs hover:font-bold">
        Mentions Légales
      </Link>
      <a
        href="https://discord.gg/"
        aria-label="Logo Discord"
        className="justify-self-end cursor-pointer"
      >
        <Icon
          icon="radix-icons:discord-logo"
          width={20}
          height={20}
          color="var(--color-white)"
        />
      </a>
    </footer>
  );
}
