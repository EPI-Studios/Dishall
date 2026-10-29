import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="mb-4 flex items-center justify-between px-6 lg:px-10">
      <p className="text-xs">© 2026 - DisHall</p>
      <a href="#" className="text-xs hover:font-bold">
        Mentions Légales
      </a>
      <Icon
        icon="radix-icons:discord-logo"
        width="20"
        height="20"
        color="var(--color-white)"
        aria-label="Logo Discord"
        className="cursor-pointer"
      />
    </footer>
  );
}
