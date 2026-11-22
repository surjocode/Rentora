
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
    <section className="relative overflow-hidden bg-background px-5 py-20 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-24">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-secondary/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
            <Sparkles size={16} />
            Customer Feedback
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What Our Customers
            <span className="text-foreground"> Say</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-ring hover:shadow-xl hover:shadow-foreground/5 sm:p-8"
                >
                  {/* Decorative Quote */}
                  <div className="absolute -right-2 -top-3 text-foreground/[0.04] transition-colors duration-300 group-hover:text-foreground/10">
                    <Quote size={105} strokeWidth={1.5} />
                  </div>

                  {/* Quote Icon */}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors duration-300 group-hover:bg-secondary group-hover:text-foreground">
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
                            ? "fill-foreground text-foreground"
                            : "text-muted-foreground/40"
                        }
                      />
                    ))}

                    <span className="ml-2 text-xs font-semibold text-muted-foreground">
                      {rating}/5
                    </span>
                  </div>

                  {/* Review Comment */}
                  <blockquote className="relative mt-5 flex-1 text-sm leading-8 text-muted-foreground">
                    &ldquo;{review.comment}&rdquo;
                  </blockquote>

                  {/* Equipment Name */}
                  {review.equipmentName && (
                    <div className="mt-5 inline-flex w-fit max-w-full items-center rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-foreground">
                      <span className="mr-1.5 shrink-0">
                        Equipment:
                      </span>

                      <span className="truncate">
                        {review.equipmentName}
                      </span>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-secondary text-base font-bold text-foreground">
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
                      <h3 className="truncate text-sm font-bold text-foreground">
                        {review.customerName}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Customer Review
                      </p>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-foreground/60 transition-all duration-500 group-hover:w-full" />
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
            className="rounded-3xl border border-dashed border-border bg-card px-5 py-16 text-center shadow-sm transition-colors duration-300"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <MessageSquareQuote size={32} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-foreground">
              No Reviews Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Customer feedback will appear here once reviews are
              submitted. Be among the first to share your experience.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
