"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect, useState, type ReactNode } from "react";
import { UserType } from "@/@types/type";

type NavBarProps = {
  user: UserType | null;
  logout: () => void;
};

type MenuLinkProps = {
  href: string;
  icon: string;
  children: ReactNode;
  onNavigate: () => void;
};

// Une rangée du menu : icône, texte, flèche. Toute la rangée est cliquable (≥ 56px de haut)
function MenuLink({ href, icon, children, onNavigate }: MenuLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-4 rounded-xl border border-pink/40 bg-white/5 px-5 py-4 text-lg transition-colors active:bg-pink/20"
    >
      <Icon icon={icon} width="24" height="24" className="shrink-0 text-pink" />
      <span className="flex-1">{children}</span>
      <Icon
        icon="radix-icons:chevron-right"
        width="20"
        height="20"
        className="opacity-50"
      />
    </Link>
  );
}

export default function NavBar({ user, logout }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isStaff = user?.role === "admin" || user?.role === "moderator";
  const close = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    // Échap ferme le menu (clavier, tablettes avec clavier)
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  async function handleLogout() {
    close();
    await logout();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        // relative : sans position, z-index est ignoré et le menu recouvrirait le bouton
        className="relative z-60 cursor-pointer lg:hidden"
      >
        <Icon
          icon={isOpen ? "radix-icons:cross-1" : "radix-icons:hamburger-menu"}
          width="50"
          height="50"
          color="var(--color-white)"
        />
      </button>

      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Menu principal"
          className="fixed inset-0 z-40 flex flex-col gap-6 overflow-y-auto bg-dark/95 px-5 pb-8 pt-24 backdrop-blur-sm lg:hidden mt-8"
        >

          {user && (
            <Link
              href="/dashboard"
              onClick={close}
              className="flex items-center gap-4 rounded-2xl border-2 border-pink bg-pink/10 p-4 shadow-[0_0_10px_var(--color-pink)]"
            >
              <Image
                src={user.avatar}
                width={56}
                height={56}
                alt={`Avatar de ${user.pseudo}`}
                className="size-14 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold">{user.pseudo}</p>
                <p className="text-sm opacity-70">Mon tableau de bord</p>
              </div>
              <Icon
                icon="radix-icons:chevron-right"
                width="24"
                height="24"
                className="shrink-0 opacity-70"
              />
            </Link>
          )}

          <div className="flex flex-col gap-3">
            <MenuLink href="/serveurs" icon="radix-icons:grid" onNavigate={close}>
              Serveurs
            </MenuLink>
            <MenuLink
              href="/categories"
              icon="radix-icons:layers"
              onNavigate={close}
            >
              Catégories
            </MenuLink>
          </div>

          {isStaff && (
            <div className="flex flex-col gap-3">
              <p className="px-1 text-sm uppercase tracking-wider opacity-60">
                Équipe
              </p>
              <MenuLink
                href="/moderation"
                icon="radix-icons:lock-closed"
                onNavigate={close}
              >
                Modération
              </MenuLink>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-4">
            {/* <a> et non <Link> : ce sont des routes API, un préchargement ne doit pas les appeler */}
            <a
              href={
                user
                  ? "/api/auth/discord/guild/login"
                  : "/api/auth/discord/login"
              }
              onClick={close}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-pink py-4 text-lg font-bold"
            >
              <Icon icon="radix-icons:plus-circled" width="22" height="22" />
              Ajouter votre serveur
            </a>

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl bg-pink py-4 text-lg font-bold text-dark"
              >
                <Icon icon="radix-icons:exit" width="22" height="22" />
                Déconnexion
              </button>
            ) : (
              <a
                href="/api/auth/discord/login"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-xl bg-pink py-4 text-lg font-bold text-dark"
              >
                <Icon icon="radix-icons:enter" width="22" height="22" />
                Se connecter
              </a>
            )}
          </div>
        </nav>
      )}
    </>
  );
}