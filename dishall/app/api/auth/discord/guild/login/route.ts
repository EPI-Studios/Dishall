import { redirect } from "next/navigation";

export async function GET() {
  const url = "https://discord.com/oauth2/authorize?client_id=1569362762055024641&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord%2Fguild%2Fcallback&scope=guilds+guilds.joinhttps://discord.com/oauth2/authorize?client_id=1569362762055024641&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord%2Fguild%2Fcallback&scope=guilds+guilds.join"

  redirect(url);
}