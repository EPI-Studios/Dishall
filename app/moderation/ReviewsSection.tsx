import { getAllReviewsModeration } from "@/lib/reviews/reviews.server";
import { redirect } from "next/navigation";
import Pagination from "./Pagination";
import ReviewCase from "./ReviewCase";

export default async function ReviewsSection({ page, canDelete }: { page: number; canDelete: boolean }) {
  const result = await getAllReviewsModeration(page);
  if (!result) redirect("/");

  const { reviews, totalPages } = result;

  if (page > totalPages) redirect(`/moderation?view=reviews&page=${totalPages}`);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCase key={review.uuid} review={review} canDelete={canDelete}/>
        ))}
      </div>
  
      <Pagination
        view="reviews"
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  );
}
