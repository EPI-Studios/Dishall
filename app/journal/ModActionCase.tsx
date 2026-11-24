import Link from "next/link";
import type { TargetInfo } from "@/lib/mod_actions/mod_action.server";

type ModAction = {
  uuid: string;
  action: string;
  type: string;
  target: string;
  reason: string;
  created_at: Date;
  user: { pseudo: string } | null; // null si le modérateur a été supprimé
  targetInfo: TargetInfo | null; // null si la cible n'existe plus
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

// Adapte les clés aux valeurs réellement écrites par tes routes
const ACTION_LABELS: Record<string, { emoji: string; label: string }> = {
  status_change: { emoji: "🔄", label: "Changement de statut" },
  role_change: { emoji: "👤", label: "Changement de rôle" },
  delete: { emoji: "🗑️", label: "Suppression" },
};

const TYPE_LABELS: Record<string, string> = {
  server: "Serveur",
  review: "Avis",
  user: "Utilisateur",
};

function TargetBlock({ action }: { action: ModAction }) {
  const info = action.targetInfo;

  if (!info) {
    return (
      <p className="text-sm italic opacity-70">
        Cible supprimée ou introuvable.
      </p>
    );
  }

  if (info.kind === "server") {
    return (
      <Link
        href={`/serveurs/${info.uuid}`}
        className="font-bold transition hover:text-pink"
      >
        {info.name}
      </Link>
    );
  }

  if (info.kind === "review") {
    return (
      <div className="min-w-0">
        <p className="text-sm opacity-70">
          Avis de{" "}
          <span className="font-bold">
            {info.authorPseudo ?? "utilisateur supprimé"}
          </span>{" "}
          sur{" "}
          <Link
            href={`/serveurs/${info.serverUuid}`}
            className="underline transition hover:text-pink"
          >
            {info.serverName}
          </Link>{" "}
          · {info.rate}/5 ⭐
        </p>
        {/* Texte posté par un utilisateur : affiché en texte brut (React l'échappe) et tronqué */}
        <blockquote className="mt-1 line-clamp-3 break-words border-l-2 border-pink pl-3">
          {info.comment}
        </blockquote>
      </div>
    );
  }

  return <span className="font-bold">{info.pseudo}</span>;
}

export default function ModActionCase({ action }: { action: ModAction }) {
  const { emoji, label } = ACTION_LABELS[action.action] ?? {
    emoji: "📝",
    label: action.action,
  };
  const typeLabel = TYPE_LABELS[action.type] ?? action.type;

  return (
    <article className="rounded-xl border-2 border-pink bg-dark p-4 shadow-[0_0_10px_var(--color-pink)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-xl font-bold">
          {emoji} {label}
        </h3>
        <time
          dateTime={action.created_at.toISOString()}
          className="text-sm opacity-70"
        >
          {dateFormatter.format(action.created_at)}
        </time>
      </div>

      <div className="mt-2 flex flex-wrap items-start gap-2">
        <span className="rounded-full border border-pink px-2 py-0.5 text-sm">
          {typeLabel}
        </span>
        <TargetBlock action={action} />
      </div>

      <p className="mt-3 break-words">{action.reason}</p>

      <p className="mt-3 text-sm opacity-70">
        Par{" "}
        {action.user ? (
          <span className="font-bold">{action.user.pseudo}</span>
        ) : (
          "un utilisateur supprimé"
        )}
      </p>
    </article>
  );
}