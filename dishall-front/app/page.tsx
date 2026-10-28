import Image from "next/image";
import { Icon } from "@iconify/react";

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
          <h1 className="font-title text-gradient-title text-[3.5rem] tracking-[0.05em] ml-4">
            Dishall
          </h1>
        </div>
        <Icon
          icon="radix-icons:hamburger-menu"
          width="50"
          height="50"
          color="var(--color-white)"
        />
      </header>

      <section className="mx-6 h-[284px] rounded-[20px] w-auto overflow-hidden relative">
        <div className="absolute inset-0 bg-[url(/hero-background.jpg)] bg-cover bg-center opacity-70 z-0"></div>

        <div className="relative z-10 m-4">
          <h2 className="font-title text-[2.5rem] drop-shadow-[0_0_10px_var(--color-pink)] leading-none tracking-[0.05em]">
            Trouve ton <br /> serveur Discord
          </h2>

          <p className=" mt-2 text-[0.9rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="relative z-10 mt-10 flex justify-evenly">
          <button className="bg-orange rounded-[20px] text-[0.8rem] text-[var(--color-dark)] h-[45px] w-[135px] tracking-[0.05em]">
            Explorer les <br />
            serveurs
          </button>
          <button className="bg-dark border-2 border-pink rounded-[20px] text-[0.8rem] text-[var(--color-white)] h-[45px] w-[135px] drop-shadow-[0_0_10px_var(--color-pink)] tracking-[0.05em]">
            Ajouter le mien
          </button>
        </div>
      </section>

      <section className="my-8 mx-6">
        <h3 className="font-title text-gradient-subtitle text-center text-[1.5rem] tracking-[0.1em]">
          Dernier serveur ajouté
        </h3>
        <div className="flex h-[140px] items-start gap-3 rounded-[20px] border-2 border-pink bg-dark p-3 drop-shadow-[0_0_10px_var(--color-pink)]">
          <Image
            src="/profil.jpeg"
            width={50}
            height={50}
            alt="image de profil guilde"
            className="h-11 w-15 rounded-[20px] object-cover drop-shadow-[0_0_10px_var(--color-pink)]"
          />
          <div className="flex flex-1 items-center gap-2">
            <h4 className="font-bold leading-none text-[1.1rem]">
              Server Name #1
            </h4>
            <div className="flex items-center gap-2">
              <Image
                src="/flag.png"
                width={90}
                height={60}
                alt="Drapeau pays d'origine du serveur"
                className="h-4 w-6 object-cover mr-3"
              />
              <div className="ml-auto flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon="ic:round-star"
                    width="13"
                    height="13"
                    color="var(--color-white)"
                  />
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}
