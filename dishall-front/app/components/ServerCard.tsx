import Image from "next/image";
import { Icon } from "@iconify/react";
import type { ServerType } from "@/app/@types/type";

export default function ServerCard({ server }: { server: ServerType }) {

  const roundedRating = Math.round(server.rating * 2) / 2;

  return (
    <article className="rounded-xl border-2 border-pink bg-dark px-3 py-5 shadow-[0_0_10px_var(--color-pink)] cursor-pointer">
      <div className="flex items-start gap-3">
        <Image
          src="/profil.jpeg"
          width={50}
          height={50}
          alt="image de profil guilde"
          className="size-[50px] shrink-0 rounded-xl object-cover drop-shadow-[0_0_10px_var(--color-pink)]"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <h4 className="truncate text-lg font-bold leading-none">
                {server.name}
              </h4>
              <Image
                src="/flag.png"
                width={90}
                height={60}
                alt="Drapeau pays d'origine du serveur"
                className="h-4 w-6 shrink-0 object-cover"
              />
            </div>

            <div
      className="flex shrink-0 gap-0.5"
      role="img"
      aria-label={`Note : ${roundedRating} sur 5`}
    >
      {[...Array(5)].map((_, i) => {
        
        const fill = Math.min(Math.max(roundedRating - i, 0), 1);

        return (
          <span key={i} className="relative inline-block size-[13px]">
            <Icon
              icon="radix-icons:star-filled"
              width="13"
              height="13"
              color="var(--color-white)"
              className="block"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Icon
                icon="radix-icons:star-filled"
                width="13"
                height="13"
                color="var(--color-gold)"
                className="block"
                aria-hidden="true"
              />
            </span>
          </span>
        );
      })}
    </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="rounded-xl border border-orange px-3 py-0.5 text-xs text-orange">
              {server.tag}
            </span>

            <div className="flex items-center gap-1">
              <Icon
                icon="radix-icons:person"
                width="20"
                height="20"
                color="var(--color-white)"
                aria-hidden="true"
              />
              <span className="text-xs">{server.members}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="line-clamp-3 text-xs">{server.description}</p>
        <Icon
          icon="radix-icons:chevron-right"
          width="20"
          height="20"
          color="var(--color-white)"
          className="shrink-0"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
