import { getAllUsersForAdmin } from "@/lib/servers/servers.server";
import Image from "next/image";
import { redirect } from "next/navigation";
import Pagination from "./Pagination";

export default async function UsersSection({ page }: { page: number }) {
  const result = await getAllUsersForAdmin(page);
  if (!result) redirect("/");

  const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <>
    <h3 className="mb-8 font-title text-gradient-subtitle text-center text-lg uppercase tracking-[0.1em] lg:text-2xl">
      Utilisateurs
    </h3>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {result.users.map((user) => (
        <article
          key={user.discord_id}
          className="flex items-center gap-4 rounded-xl border-2 border-pink bg-dark p-4"
        >
          <Image
            src={user.avatar || DEFAULT_AVATAR } 
            width={64}
            height={64}
            alt={`Avatar de ${user.pseudo}`}
            className="size-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold">{user.pseudo}</h3>
            <p>{user.role}</p>
          </div>
        </article>
      ))}
    </div>

    <Pagination view="users" currentPage={page} totalPages={result.totalPages} />
    </>
  );
}