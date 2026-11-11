import type { ServerType } from "../../@types/type";

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