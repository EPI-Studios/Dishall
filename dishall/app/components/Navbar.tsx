"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { UserType } from "@/@types/type";
import Image from "next/image";

type NavBarProps = {
  user: UserType | null;
  logout: () => void;
};

export default function NavBar({ user, logout }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleLogout() {
    setIsOpen(false);
    await logout();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        className=" cursor-pointer z-60 lg:hidden"
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
          className="fixed inset-0 z-40 flex flex-col items-center mt-8 justify-center gap-6 bg-dark/95 text-2xl backdrop-blur-sm lg:hidden"
        >
          {user && (
            <div className="flex justify-center items-center gap-8 rounded-xl w-[90%] py-[30px] bg-pink-500/20">
              <Image
                src={user.avatar}
                width={48}
                height={48}
                alt={`Avatar de ${user.pseudo}`}
                className="size-12 rounded-full object-cover"
              />
              <Link className="hover:font-bold lg:text-xl" onClick={() => setIsOpen(false)} href="/profil">
                Mon Profil
              </Link>
            </div>
          )}
          <Link
            href="/serveurs"
            onClick={() => setIsOpen(false)}
            className="text-center rounded-xl w-[90%] py-[30px] bg-pink-500/15"
          >
            Serveurs
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsOpen(false)}
            className="text-center rounded-xl w-[90%] py-[30px] bg-pink-500/10"
          >
            Catégories
          </Link>
          <Link
            href="/add"
            onClick={() => setIsOpen(false)}
            className="text-center rounded-xl w-[90%] py-[30px] bg-pink-500/5"
          >
            Ajouter votre serveur
          </Link>

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-dark text-center font-bold rounded-xl w-[90%] py-[20px] bg-pink inset-x-0 bottom-20 mx-auto"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/api/auth/discord/login"
              onClick={() => setIsOpen(false)}
              className="text-dark text-center font-bold rounded-xl w-[90%] py-[20px] bg-pink inset-x-0 bottom-20 mx-auto"
            >
              Se connecter
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
