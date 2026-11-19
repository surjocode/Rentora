
import Image from "next/image";
import { Star, MessageSquareQuote } from "lucide-react";

export interface Review {
  _id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  equipmentName?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({
  reviews,
}: ReviewsSectionProps) {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
            Customer Feedback
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#442719] sm:text-4xl">
            What Our Customers
            <span className="text-orange-600"> Say</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-500">
            Real experiences from customers who have rented equipment
            through Rentora.
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-[#eee5dc] bg-[#faf7f2] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >

                {/* Quote Icon */}
                <MessageSquareQuote
                  size={30}
                  className="text-orange-500"
                />

                {/* Rating */}
                <div
                  className="mt-5 flex items-center gap-1"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={17}
                      className={
                        index < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="mt-4 min-h-20 text-sm leading-7 text-gray-600">
                  &quot;{review.comment}&quot;
                </p>

                {/* Equipment Name */}
                {review.equipmentName && (
                  <p className="mt-3 text-xs font-medium text-orange-700">
                    Equipment: {review.equipmentName}
                  </p>
                )}

                {/* Customer Information */}
                <div className="mt-6 flex items-center gap-3 border-t border-[#e7dcd0] pt-5">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-sm font-bold text-orange-700">

                    {review.customerImage ? (
                      <Image
                        src={review.customerImage}
                        alt={review.customerName}
                        fill
                        unoptimized
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      review.customerName.charAt(0).toUpperCase()
                    )}

                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#442719]">
                      {review.customerName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Verified Customer
                    </p>
                  </div>
                </div>
              </article>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d9cfc5] bg-[#faf7f2] px-5 py-12 text-center">
            <MessageSquareQuote
              className="mx-auto mb-3 text-orange-500"
              size={36}
            />

            <h3 className="font-bold text-[#442719]">
              No Reviews Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Customer reviews will appear here once they are available.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
