import Image from "next/image";
import StarRating from "./StarRating";
import type { ReviewType } from "@/@types/type";

export default function ReviewCard({ review }: { review: ReviewType }) {
  // timeZone "UTC" : évite qu'une date ISO sans heure ne glisse d'un jour
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(review.date));

  return (
    <article className="rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]">
      <div className="flex items-start gap-3">
        <Image
          src={review.avatar}
          width={50}
          height={50}
          alt=""
          aria-hidden="true"
          className="size-[50px] shrink-0 rounded-xl object-cover shadow-[0_0_10px_var(--color-pink)]"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-bold">{review.username}</p>
            <time dateTime={review.date} className="shrink-0 text-sm">
              {formattedDate}
            </time>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
    </article>
  );
}