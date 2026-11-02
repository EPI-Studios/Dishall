import ServerCard from "./components/ServerCard";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { Icon } from "@iconify/react";
import { servers } from "../data/servers";

let totalMembers = 0;
for (const server of servers) {
  totalMembers += server.members;
}

export default function Home() {
  return (
    <>
      <Hero variant="home"/>

      <main className="lg:mx-auto lg:max-w-4xl">
        <section className="mx-6 mb-8 lg:mb-12">
          <h3 className="lg:text-2xl font-title text-gradient-subtitle mb-2 text-center text-lg tracking-[0.1em] uppercase">
            Derniers serveurs ajoutés
          </h3>

          <div className="grid gap-4 lg:grid-cols-2">
            {servers.slice(1, 5).map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </section>

        <section className="mx-6 mb-8 lg:mb-12">
          <h3 className="lg:text-2xl font-title text-gradient-subtitle mb-2 text-center text-lg tracking-[0.1em] uppercase">
            Statistiques
          </h3>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-pink p-4 shadow-[0_0_10px_var(--color-pink)]">
              <Icon
                icon="radix-icons:server"
                width="50"
                height="50"
                color="var(--color-pink)"
                aria-hidden="true"
              />
              <p className="flex flex-col items-center leading-tight">
                <span className="text-2xl font-bold">{servers.length}</span> Serveurs
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-pink p-4 shadow-[0_0_10px_var(--color-pink)]">
              <Icon
                icon="radix-icons:people"
                width="50"
                height="50"
                color="var(--color-pink)"
                aria-hidden="true"
              />
              <p className="flex flex-col items-center leading-tight">
                <span className="text-2xl font-bold">{totalMembers}</span> Membres
              </p>
            </div>

            <div className="hidden items-center justify-center gap-3 rounded-xl border-2 border-pink p-4 lg:flex shadow-[0_0_10px_var(--color-pink)]">
              <Icon
                icon="radix-icons:rocket"
                width="50"
                height="50"
                color="var(--color-pink)"
                aria-hidden="true"
              />
              <p className="flex flex-col items-center text-center leading-tight">
                <span className="text-2xl font-bold">{servers.length}</span> Serveurs bumpés
              </p>
            </div>
          </div>
        </section>

        <section className="mx-6 mb-8 lg:mb-12 flex justify-center">
          <button className="group flex w-4/5 items-center justify-center gap-4 rounded-xl bg-(image:--gradient-bump-btn) p-6 lg:w-3/5 cursor-pointer hover:bg-none hover:bg-pink shadow-[0_0_10px_var(--color-pink)]">
            <Icon
              icon="radix-icons:rocket"
              width="70"
              height="70"
              color="var(--color-white)"
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-3 group-hover:-rotate-6"
            />
            <span className="font-title text-2xl transition-transform duration-200 group-hover:scale-110 ">Bump mon serveur</span>
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}
