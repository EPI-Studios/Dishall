import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales - Dishall",
  description: "Mentions légales et politique de confidentialité de Dishall.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-2xl font-bold text-pink">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-10 text-4xl font-bold">Mentions légales</h1>

      <Section title="Éditeur du site">
        <p>
          Le site Dishall est édité par <strong>EPI Studio</strong>
          [, micro-entreprise immatriculée sous le numéro SIRET [XXX XXX XXX XXXXX]].
        </p>
        <p>Adresse : [adresse postale]</p>
        <p>Email : [adresse de contact]</p>
        <p>Directeur de la publication : [Nom Prénom]</p>
      </Section>

      <Section title="Hébergement">
        <p>
          Le site est hébergé par <strong>[Nom de l&apo;hébergeur]</strong>, [adresse de l&apo;hébergeur],
          [site web de l&apo;hébergeur].
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          Le code, la charte graphique et les textes propres à Dishall sont la propriété de
          l&apo;éditeur. Les noms, logos et images des serveurs Discord présentés restent la
          propriété de leurs propriétaires respectifs.
        </p>
        <p>
          Dishall est un service indépendant, non affilié à Discord Inc. « Discord » est une
          marque de Discord Inc.
        </p>
      </Section>

      <Section title="Données personnelles">
        <p>
          Lorsque tu te connectes avec Discord, nous enregistrons les informations suivantes :
          ton identifiant Discord, ton pseudo, ton avatar [et ton adresse email]. Si tu importes
          tes serveurs, nous récupérons la liste des serveurs que tu administres afin de pouvoir
          les ajouter à l&apo;annuaire.
        </p>
        <p>
          Ces données servent uniquement à faire fonctionner le service : connexion, gestion de
          tes serveurs, publication de tes avis et modération. Elles ne sont ni vendues ni
          transmises à des tiers. Les avis que tu publies affichent ton pseudo et ton avatar.
        </p>
        <p>
          Les actions de modération (changements de statut, de rôle, suppressions) sont conservées
          dans un journal interne.
        </p>
        <p>
          Base légale : exécution du service que tu as demandé (connexion et utilisation du site).
          Durée de conservation : tant que ton compte existe ; [à préciser, par exemple
          suppression sur demande].
        </p>
        <p>
          Conformément au RGPD, tu disposes d&apo;un droit d&apo;accès, de rectification, d&apo;effacement,
          d&apo;opposition et de portabilité de tes données. Pour l&apo;exercer, écris à
          [adresse de contact]. Tu peux aussi introduire une réclamation auprès de la{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            CNIL
          </a>
          .
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Dishall utilise un seul cookie, nommé <code>token</code>. Il contient ta session de
          connexion, est indispensable au fonctionnement du site et expire au bout de 7 jours. Il
          n&apo;est utilisé ni pour de la publicité ni pour du suivi, c&apo;est pourquoi aucun bandeau de
          consentement n&apo;est affiché.
        </p>
        <p>[Si tu ajoutes un outil de mesure d&apo;audience, mets à jour cette section.]</p>
      </Section>

      <Section title="Contenu des serveurs et des avis">
        <p>
          Les descriptions, avis et liens d&apo;invitation sont publiés par les utilisateurs sous leur
          responsabilité. Un contenu illicite ou inapproprié peut être signalé à [adresse de
          contact] ; l&apo;équipe de modération le retirera dans les meilleurs délais.
        </p>
      </Section>

      <p className="mt-12">
        <Link href="/" className="underline">
          Retour à l&apo;accueil
        </Link>
      </p>
    </main>
  );
}