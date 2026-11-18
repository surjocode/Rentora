import { LoaderCircle, Wrench } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5">
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#442719] text-white shadow-lg">
          <Wrench size={32} />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold tracking-tight text-[#442719]">
          Rentora
        </h1>

        <p className="mt-2 text-sm text-[#806b5e]">
          Rent Smarter. Do More.
        </p>

        {/* Loading Spinner */}
        <div className="mt-8 flex items-center gap-3">
          <LoaderCircle
            size={24}
            className="animate-spin text-orange-600"
          />

          <span className="text-sm font-medium text-[#665348]">
            Loading, please wait...
          </span>
        </div>

        {/* Loading Animation */}
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-[#eadfd4]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-600" />
        </div>
      </div>
    </main>
  );
}