export default function discordServerIcon(guildId: string, icon: string) {
    if (!icon) {
      return "/profil.png";
    }

    if (/^https?:\/\//i.test(icon)) return icon;

    const extension = icon.startsWith("a_") ? "gif" : "webp";

    return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${extension}`;
  }