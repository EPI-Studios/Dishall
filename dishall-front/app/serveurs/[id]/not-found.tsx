import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-6 py-20 text-center">
      <h1 className="font-title mb-4 text-2xl">Serveur introuvable</h1>
      <Link href="/serveurs" className="text-pink underline">
        Retour à la liste des serveurs
      </Link>
    </main>
  );
}