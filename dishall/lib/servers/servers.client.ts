import type { ServerType } from "../../@types/type";
import { inviteLinkSchema } from "../validation";

export async function getServersByUser(): Promise<ServerType[]> {
  const httpResponse = await fetch("http://localhost:3000/api/auth/me/servers");

  if (!httpResponse.ok) {
    throw new Error("Impossible de charger les serveurs")
  }

  const servers = await httpResponse.json();
  
  return servers;

}

export async function handleDeleteServer(uuid: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/servers/${uuid}`, 
      {
        method: "DELETE",
        credentials: "include"
      },
    );
    
    if (!response.ok) {
      console.error("Echec de la supression");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function handleUpdateServer(uuid: string, name: string, description: string, country: string, category: string, link: string) {

  const updatedServer: Record<string, string> = {};

  if (name) updatedServer.name = name;
  if (description) updatedServer.description = description;
  if (category) updatedServer.category = category;
  if (country) updatedServer.country = country;

  if (link) {
    const discordLink = inviteLinkSchema.safeParse(link);
    if (!discordLink.success) {
      throw new Error(discordLink.error.issues[0].message);
    }
    updatedServer.link = discordLink.data; // On utilise .data pour renvoyer la valeur, sinon on envoi juste le résultat
  }
  
  try {
    const response = await fetch(`http://localhost:3000/api/servers/${uuid}`, 
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedServer),
      }, 
    );
    
    if (!response.ok) {
      console.error("Echec de la modification");
    }
  } catch (error) {
    console.error(error);
  }
}