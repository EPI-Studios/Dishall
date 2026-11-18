import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Icon } from "@iconify/react";
import { Metadata } from "next";
import { Suspense } from "react";
import ServersSection from "./ServersSection";
import ViewSelect from "./ViewSelect";
import UsersSection from "./UsersSection";
import ReviewsSection from "./ReviewsSection";

export const metadata: Metadata = {
  title: "DisHall | Administration",
};

type Props = {
  searchParams: Promise<{ view?: string; page?: string }>;
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
          <AdminContent searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

async function AdminContent({ searchParams }: Props) {
  const { view, page } = await searchParams;
  const currentView = view === "servers" || view ==="reviews" ? view : "users"; 
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <>
      <div className="mb-8 flex justify-center">
        <ViewSelect current={currentView} />
      </div>

      {currentView === "users" && <UsersSection page={currentPage} />}
      {currentView === "servers" && <ServersSection page={currentPage} />}
      {currentView === "reviews" && <ReviewsSection page={currentPage} />}
    </>
  );
}
