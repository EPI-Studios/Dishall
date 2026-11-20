export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import { Icon } from "@iconify/react";
import type { ServerType } from "@/@types/type";
import discordServerIcon from "@/util/discordImage";

export default function ServerCard({ server }: { server: ServerType }) {
  const countryCode = server.country?.trim().toLowerCase() ?? "eu";

  return (
    <Link href={`/serveurs/${server.uuid}`} className="block h-full">
      <article className="flex flex-col gap-3 rounded-xl lg:h-[200px] border-2 border-pink bg-dark px-3 py-5 shadow-[0_0_10px_var(--color-pink)] cursor-pointer">
        <div className="flex items-start gap-3">
          {server.icon ? (
            <Image
              src={discordServerIcon(server.guild_id, server.icon)} 
              width={50}
              height={50}
              alt={`Logo du serveur ${server.name}`}
              className="size-[50px] shrink-0 rounded-xl object-cover drop-shadow-[0_0_10px_var(--color-pink)]"
            />
          ) : (
            <Image
              src="/profil.png"
              width={50}
              height={50}
              alt="Logo par défaut"
              className="size-[50px] shrink-0 rounded-xl object-cover drop-shadow-[0_0_10px_var(--color-pink)]"
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <h4 className="truncate text-lg font-bold leading-tight lg:text-2xl" title={server.name}>
                  {server.name}
                </h4>
                <Icon
                  icon={`flag:${countryCode}-4x3`}
                  width={26}
                  height={20}
                  aria-label={`Drapeau : ${server.country}`}
                  className="shrink-0 rounded-sm"
                />
              </div>

              {server.reviewCount > 0 ? (
                <StarRating rating={server.rating} />
              ) : (
                <span className="shrink-0 text-xs">Pas encore d&apos;avis</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {server.tags.map((tag) => (
                  <span
                    className="rounded-xl border border-orange px-3 py-0.5 text-xs text-orange"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>

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
          <p className="line-clamp-3 lg:text-sm text-xs min-h-[3rem]">
            {server.description}
          </p>
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
