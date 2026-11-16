import Image from "next/image";
import { Icon } from "@iconify/react";
import { UserType } from "@/@types/type";
import { useState } from "react";
import { handleUpdateUser } from "@/lib/getUser";

export default function UserSection({ user }: { user: UserType }) {
  
  const [userUpdate, setUserUpdate] = useState<UserType | null>(null);

  const handleAction = async (formData: FormData) => {
    if (!userUpdate) return;

    const pseudo = formData.get("pseudo") as string;

    try {
      await handleUpdateUser(userUpdate.discord_id, pseudo, userUpdate.avatar);

      setUserUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="relative mb-16 rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]">
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-6">
        <Image
          src={user.avatar}
          width={130}
          height={130}
          alt={`Image de profil de ${user.pseudo}`}
          className="size-20 shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)] lg:size-32"
          loading="eager"
        />

        <div className="flex min-w-0 items-center gap-4">
          <h4 className="min-w-0 truncate text-xl font-bold lg:text-3xl">
            {user.pseudo}
          </h4>
          <button
            aria-label="Modifier le profil"
            className="flex size-10 items-center justify-center rounded-full bg-pink lg:absolute lg:-right-5"
            onClick={() => setUserUpdate(user)}
          >
            <Icon
              icon="radix-icons:pencil-1"
              width="30"
              height="30"
              color="var(--color-white)"
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>

      {userUpdate && (
        <form
          action={handleAction}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 "
        >
          <div className="flex flex-col rounded-xl border-2 border-pink bg-dark p-6 text-center shadow-[0_0_10px_var(--color-pink)]">
            <div className="flex flex-col items-center justify-center mb-8">
              <label className="text-xl mb-4">Nom d&apos;utilisateur</label>
              <input
                name="pseudo"
                type="text"
                className="border text-center border-pink rounded-xl p-2"
                placeholder={user.pseudo}
              />
            </div>

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
                onClick={() => setUserUpdate(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
