import type { ServerType } from "../@types/type";

export async function getServers(): Promise<ServerType[]> {
  "use cache"

  const httpResponse = await fetch(`${process.env.API_URL}/servers`);
  if (!httpResponse.ok) {
    throw new Error("Impossible de charger les serveurs")
  }
  
  const servers = await httpResponse.json();

  return servers;
}

export async function getServerByUuid(uuid: string): Promise<ServerType | undefined> {
  const servers = await getServers()
  
  return servers.find((s: ServerType) => s.uuid === uuid);
}
