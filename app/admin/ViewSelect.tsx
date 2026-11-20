"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

type View = "users" | "servers" | "reviews";

const OPTIONS: { value: View; label: string }[] = [
  { value: "users", label: "Utilisateurs" },
  { value: "servers", label: "Serveurs" },
  { value: "reviews", label: "Commentaires" },
];

export default function ViewSelect({ current }: { current: View }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [active, setActive] = useOptimistic(current);

  function select(view: View) {
    if (view === active) return;

    startTransition(() => {
      setActive(view); // la pastille glisse tout de suite
      router.push(`/admin?view=${view}`);
    });
  }

  return (
    <div
      role="tablist"
      className="relative grid grid-cols-3 rounded-xl border-2 border-pink p-1 text-base lg:text-xl"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-pink shadow-[0_0_10px_var(--color-pink)] transition-transform duration-300 ease-out ${
          active === "users"
            ? "translate-x-0"
            : active === "servers"
              ? "translate-x-full"
              : "translate-x-[200%]"
        }`}
      />

      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={active === value}
          onClick={() => select(value)}
          className={`relative z-10 px-4 py-2 transition-colors duration-300 text-sm lg:px-6 lg:text-xl ${
            active === value ? "font-bold text-white" : "opacity-70 hover:opacity-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}