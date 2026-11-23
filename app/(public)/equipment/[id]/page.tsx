
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  ShieldCheck,
  User,
  RefreshCw,
} from "lucide-react";

import {
  getEquipmentById,
  type Equipment,
} from "@/services/equipment.service";

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch equipment details
  useEffect(() => {
    let isActive = true;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getEquipmentById(id);

        if (!result.success) {
          throw new Error(result.message);
        }

        if (isActive) {
          setEquipment(result.data);
        }
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load equipment details."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (id) {
      void fetchEquipment();
    }

    return () => {
      isActive = false;
    };
  }, [id]);

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

        {/* Loading */}
        {loading && (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={36}
                className="mx-auto animate-spin text-orange-600"
              />

              <p className="mt-4 text-sm text-[#806b5e]">
                Loading equipment details...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white px-5 py-16 text-center">
            <Package
              size={48}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-5 text-xl font-bold text-[#442719]">
              Unable to Load Equipment
            </h2>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Browse Equipment
            </Link>
          </div>
        )}

        {/* Equipment Details */}
        {!loading && !error && equipment && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Equipment Image */}
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-sm lg:min-h-[500px]">
              {equipment.image ? (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <Package
                  size={80}
                  className="text-orange-500"
                />
              )}
            </div>

            {/* Equipment Information */}
            <div className="rounded-3xl border border-[#eee5dc] bg-white p-6 shadow-sm sm:p-8">
              <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
                {equipment.category}
              </span>

              <h1 className="mt-5 text-3xl font-bold text-[#442719] sm:text-4xl">
                {equipment.name}
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#806b5e]">
                {equipment.description}
              </p>

              {/* Price */}
              <div className="mt-7 rounded-2xl bg-[#faf7f2] p-5">
                <p className="text-sm text-[#806b5e]">
                  Rental Price
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-600">
                  ৳{equipment.pricePerDay.toLocaleString("en-BD")}
                </p>

                <p className="mt-1 text-xs text-[#806b5e]">
                  Rental price per day
                </p>
              </div>

              {/* Additional Information */}
              <div className="mt-7 space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    {equipment.location}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <User
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="break-all text-sm text-[#665348]">
                    Owner: {equipment.ownerEmail}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    Listed on{" "}
                    {new Date(
                      equipment.createdAt
                    ).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    Approved equipment
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Package
                    className="shrink-0 text-orange-600"
                    size={20}
                  />

                  <span className="text-sm text-[#665348]">
                    {equipment.availableQuantity} items available
                  </span>
                </div>
              </div>

              {/* Availability Information */}
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={22}
                    className="shrink-0 text-emerald-600"
                  />

                  <div>
                    <h2 className="font-semibold text-emerald-800">
                      Equipment Available
                    </h2>

                    <p className="mt-1 text-sm text-emerald-700">
                      This equipment is approved and listed on Rentora.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Equipment */}
              <Link
                href="/all-equipment"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
              >
                <ArrowLeft size={18} />
                Explore More Equipment
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
