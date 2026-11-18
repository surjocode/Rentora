
"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  UserRound,
  Package,
  MapPin,
  Eye,
  ShieldCheck,
} from "lucide-react";

type RentalStatus =
  | "Pending"
  | "Confirmed"
  | "Active"
  | "Completed"
  | "Cancelled";

interface Rental {
  id: string;
  customerName: string;
  equipmentName: string;
  ownerName: string;
  location: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
}

export default function ManageRentalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Rental records will be loaded from the backend API later.
  const [rentals] = useState<Rental[]>([]);

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.customerName.toLowerCase().includes(search.toLowerCase()) ||
      rental.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      rental.ownerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || rental.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: RentalStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700";
      case "Active":
        return "bg-green-50 text-green-700";
      case "Completed":
        return "bg-purple-50 text-purple-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-orange-50 text-orange-700";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
          Admin Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
          Manage Rentals
        </h1>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Monitor and manage all equipment rental bookings.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            title: "Total Rentals",
            value: rentals.length,
            icon: ClipboardList,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Pending",
            value: rentals.filter((rental) => rental.status === "Pending").length,
            icon: Clock,
            color: "bg-orange-50 text-orange-600",
          },
          {
            title: "Active",
            value: rentals.filter((rental) => rental.status === "Active").length,
            icon: CheckCircle,
            color: "bg-green-50 text-green-600",
          },
          {
            title: "Completed",
            value: rentals.filter((rental) => rental.status === "Completed").length,
            icon: CalendarDays,
            color: "bg-purple-50 text-purple-600",
          },
          {
            title: "Cancelled",
            value: rentals.filter((rental) => rental.status === "Cancelled").length,
            icon: XCircle,
            color: "bg-red-50 text-red-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#eee4da] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#9b8a7e]">
                  {item.title}
                </p>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#442719]">
                {item.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Search and Filter */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">
            All Rental Bookings
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Search and review customer rental records.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rentals..."
              className="w-full bg-transparent text-sm outline-none sm:w-48"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3">
            <Filter size={17} className="text-[#9b8a7e]" />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Rentals Table */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">Rental</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Rental Period</th>
                <th className="px-5 py-4">Total Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e5] text-[#ea580c]">
                          <Package size={21} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#442719]">
                            {rental.equipmentName}
                          </p>

                          <p className="mt-1 text-xs text-[#9b8a7e]">
                            ID: {rental.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      <div className="flex items-center gap-2">
                        <UserRound size={16} />
                        {rental.customerName}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      {rental.ownerName}
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs text-[#6b5a50]">
                        <p className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {rental.startDate}
                        </p>

                        <p className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {rental.endDate}
                        </p>

                        <p className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {rental.location}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-[#442719]">
                      ৳{rental.totalPrice.toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(rental.status)}`}
                      >
                        {rental.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-label="View rental details"
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
                      <ClipboardList size={32} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Rentals Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      Rental booking records will appear here after connecting the API.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eee4da] px-5 py-4">
          <p className="text-sm text-[#9b8a7e]">
            Showing {filteredRentals.length} of {rentals.length} rental records
          </p>
        </div>
      </section>

      {/* Admin Notice */}
      <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <h3 className="font-semibold text-blue-900">
            Rental Management
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-800/80">
            Administrators can monitor rental activities and
            review booking records. Rental status changes and
            payment verification must be handled securely by
            the backend.
          </p>
        </div>
      </section>
    </div>
  );
}
