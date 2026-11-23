"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

type View = "users" | "servers" | "reviews";

const OPTIONS: { value: View; label: string }[] = [
  { value: "users", label: "Utilisateurs" },
  { value: "servers", label: "Serveurs" },
  { value: "reviews", label: "Commentaires" },
];

export default function ViewSelect({
  current,
  views,
}: {
  current: View;
  views: View[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [active, setActive] = useOptimistic(current);

  const options = OPTIONS.filter((o) => views.includes(o.value));
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === active),
  );

  function select(view: View) {
    if (view === active) return;

    startTransition(() => {
      setActive(view); // la pastille glisse tout de suite
      router.push(`/moderation?view=${view}`);
    });
  }

  return (
    <div
      role="tablist"
      className="relative grid rounded-xl border-2 border-pink p-1"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-lg bg-pink shadow-[0_0_10px_var(--color-pink)] transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={active === value}
          onClick={() => select(value)}
          className={`relative z-10 whitespace-nowrap px-1 py-2.5 text-sm transition-colors duration-300 sm:px-4 lg:px-6 lg:text-xl ${
            active === value
              ? "font-bold text-dark"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
