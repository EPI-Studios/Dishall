import { BUMP_DURATION_MS } from "@/util/bump";

type ScoreType = {
  ratingAvg: number | null;
  members: number,
  descriptionLength: number,
  lastBumpAt: Date | null;
};

function descriptionPoints(length: number) {
  if (length < 125) return 2.5;
  if (length < 250) return 5;
  if (length < 375) return 7.5;
  return 10;
}

function memberPoints(members: number) {
  if (members < 50) return 2;
  if (members < 100) return 4;
  if (members < 500) return 6;
  if (members < 1000) return 8;
  return 10;
}

function ratingPoints(ratingAvg: number | null) {
  if (ratingAvg === null) return 5; // On mets une note de 5 si il n'y a pas d'avis
  return ratingAvg * 2; // note sur 10
}

function bumpPoints(lastBumpAt: Date | null) {
  if (!lastBumpAt) return 0;

  const duration = Date.now() - lastBumpAt.getTime();

  if (duration < 30 * 60 * 1000) return 10; // moins de 30 min 
  if (duration < 60 * 60 * 1000) return 8; // moins d'1h
  if (duration < 2 * 60 * 60 * 1000) return 5; // moins de 2h
  if (duration < BUMP_DURATION_MS) return 3; // moins de 3h
  return 0; // bump expiré
}

export function calculateServerScore({ ratingAvg, members, descriptionLength, lastBumpAt }: ScoreType) {
  const total = 
    descriptionPoints(descriptionLength) + memberPoints(members) + ratingPoints(ratingAvg) + bumpPoints(lastBumpAt);

  return Math.round((total / 4) * 10) / 10;
}