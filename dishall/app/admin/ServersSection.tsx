import { getAllServersForAdmin } from "@/lib/servers/servers.server";
import { redirect } from "next/navigation";
import Pagination from "./Pagination";
import ServerCase from "./ServerCase";

export default async function ServersSection({ page }: { page: number }) {

  const result = await getAllServersForAdmin(page);

  if (!result) redirect("/");

  const { servers, totalPages } = result;

  if (page > totalPages) redirect(`/admin?view=servers&page=${totalPages}`);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {servers.map((server) => (
          <ServerCase key={server.uuid} server={server} />
        ))}
      </div>

      <Pagination view="servers" currentPage={page} totalPages={totalPages} />
    </>
  );
}
