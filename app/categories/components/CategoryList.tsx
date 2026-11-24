import { CategoryType } from "@/@types/type";
import CategoryCard from "./CategoryCard";

export default function CategoryList({ sorted }: { sorted: CategoryType[] }) {
  return (
    <>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sorted.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </section>

      {sorted.length === 0 && (
        <p className="text-center">
          Aucune catégorie ne correspond à votre recherche.
        </p>
      )}
    </>
  );
}
