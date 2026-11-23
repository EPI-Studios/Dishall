const RESERVED = ["admin", "administrateur", "administrator", "moderateur", "moderator", "modo", "dishall", "support", "staff", "system"];

// minuscules, sans accents, sans espaces ni ponctuation : "Admin ", "ADM1N" ou "M.o.d.o" se ramènent à la même forme
function normalize(pseudo: string) {
  return pseudo
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function isReservedPseudo(pseudo: string) {
  const n = normalize(pseudo);
  return RESERVED.some((r) => n === r);
}