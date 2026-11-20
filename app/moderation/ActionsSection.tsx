import { getAllModAction } from "@/lib/mod_actions/mod_action.server";
import { redirect } from "next/navigation";
import Pagination from "../admin/Pagination";
import ModActionCase from "./ModActionCase";

export default async function ActionsSection({ page }: { page: number }) {

  const result = await getAllModAction(page);

  if (!result) redirect("/");

  const { actions, totalPages } = result;

  if (page > totalPages) redirect(`/moderation?page=${totalPages}`);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {actions.map((action) => (
          <ModActionCase key={action.uuid} action={action} />
        ))}
      </div>

      <Pagination view="servers" currentPage={page} totalPages={totalPages} />
    </>
  );
}
