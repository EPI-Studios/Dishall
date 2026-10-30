import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { servers } from "../data/servers";
import ServerList from "../components/ServerList";

export default function Serveurs() {
  return (
    <>
      <Hero />

      <main className="mx-6 mb-8 lg:mx-auto lg:max-w-4xl">
        <ServerList servers={servers} />
      </main>

      <Footer />
    </>
  );
}
