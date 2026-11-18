"use client";

import { UserType, RoleType } from "@/@types/type";
import { handleDeleteUser, handleUpdateUserRole } from "@/lib/users/users.client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserCase({ user }: { user: UserType }) {
  const router = useRouter();
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [userToUpdate, setUserToUpdate] = useState<UserType | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

  const isAdmin = user.role === "admin";
  const infoHoverClass = isAdmin
    ? ""
    : "lg:pointer-events-none lg:select-none lg:transition-opacity lg:duration-200 lg:group-hover:opacity-0 lg:group-focus-within:opacity-0";

  function closeModal() {
    setUserToDelete(null);
    setDeleteError(null);
    setUserToUpdate(null);
    setUpdateError(null);
  }

  async function confirmDelete() {
    if (!userToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await handleDeleteUser(userToDelete.discord_id);
      closeModal();
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "La suppression a échoué",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAction = async (formData: FormData) => {
      if (!userToUpdate) return;
  
      const role = formData.get("role") as RoleType;

      if (role !== "member" && role !== "moderator") {
        setUpdateError("Choisis un rôle");
        return;
      }
  
      try {
        await handleUpdateUserRole(userToUpdate.discord_id, role);
        setUserToUpdate(null);
        setUpdateError(null);
        router.refresh();
      } catch (error) {
        setUpdateError(error instanceof Error ? error.message : "La modification a échoué")
      }
    }; 

  return (
    <>
      <article className="group flex items-center gap-4 rounded-xl border-2 border-pink bg-dark p-4">
        <Image
          src={user.avatar || DEFAULT_AVATAR}
          width={64}
          height={64}
          alt={`Avatar de ${user.pseudo}`}
          className="size-16 rounded-full object-cover"
        />

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 lg:grid">
          <div
            className={`min-w-0 lg:col-start-1 lg:row-start-1 ${infoHoverClass}`}
          >
            <h3 className="line-clamp-1 font-bold">{user.pseudo}</h3>
            <p>{user.role}</p>
          </div>
          {user.role !== "admin" && (
            <div className="flex items-center gap-4 lg:pointer-events-none lg:col-start-1 lg:row-start-1 lg:justify-center lg:opacity-0 lg:transition-opacity lg:duration-200 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100">
              <button
                type="button"
                aria-label={`Modifier ${user.pseudo}`}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-pink"
                onClick={() => setUserToUpdate(user)}
              >
                <Icon
                  icon="radix-icons:pencil-1"
                  width="24"
                  height="24"
                  color="var(--color-white)"
                />
              </button>
              <button
                type="button"
                aria-label={`Supprimer ${user.pseudo}`}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-pink"
                onClick={() => setUserToDelete(user)}
              >
                <Icon
                  icon="radix-icons:trash"
                  width="24"
                  height="24"
                  color="var(--color-white)"
                />
              </button>
            </div>
          )}
        </div>
      </article>

      {userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-lg">
              Supprimer l&apos;utilisateur{" "}
              <span className="font-bold">{userToDelete.pseudo}</span> ? Cette
              action est irréversible.
            </p>

            {deleteError && (
              <p role="alert" className="mb-6 text-red-400">
                {deleteError}
              </p>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-xl border-2 border-pink bg-pink px-4 py-2 font-bold text-[var(--color-white)]"
                onClick={confirmDelete}
              >
                {isDeleting ? "Suppression..." : "Oui, supprimer"}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-xl border-2 border-pink px-4 py-2 text-[var(--color-white)]"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {userToUpdate && (
        <form
          action={handleAction}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 "
        >
          <div className="flex flex-col rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex flex-col items-center justify-center mb-8">
              <label className="text-xl mb-4">Rôle</label>
              <select
                name="role"
                defaultValue={userToUpdate.role}
                className="border text-center border-pink rounded-xl p-2"
                required
              >
                <option value="">Choisis un rôle</option>
                <option value="member">Membre</option>
                <option value="moderator">Modérateur</option>
              </select>
            </div>

            {updateError && (
              <p role="alert" className="mb-6 text-red-400">
                {updateError}
              </p>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="rounded-xl border-2 border-pink bg-pink px-4 py-2 font-bold text-[var(--color-white)]"
              >
                Valider
              </button>
              <button
                type="button"
                className="rounded-xl border-2 border-pink px-4 py-2 text-[var(--color-white)]"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
