import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="mb-4 grid grid-cols-3 items-center px-6 lg:px-10">
      <p className="text-xs">© 2026 - DisHall</p>
      <a href="#" className="justify-self-center text-xs hover:font-bold">
        Mentions Légales
      </a>
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
