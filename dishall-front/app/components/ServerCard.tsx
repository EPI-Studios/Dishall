import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import { Icon } from "@iconify/react";
import type { ServerType } from "@/@types/type";

export default function ServerCard({ server }: { server: ServerType }) {

  return (
    /* Changer server.id par uuid */
    <Link href={`/serveurs/${server.id}`} className="block h-full">
      <article className="flex flex-col gap-3 rounded-xl lg:h-[200px] border-2 border-pink bg-dark px-3 py-5 shadow-[0_0_10px_var(--color-pink)] cursor-pointer">
        <div className="flex items-start gap-3">
          <Image
            src={server.guild_picture}
            width={50}
            height={50}
            alt={`Logo du serveur ${server.name}`}
            className="size-[50px] shrink-0 rounded-xl object-cover drop-shadow-[0_0_10px_var(--color-pink)]"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <h4 className="truncate text-lg font-bold leading-none lg:text-2xl">
                  {server.name}
                </h4>
                <Icon
                  icon={`flag:${server.country}-4x3`}
                  width={26}
                  height={20}
                  aria-label={`Drapeau : ${server.country}`}
                  className="shrink-0 rounded-sm"
                />
              </div>

              <StarRating rating={server.rating} />
              
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
                <span className="lg:text-sm text-xs">{server.members}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-1 items-end justify-between gap-2">
          <p className="line-clamp-3 lg:text-sm text-xs min-h-[3rem]">{server.description}</p>
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
    </Link>
  );
}
