
"use client";

import { useState } from "react";
import {
  Package,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Eye,
  MapPin,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

type EquipmentStatus = "Pending" | "Approved" | "Rejected";

interface Equipment {
  id: string;
  name: string;
  category: string;
  owner: string;
  location: string;
  pricePerDay: number;
  status: EquipmentStatus;
}

export default function ManageEquipmentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Equipment records will be loaded from the backend API later.
  const [equipment] = useState<Equipment[]>([]);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
          Admin Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
          Manage Equipment
        </h1>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Review equipment listings and manage owner submissions.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Equipment",
            value: equipment.length,
            icon: Package,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Pending Approval",
            value: equipment.filter(
              (item) => item.status === "Pending"
            ).length,
            icon: Clock,
            color: "bg-orange-50 text-orange-600",
          },
          {
            title: "Approved",
            value: equipment.filter(
              (item) => item.status === "Approved"
            ).length,
            icon: CheckCircle,
            color: "bg-green-50 text-green-600",
          },
          {
            title: "Rejected",
            value: equipment.filter(
              (item) => item.status === "Rejected"
            ).length,
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
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={22} />
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
            Equipment Listings
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Search and review all equipment submissions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search equipment..."
              className="w-full bg-transparent text-sm outline-none sm:w-48"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3">
            <Filter size={17} className="text-[#9b8a7e]" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </section>

      {/* Equipment Table */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Price / Day</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e5] text-[#ea580c]">
                          <Package size={21} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#442719]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#9b8a7e]">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#6b5a50]">
                      {item.owner}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#6b5a50]">
                        <MapPin size={15} />
                        {item.location}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#442719]">
                      ৳{item.pricePerDay.toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.status === "Approved"
                            ? "bg-green-50 text-green-700"
                            : item.status === "Rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label="View equipment details"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={18} />
                        </button>

                        {item.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              aria-label="Approve equipment"
                              className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                            >
                              <CheckCircle size={18} />
                            </button>

                            <button
                              type="button"
                              aria-label="Reject equipment"
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
                      <Package size={32} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Equipment Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      Equipment submissions will appear here after connecting the API.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eee4da] px-5 py-4">
          <p className="text-sm text-[#9b8a7e]">
            Showing {filteredEquipment.length} of {equipment.length} equipment listings
          </p>
        </div>
      </section>

      {/* Approval Notice */}
      <section className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-green-600"
        />

        <div>
          <h3 className="font-semibold text-green-900">
            Equipment Approval Process
          </h3>

          <p className="mt-1 text-sm leading-6 text-green-800/80">
            Review equipment details before approval. Only approved
            equipment should become visible to customers on the
            public marketplace.
          </p>
        </div>
      </section>
    </div>
  );
}
