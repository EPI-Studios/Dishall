import { z } from "zod";

const DISCORD_HOSTS = ["discord.gg", "discord.com", "www.discord.com"];

export const inviteLinkSchema = z.url().refine((value) => {
  const { protocol, hostname, pathname } = new URL(value);
  if (protocol !== "https:") return false;
  if (hostname === "discord.gg") return pathname.length > 1;
  return DISCORD_HOSTS.includes(hostname) && pathname.startsWith("/invite/");
}, "Le lien doit être une invitation Discord valide");