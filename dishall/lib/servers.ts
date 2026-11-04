import type { ServerType } from "../@types/type";


export async function getServers(): Promise<ServerType[]> {
  const httpResponse = await fetch(`${process.env.API_URL}/servers`);
  const servers = await httpResponse.json();

  return servers;
}

export async function getServerByUuid(uuid: string): Promise<ServerType | undefined> {
  const httpResponse = await fetch(`${process.env.API_URL}/servers`);
  const servers = await httpResponse.json();
  
  return servers.find((s: ServerType) => s.uuid === uuid);
}
