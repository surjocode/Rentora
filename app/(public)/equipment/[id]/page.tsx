
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

interface EquipmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <Link
          href="/all-equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#806b5e] transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Equipment
        </Link>

        {/* Equipment Details */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Equipment Image Placeholder */}
          <div className="flex min-h-80 items-center justify-center rounded-3xl border border-[#eee5dc] bg-white p-8 shadow-sm lg:min-h-[500px]">
            <div className="text-center">
              <Package
                size={80}
                className="mx-auto text-orange-500"
              />

              <p className="mt-4 text-sm text-[#806b5e]">
                Equipment Image Will Appear Here
              </p>
            </div>
          </div>

          {/* Equipment Information */}
          <div className="rounded-3xl border border-[#eee5dc] bg-white p-6 shadow-sm sm:p-8">

            <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
              Equipment Details
            </span>

            <h1 className="mt-5 text-3xl font-bold text-[#442719] sm:text-4xl">
              Equipment Information
            </h1>

            <p className="mt-4 break-all text-sm text-[#806b5e]">
              Equipment ID: {id}
            </p>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-2 text-sm text-[#806b5e]">
              <Star size={18} className="fill-orange-400 text-orange-400" />
              <span>Rating information will be available soon</span>
            </div>

            {/* Price */}
            <div className="mt-7 rounded-2xl bg-[#faf7f2] p-5">
              <p className="text-sm text-[#806b5e]">
                Rental Price
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                Price unavailable
              </p>

              <p className="mt-1 text-xs text-[#806b5e]">
                Rental price per day
              </p>
            </div>

            {/* Additional Information */}
            <div className="mt-7 space-y-5">

              <div className="flex items-center gap-3">
                <MapPin className="text-orange-600" size={20} />
                <span className="text-sm text-[#665348]">
                  Equipment location will be available soon
                </span>
              </div>

              <div className="flex items-center gap-3">
                <User className="text-orange-600" size={20} />
                <span className="text-sm text-[#665348]">
                  Owner information will be available soon
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="text-orange-600" size={20} />
                <span className="text-sm text-[#665348]">
                  Rental availability will be updated soon
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-600" size={20} />
                <span className="text-sm text-[#665348]">
                  Rental information and safety details
                </span>
              </div>

            </div>

            {/* Booking Button */}
            <button
              type="button"
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-xl bg-orange-300 px-6 py-4 font-semibold text-white"
            >
              Booking Coming Soon
            </button>

            <p className="mt-3 text-center text-xs text-[#806b5e]">
              Booking will be available after backend integration.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
