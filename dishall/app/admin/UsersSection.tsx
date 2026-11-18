import { getAllUsersForAdmin } from "@/lib/users/users.server";
import { redirect } from "next/navigation";
import Pagination from "./Pagination";
import UserCase from "./UserCase";

export default async function UsersSection({ page }: { page: number }) {
  const result = await getAllUsersForAdmin(page);
  if (!result) redirect("/");

  const { users, totalPages } = result;

  if (page > totalPages) redirect(`/admin?view=users&page=${totalPages}`);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {users.map((user) => (
          <UserCase key={user.discord_id} user={user} />
        ))}
      </div>

      <Pagination
        view="users"
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  );
}
