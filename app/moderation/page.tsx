import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Icon } from "@iconify/react";
import { Metadata } from "next";
import { Suspense } from "react";
import ActionsSection from "./ActionsSection";

export const metadata: Metadata = {
  title: "DisHall | Modération",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  return (
    <>
      <Header />

      <main className="mx-6 lg:mx-auto lg:mt-32 lg:mb-24 lg:max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm transition hover:text-pink"
        >
          <Icon
            icon="radix-icons:arrow-left"
            width="20"
            height="20"
            aria-hidden="true"
          />
          Retour à l&apos;accueil
        </Link>

        <Suspense fallback={<p className="text-center">Chargement...</p>}>
          <ModContent searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

async function ModContent({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <>
      <div className="mb-8 flex justify-center">
        <ActionsSection page={currentPage} />
      </div>
    </>
  );
}
