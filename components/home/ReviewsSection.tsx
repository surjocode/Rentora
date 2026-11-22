
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquareQuote,
  Quote,
  Sparkles,
} from "lucide-react";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export default function ReviewsSection({
  reviews,
}: ReviewsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#faf7f2] px-5 py-20 transition-colors duration-300 dark:bg-[#17120f] sm:px-6 lg:px-8 lg:py-24">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/5" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-400">
            <Sparkles size={16} />
            Customer Feedback
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#442719] dark:text-[#f5e9dc] sm:text-4xl lg:text-5xl">
            What Our Customers
            <span className="text-orange-600 dark:text-orange-400">
              {" "}Say
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
            Discover what customers have to say about their equipment
            rental experiences with Rentora.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
          >
            {reviews.map((review) => {
              const customerInitial =
                review.customerName.trim().charAt(0).toUpperCase() || "?";

              const rating = Math.min(
                5,
                Math.max(0, Math.floor(review.rating)),
              );

              return (
                <motion.article
                  key={review._id}
                  variants={cardVariants}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#eadfd3] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/10 dark:border-white/10 dark:bg-[#241c17] dark:hover:border-orange-500/40 sm:p-8"
                >
                  {/* Decorative Quote */}
                  <div className="absolute -right-2 -top-3 text-orange-50 transition-colors duration-300 group-hover:text-orange-100 dark:text-orange-400/5 dark:group-hover:text-orange-400/10">
                    <Quote size={105} strokeWidth={1.5} />
                  </div>

                  {/* Quote Icon */}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#442719] text-orange-400 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white dark:bg-[#3a291f] dark:group-hover:bg-orange-600">
                    <MessageSquareQuote size={25} />
                  </div>

                  {/* Rating */}
                  <div
                    className="relative mt-6 flex items-center gap-1"
                    aria-label={`${rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={18}
                        className={
                          index < rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}

                    <span className="ml-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {rating}/5
                    </span>
                  </div>

                  {/* Review Comment */}
                  <blockquote className="relative mt-5 flex-1 text-sm leading-8 text-gray-600 dark:text-gray-300">
                    &ldquo;{review.comment}&rdquo;
                  </blockquote>

                  {/* Equipment Name */}
                  {review.equipmentName && (
                    <div className="mt-5 inline-flex w-fit max-w-full items-center rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                      <span className="mr-1.5 shrink-0">
                        Equipment:
                      </span>

                      <span className="truncate">
                        {review.equipmentName}
                      </span>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="mt-7 flex items-center gap-3 border-t border-[#eee5dc] pt-5 dark:border-white/10">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-orange-100 bg-orange-50 text-base font-bold text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-400">
                      {review.customerImage ? (
                        <Image
                          src={review.customerImage}
                          alt={`${review.customerName}'s profile`}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        customerInitial
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#442719] dark:text-[#f5e9dc]">
                        {review.customerName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Customer Review
                      </p>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-orange-500 transition-all duration-500 group-hover:w-full" />
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-dashed border-[#d9cfc5] bg-white px-5 py-16 text-center shadow-sm transition-colors duration-300 dark:border-white/15 dark:bg-[#241c17]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <MessageSquareQuote size={32} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#442719] dark:text-[#f5e9dc]">
              No Reviews Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
              Customer feedback will appear here once reviews are
              submitted. Be among the first to share your experience.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
