"use client";

import type { ReviewType } from "@/@types/type";
import StarRating from "./StarRating";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ReviewSummary({ reviews }: { reviews: ReviewType[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState(1);

  const total = reviews.length;
  const average = total
    ? reviews.reduce((sum, r) => sum + r.rate, 0) / total
    : 0;

  // [{ stars: 5, count: 1 }, { stars: 4, count: 2 }, ...]
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rate === stars).length,
  }));

  return (
    <section className="mb-8 rounded-xl border-2 border-pink bg-dark p-5 shadow-[0_0_10px_var(--color-pink)]">
      <h2 className="font-title text-gradient-subtitle mb-6 text-center text-2xl uppercase tracking-[0.1em]">
        Avis
      </h2>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-16">
        {/* Note moyenne */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-3xl font-bold">
            {average.toFixed(1).replace(".", ",")}
          </p>
          <StarRating rating={average} size={28} />
          <p className="text-sm">{total} avis</p>
        </div>

        {/* Répartition */}
        <ul className="flex w-full max-w-xs flex-col gap-2">
          {distribution.map(({ stars, count }) => (
            <li
              key={stars}
              className="flex items-center gap-3 text-sm"
              aria-label={`${stars} étoiles : ${count} avis`}
            >
              <span aria-hidden="true" className="w-8 shrink-0">
                {stars} ★
              </span>
              <div
                aria-hidden="true"
                className="h-3 flex-1 overflow-hidden rounded-full border border-pink"
              >
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
                />
              </div>
              <span aria-hidden="true" className="w-6 shrink-0">
                {count > 0 ? count : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-center">
        {/* À brancher plus tard : formulaire d'avis réservé aux utilisateurs connectés */}
        <button
          type="button"
          className="cursor-pointer rounded-xl bg-(image:--gradient-bump-btn) px-8 py-3 text-lg font-bold shadow-[0_0_10px_var(--color-pink)] transition hover:brightness-125"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={
            isOpen
              ? "Fermer l'ajout de commentaire'"
              : "Ouvrir l'ajout de commentaire"
          }
        >
          Donner mon avis
        </button>

        {isOpen && (
          <section className="fixed inset-0 z-50 rounded-xl shadow-[0_0_10px_var(--color-pink)] m-auto z-40 flex flex-col items-center justify-center gap-10 bg-dark/95 text-2xl backdrop-blur-md overflow-hidden">
            <div className="flex items-center justify-between gap-20">
              <h3 className="font-title text-xl text-gradient-subtitle text-center text-2xl uppercase tracking-[0.1em]">
                Ajouter votre avis
              </h3>
              <Icon
                      icon="radix-icons:cross-1"
                      width="50"
                      height="50"
                      color="var(--color-white)"
                      aria-label="Menu"
                      onClick={() => setIsOpen(!isOpen)}
                      className="cursor-pointer"
                    />
              </div>
            <form className="rounded-xl shadow-[0_0_10px_var(--color-pink) h-[50%] w-[50%] flex flex-col gap-10">
              <div className="flex gap-5 items-center">
                <label>Pseudo</label>
                <input type="text" name="pseudo" className="border border-pink rounded-xl p-5 text-lg"/>
              </div>
              <div className="flex gap-5 items-center">
                <label>Note</label>
                <input type="range" name="rate" min={1} max={5} step={0.1} value={range} onChange={(e) => setRange(Number(e.target.value))} className="border border-pink rounded-xl p-5"/>
                <p>{range}</p>
              </div>
              <div className="flex gap-5 items-center">
                <label>Commentaire</label>
                <textarea className="border border-pink rounded-xl p-5 text-lg w-[100%]"/>
              </div>

              <button>Valider</button>
            </form>
          </section>
        )}
      </div>
    </section>
  );
}
