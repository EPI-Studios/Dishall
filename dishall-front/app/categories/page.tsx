import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { categories } from "../data/categories";
import CategoryList from "../components/CategoryList";

export default function Categories() {
  

  return (
    <>
      <Hero />

      <main className="lg:mx-auto lg:max-w-4xl mx-6 mb-8">
        <CategoryList categories={categories} />
      </main>

      <Footer />
    </>
  );
}
