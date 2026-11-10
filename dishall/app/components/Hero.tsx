import Header from "./Header";
import Link from "next/link";
import ServerSearchBar from "./ServerSearchBar";
import { getServers } from "@/lib/servers";

type HeroProps = {
  variant?: "home" | "search";
}

export default async function Hero({ variant = "search" }: HeroProps) {

  const servers = await getServers();

  if (variant === "home") {
    return (
      <div className="relative">
        <Header />

        <section className="relative mx-6 mb-8 h-[284px] w-auto overflow-hidden rounded-xl lg:mx-0 lg:mb-12 lg:h-[600px] lg:rounded-none">
          <div className="absolute inset-0 z-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 lg:opacity-100 lg:bg-top"></div>

          {/* Dégradé pour assombrir le fond*/}
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
              <h2 className="font-title text-2xl lg:text-5xl leading-normal tracking-[0.05em] lg:tracking-[0.1em]  drop-shadow-[0_0_10px_var(--color-pink)] mb-8">
                Trouve ton <br /> serveur Discord
              </h2>

              <p className="mt-4 text-sm lg:text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="mt-10 flex justify-evenly lg:mr-20 lg:mb-5 lg:gap-20">
              <Link
                href="/serveurs"
                className="flex h-[45px] w-[135px] items-center justify-center rounded-xl bg-orange text-center text-sm leading-tight tracking-[0.05em] text-[var(--color-dark)] hover:font-bold lg:h-[70px] lg:w-[200px] lg:text-xl"
              >
                Explorer les <br />
                serveurs
              </Link>
              <Link 
                className="lg:h-[70px] lg:w-[200px] h-[45px] w-[135px] lg:text-xl flex items-center justify-center rounded-xl border-2 border-pink bg-dark text-sm tracking-[0.05em] text-[var(--color-white)] shadow-[0_0_10px_var(--color-pink)] hover:font-bold"
                href="/api/auth/discord/guild/login"
              >
                Ajouter le mien
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <Header />

        <section className="relative mx-6 mb-8 h-[175px] w-auto lg:mx-0 lg:mb-12 lg:h-[600px]">
          {/* Fonds : c'est eux qui sont coupés aux coins arrondis */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-xl lg:rounded-none">
            <div className="absolute inset-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 lg:bg-top lg:opacity-100"></div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-dark via-dark/20 to-transparent"
            ></div>
          </div>

          <p
            aria-hidden="true"
            className="font-title glow-title absolute left-1/2 top-[30%] z-10 hidden -translate-x-1/2 -rotate-4 text-8xl lg:block"
          >
            DISHALL
          </p>

          <ServerSearchBar servers={servers}/>
        </section>
      </div>
    );
  }
}
