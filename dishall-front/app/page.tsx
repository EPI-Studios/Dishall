import Image from "next/image";
import { Icon } from "@iconify/react";

const rating = 4.2;
const roundedRating = Math.round(rating * 2) / 2;

export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between m-6">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            width={60}
            height={65}
            alt="logo Dishall"
            loading="eager"
          />
          <h1 className="font-title text-gradient-title text-4xl tracking-[0.05em] ml-4">
            DISHALL
          </h1>
        </div>
        <Icon
          icon="radix-icons:hamburger-menu"
          width="50"
          height="50"
          color="var(--color-white)"
        />
      </header>
      <main>
        <section className="mx-6 mb-8 h-[284px] rounded-[20px] w-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 z-0"></div>

          <div className="relative z-10 m-4">
            <h2 className="font-title text-3xl drop-shadow-[0_0_10px_var(--color-pink)] leading-normal tracking-[0.05em]">
              Trouve ton <br /> serveur Discord
            </h2>

            <p className=" mt-2 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="relative z-10 mt-10 flex justify-evenly">
            <button className="bg-orange rounded-[20px] text-sm text-[var(--color-dark)] h-[45px] w-[135px] tracking-[0.05em] leading-tight">
              Explorer les <br />
              serveurs
            </button>
            <button className="bg-dark border-2 border-pink rounded-[20px] text-sm text-[var(--color-white)] h-[45px] w-[135px] drop-shadow-[0_0_10px_var(--color-pink)] tracking-[0.05em]">
              Ajouter le mien
            </button>
          </div>
        </section>

        <section className="mx-6 mb-8">
          <h3 className="font-title text-gradient-subtitle text-center text-lg tracking-[0.1em] mb-2">
            Derniers serveurs ajoutés
          </h3>

          <article className="rounded-[20px] border-2 border-pink bg-dark px-3 py-5 drop-shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex items-start gap-3">
              <Image
                src="/profil.jpeg"
                width={50}
                height={50}
                alt="image de profil guilde"
                className="size-[50px] shrink-0 rounded-[20px] object-cover drop-shadow-[0_0_10px_var(--color-pink)]"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <h4 className="truncate font-bold leading-none text-lg">
                      Server Name #1
                    </h4>
                    <Image
                      src="/flag.png"
                      width={90}
                      height={60}
                      alt="Drapeau pays d'origine du serveur"
                      className="h-4 w-6 shrink-0 object-cover"
                    />
                  </div>

                  <div className="flex shrink-0 gap-0.5">
                    {[...Array(5)].map((_, i) => {
                      const fill = Math.min(Math.max(roundedRating - i, 0), 1);

                      return (
                        <span
                          key={i}
                          className="relative inline-block size-[13px]"
                        >
                          <Icon
                            icon="radix-icons:star-filled"
                            width="13"
                            height="13"
                            color="var(--color-white)"
                            className="block"
                          />

                          <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fill * 100}%` }}
                          >
                            <Icon
                              icon="radix-icons:star-filled"
                              width="13"
                              height="13"
                              color="var(--color-gold)"
                              className="block"
                            />
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange border border-orange rounded-[20px] py-0.5 px-3">
                    Tag
                  </span>

                  <div className="flex items-center gap-1">
                    <Icon
                      icon="radix-icons:person"
                      width="20"
                      height="20"
                      color="var(--color-white)"
                    />
                    <span className="text-xs">1000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <p className="line-clamp-3 text-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                fringilla, velit eget ullamcorper...
              </p>
              <Icon
                icon="radix-icons:chevron-right"
                width="20"
                height="20"
                color="var(--color-white)"
                className="shrink-0"
              />
            </div>
          </article>
        </section>

        <section className="mx-6 mb-8">
          <h3 className="font-title text-gradient-subtitle text-center text-lg tracking-[0.1em] mb-2">
            Statistiques
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <article className="flex items-center justify-center gap-3 border-2 border-pink rounded-[20px] p-4">
              <Icon
                icon="radix-icons:server"
                width="50"
                height="50"
                color="var(--color-pink)"
              />
              <p className="flex flex-col items-center leading-tight">
                <span className="font-bold text-2xl">100</span> Serveurs
              </p>
            </article>

            <article className="flex items-center justify-center gap-3 border-2 border-pink rounded-[20px] p-4">
              <Icon
                icon="radix-icons:people"
                width="50"
                height="50"
                color="var(--color-pink)"
              />
              <p className="flex flex-col items-center leading-tight">
                <span className="font-bold text-2xl">260</span> Membres
              </p>
            </article>
          </div>
        </section>

        <section className="mx-6 mb-8 flex justify-center">
          <button className="flex w-4/5 items-center justify-center bg-(image:--gradient-bump-btn) rounded-[20px] p-6 gap-4">
            <Image
              src="/rocket.png"
              width={70}
              height={80}
              alt="rocket bump"
              aria-hidden="true"
            />
            <span className="text-2xl font-title">Bump mon serveur</span>
          </button>
        </section>
      </main>

      <footer className="flex justify-around mb-4">
        <p className="text-xs">© 2026 - DisHall</p>
        <a className="text-xs">Mentions Légales</a>
        <Icon
          icon="radix-icons:discord-logo"
          width="20"
          height="20"
          color="var(--color-white)"
        />
      </footer>
    </>
  );
}
