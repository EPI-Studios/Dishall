import type { ReviewType } from "../@types/type";
import { reviews } from "../data/reviews";

export async function getReviewsByServerId(serverId: number): Promise<ReviewType[]> {
    return reviews.filter((r) => r.serverId === serverId);
}