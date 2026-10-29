"use client";

import Header from "./Header";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function Hero() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <div className="relative">
        <Header />

        <section className="relative mx-6 mb-8 h-[284px] w-auto overflow-hidden rounded-xl lg:mx-0 lg:mb-12 lg:h-[600px] lg:rounded-none">
          <div className="absolute inset-0 z-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 lg: opacity-100 lg:bg-top"></div>

          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-linear-to-t from-dark via-dark/20 to-transparent"
          ></div>

          <p
            aria-hidden="true"
            className="font-title glow-title absolute left-1/2 top-[30%] z-10 hidden -translate-x-1/2 text-8xl lg:block -rotate-4"
          >
            DISHALL
          </p>

          <div className="relative z-10 p-4 lg:flex lg:h-full lg:items-end lg:justify-between lg:px-10 lg:pb-8">
            <div>
              <h2 className="font-title text-2xl lg:text-4xl leading-normal tracking-[0.05em] lg:tracking-[0.1em]  drop-shadow-[0_0_10px_var(--color-pink)] mb-8">
                Trouve ton <br /> serveur Discord
              </h2>

              <p className="mt-4 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="mt-10 flex justify-evenly lg:mr-20 lg: mb-5 lg:gap-20">
              <button className="lg:h-[70px] lg:w-[200px] h-[45px] w-[135px] lg:text-xl rounded-xl bg-orange text-sm leading-tight tracking-[0.05em] text-[var(--color-dark)] hover:font-bold">
                Explorer les <br />
                serveurs
              </button>
              <button className="lg:h-[70px] lg:w-[200px] h-[45px] w-[135px] lg:text-xl rounded-xl border-2 border-pink bg-dark text-sm tracking-[0.05em] text-[var(--color-white)] shadow-[0_0_10px_var(--color-pink)] hover:font-bold">
                Ajouter le mien
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <Header />

        <section className="relative mx-6 mb-8 h-[175px] w-auto overflow-hidden rounded-xl lg:mx-0 lg:mb-12 lg:h-[600px] lg:rounded-none">
          <div className="absolute inset-0 z-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 lg:opacity-100 lg:bg-top"></div>

          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-linear-to-t from-dark via-dark/20 to-transparent"
          ></div>

          <p
            aria-hidden="true"
            className="font-title glow-title absolute left-1/2 top-[30%] z-10 hidden -translate-x-1/2 text-8xl lg:block -rotate-4"
          >
            DISHALL
          </p>

          <div className="relative z-10 flex h-full items-center justify-center p-4 lg:items-end lg:pb-32">
            <form className="flex w-full items-center justify-center">
              <div className="flex w-full max-w-2xl items-center gap-4 rounded-xl bg-pink px-8 py-2 text-dark shadow-[0_0_30px_var(--color-pink)]">
                <Icon
                  icon="radix-icons:magnifying-glass"
                  width="28"
                  height="28"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="server"
                  aria-label="Rechercher un serveur"
                  placeholder="Rechercher un serveur"
                  className="flex-1 bg-transparent outline-none placeholder:text-dark"
                />
                <button
                  type="submit"
                  aria-label="Lancer la recherche"
                  className="cursor-pointer"
                >
                  <Icon
                    icon="radix-icons:arrow-right"
                    width="28"
                    height="28"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}
