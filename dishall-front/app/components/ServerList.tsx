import type { ServerType } from "@/@types/type";
import ServerCard from "./ServerCard";

export default function ServerList({ sorted }: { sorted: ServerType[] }) {

  return (
    <>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sorted.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </section>
    </>
  );
}
