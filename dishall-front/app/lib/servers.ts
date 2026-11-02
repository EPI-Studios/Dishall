import type { ServerType } from "../@types/type";
import { servers } from "../data/servers";

// Changer pour mettre la base de donnée à la place du fichier local

export async function getServers(): Promise<ServerType[]> {
    return servers;
}

export async function getServerById(id: number): Promise<ServerType | undefined> {
    return servers.find((s) => s.id === id);
}