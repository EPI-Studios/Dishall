import type { ReviewType } from "@/@types/type";
import ReviewCard from "./ReviewCard";

export default function LatestReviews({ reviews }: { reviews: ReviewType[] }) {
  // Les plus récents d'abord, 4 maximum. [...reviews] : sort() modifie sinon le tableau d'origine
  const latest = [...reviews]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 4);

  return (
    <section className="mb-8 rounded-xl border-2 border-pink bg-dark p-5 shadow-[0_0_10px_var(--color-pink)]">
      <h2 className="font-title text-gradient-subtitle mb-6 text-center text-2xl uppercase tracking-[0.1em]">
        Derniers avis
      </h2>

      {latest.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {latest.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-center">Aucun avis pour le moment. Sois le premier !</p>
      )}
    </section>
  );
}