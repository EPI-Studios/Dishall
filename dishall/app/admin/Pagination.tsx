import Link from "next/link";

type Props = {
  view: "servers" | "users";
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ view, currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null; // rien à paginer

  const href = (page: number) => `/admin?view=${view}&page=${page}`;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-6"
    >
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className="transition hover:text-pink">
          Précédent
        </Link>
      ) : (
        <span className="opacity-40" aria-disabled="true">
          Précédent
        </span>
      )}

      <span>
        Page {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className="transition hover:text-pink">
          Suivant
        </Link>
      ) : (
        <span className="opacity-40" aria-disabled="true">
          Suivant
        </span>
      )}
    </nav>
  );
}