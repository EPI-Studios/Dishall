import Link from "next/link";
import { Icon } from "@iconify/react";
import { CategoryType } from "../../@types/type";

export default function CategoryCard({ category }: { category: CategoryType }) {
  return (
    <Link href={`/categories?slug=${category.slug}`} className="block">
      <article className="border-2 border-pink rounded-xl p-4 shadow-[0_0_10px_var(--color-pink)]">
        <div className="flex items-start gap-4">
          <Icon
            icon={category.icon}
            width="100"
            height="100"
            aria-hidden="true"
            color="var(--color-pink)"
            className="shrink-0 drop-shadow-[0_0_8px_var(--color-pink)]"
          />
          <div>
            <h3 className="text-xl font-bold mb-5 text-shadow-[0_0_10px_var(--color-pink)]">
              {category.name}
            </h3>

            <p className="mt-2 text-sm">{category.description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Icon
                icon="lucide:server"
                width="16"
                height="16"
                aria-hidden="true"
              />
              {category.nb_server} serveurs
            </span>
            <span className="flex items-center gap-2">
              <Icon
                icon="lucide:users"
                width="16"
                height="16"
                aria-hidden="true"
              />
              {category.nb_user} membres
            </span>
          </div>
          <Icon
            icon="radix-icons:arrow-right"
            width="24"
            height="24"
            className="text-pink"
            aria-hidden="true"
          />
        </div>
      </article>
    </Link>
  );
}
