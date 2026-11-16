import "server-only";

import type { ServerType } from "../../@types/type";

export async function getServers(): Promise<ServerType[]> {
  
  const httpResponse = await fetch(`${process.env.API_URL}/servers`);
  
  if (!httpResponse.ok) {
    throw new Error("Impossible de charger les serveurs")
  }
  
  const servers = await httpResponse.json();

  return servers;
}

export async function getLatestServers(limit = 4) {
  const servers = await getServers();
  return servers 
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function getServerByUuid(uuid: string): Promise<ServerType | undefined> {
  const servers = await getServers()
  
  return servers.find((s: ServerType) => s.uuid === uuid);
}
