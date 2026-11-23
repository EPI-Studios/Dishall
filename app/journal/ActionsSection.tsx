import { getAllModAction } from "@/lib/mod_actions/mod_action.server";
import { redirect } from "next/navigation";
import ModActionCase from "./ModActionCase";

export default async function ActionsSection() {

  const result = await getAllModAction();

  if (!result) redirect("/");

  const { actions } = result;

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {actions.map((action) => (
          <ModActionCase key={action.uuid} action={action} />
        ))}
      </div>

    </>
  );
}
