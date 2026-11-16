import { Suspense } from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ServerFilter from "../components/ServerFilter";
import { getServers } from "@/lib/servers/servers.server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DisHall | Serveurs",
};

async function ServersSection() {
  const servers = await getServers();
  return <ServerFilter servers={servers} />
}

export default async function Serveurs() {

  return (
    <>
      <Hero />

      <main className="mx-6 mb-8 lg:mx-auto lg:max-w-4xl">
        <div className="relative mb-8">
          <h3 className="font-title text-gradient-subtitle text-center text-lg uppercase tracking-[0.1em] lg:text-2xl">
            Tous les serveurs
          </h3>
          <Suspense fallback={<p>Chargement…</p>}>
            <ServersSection />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
