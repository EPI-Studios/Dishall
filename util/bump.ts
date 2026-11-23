export const BUMP_DURATION_MS = 3 * 60 * 60 * 1000; // un bump reste actif 3 h

export function isBumped(lastBumpAt: Date | null | undefined): boolean {
  if (!lastBumpAt) return false; // jamais bumpé

  return Date.now() - lastBumpAt.getTime() < BUMP_DURATION_MS;
}