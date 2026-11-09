import type { ReviewType } from "../@types/type";

export async function getReviewsByServerUuid( serverUuid: string ): Promise<ReviewType[]> {
  const httpResponse = await fetch(
    `${process.env.API_URL}/reviews?serverUuid=${serverUuid}`,
  );
  
  if (!httpResponse.ok) {
    throw new Error(`Impossible de charger les avis (${httpResponse.status})`)
  }

  return httpResponse.json();
}
