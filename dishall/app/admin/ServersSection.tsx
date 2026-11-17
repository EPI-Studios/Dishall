import Image from "next/image";
import discordServerIcon from "@/util/discordImage";
import { getAllServersForAdmin } from "@/lib/servers/servers.server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Pagination from "./Pagination";

export default async function ServersSection({ page }: { page: number }) {
  const result = await getAllServersForAdmin(page);

  if (!result) redirect("/");

  const { servers, totalPages } = result;

  if (page > totalPages) redirect(`/admin?view=servers&page=${totalPages}`);

  return (
    <>
      <h3 className="mb-8 font-title text-gradient-subtitle text-center text-lg uppercase tracking-[0.1em] lg:text-2xl">
        Serveurs
      </h3>
      <div className="grid gap-8 lg:grid-cols-2">
        {servers.map((server) => {
          let emoji = "❓";
          if (server.status === "approved") {
            emoji = "✅";
          } else if (server.status === "pending") {
            emoji = "⌛";
          } else if (server.status === "rejected") {
            emoji = "🚫";
          }
          
          return (
            <article
              key={server.uuid}
              className="rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]"
            >
              <Link href={`/serveurs/${server.uuid}`} className="block h-full">
                <div className="flex items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-6">
                  <Image
                    src={discordServerIcon(server.guild_id, server.icon)}
                    width={130}
                    height={130}
                    alt={`Logo du serveur ${server.name}`}
                    className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)] lg:size-32"
                  />

                  <div>
                    <h3
                      className="min-w-0 text-xl line-clamp-1 font-bold lg:text-xl"
                      title={server.name}
                    >
                      {server.name}
                    </h3>
                    <p>
                      {emoji} {server.status}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <Pagination view="servers" currentPage={page} totalPages={totalPages} />
    </>
  );
}
