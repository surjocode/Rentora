
import Link from "next/link";
import { ArrowRight, Shapes } from "lucide-react";

interface CategoriesSectionProps {
  categories: string[];
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  return (
    <section className="bg-[#faf7f2] px-5 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-0.5 w-9 bg-orange-500" />

          <h2 className="text-2xl font-extrabold text-[#442719] sm:text-3xl">
            Popular Categories
          </h2>

          <span className="h-0.5 w-9 bg-orange-500" />
        </div>

        {/* Category Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/all-equipment?category=${encodeURIComponent(category)}`}
                className="group flex min-h-28 items-center gap-3 rounded-2xl border border-[#eee5dc] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Shapes size={25} />
                </div>

                <span className="text-sm font-bold text-[#493b32] transition group-hover:text-orange-600">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d9cfc5] bg-white px-5 py-12 text-center">
            <Shapes
              className="mx-auto mb-3 text-orange-500"
              size={32}
            />

            <h3 className="font-bold text-[#442719]">
              No Categories Available
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Categories will appear here once they are loaded from the database.
            </p>
          </div>
        )}

        {/* View All */}
        <div className="mt-7 text-center">
          <Link
            href="/all-equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-100"
          >
            View All Categories
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
