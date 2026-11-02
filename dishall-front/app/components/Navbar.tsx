"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-dark/95 text-2xl backdrop-blur-sm lg:hidden"
        >
          <Link
            href="/serveurs"
            onClick={() => setIsOpen(false)}
            className="text-center rounded-xl w-[90%] py-[40px] bg-pink-500/25"
          >
            Serveurs
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsOpen(false)}
            className="text-center rounded-xl w-[90%] py-[40px] bg-pink-500/25"
          >
            Catégories
          </Link>
          <Link
            href="/add"
            onClick={() => setIsOpen(false)}
            className="text-center rounded-xl w-[90%] py-[40px] bg-pink-500/25"
          >
            Ajouter votre serveur
          </Link>

          <Link
            href="/connexion"
            onClick={() => setIsOpen(false)}
            className="fixed text-dark text-center font-bold rounded-xl w-[90%] py-[20px] bg-pink inset-x-0 bottom-10 mx-auto"
          >
            Se connecter
          </Link>
        </nav>
      )}
    </>
  );
}
