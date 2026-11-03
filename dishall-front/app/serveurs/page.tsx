import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ServerFilter from "../components/ServerFilter";
import { servers } from "../../data/servers";

export default function Serveurs() {
  return (
    <>
      <Hero />

      <main className="mx-6 mb-8 lg:mx-auto lg:max-w-4xl">
        <div className="relative mb-8">
          <h3 className="font-title text-gradient-subtitle text-center text-lg uppercase tracking-[0.1em] lg:text-2xl">
            Tous les serveurs
          </h3>

          <ServerFilter servers={servers} />
        </div>
      </main>

      <Footer />
    </>
  );
}
