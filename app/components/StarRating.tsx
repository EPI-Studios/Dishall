import { Icon } from "@iconify/react";

export default function StarRating({ rating, size = 13 }: { rating: number, size?: number }) {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div
      className="flex shrink-0 gap-0.5"
      role="img"
      aria-label={`Note : ${roundedRating} sur 5`}
    >
      {[...Array(5)].map((_, i) => {
        const fill = Math.min(Math.max(roundedRating - i, 0), 1);
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Icon
              icon="radix-icons:star-filled"
              width={size}
              height={size}
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
                width={size}
                height={size}
                color="var(--color-gold)"
                className="block"
                aria-hidden="true"
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
