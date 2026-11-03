import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { categories } from "../../data/categories";
import CategoryFilter from "../components/CategoryFilter";

export default function Categories() {

  return (
    <>
      <Hero />

      <main className="lg:mx-auto lg:max-w-4xl mx-6 mb-8">
        <h3 className="lg:text-2xl font-title text-gradient-subtitle text-center text-lg tracking-[0.1em] uppercase mb-8">
          Toutes les catégories
        </h3>

        <CategoryFilter categories={categories} />
      </main>

      <Footer />
    </>
  );
}