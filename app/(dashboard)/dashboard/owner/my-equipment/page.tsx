
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";

const equipmentList = [
  {
    id: "1",
    name: "Equipment Example",
    category: "Construction",
    price: 1500,
    location: "Dhaka",
    status: "Pending",
  },
];

export default function MyEquipmentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Temporary UI list. Real equipment will come from MongoDB API later.
  const filteredEquipment = equipmentList.filter((equipment) => {
    const matchesSearch = equipment.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      equipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Owner Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            My Equipment
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Manage your listed equipment and rental availability.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Plus size={19} />
          Add Equipment
        </Link>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Equipment",
            value: "0",
            color: "text-[#442719]",
          },
          {
            title: "Approved",
            value: "0",
            color: "text-green-600",
          },
          {
            title: "Pending",
            value: "0",
            color: "text-orange-600",
          },
          {
            title: "Rejected",
            value: "0",
            color: "text-red-600",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#eee4da] bg-white p-5"
          >
            <p className="text-sm text-[#9b8a7e]">
              {item.title}
            </p>

            <h2
              className={`mt-2 text-3xl font-bold ${item.color}`}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      {/* Equipment Management */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#eee4da] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-[#442719]">
              Equipment Listings
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              View and manage your equipment listings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
              <Search size={18} className="text-[#9b8a7e]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment..."
                className="w-full bg-transparent text-sm outline-none sm:w-44"
              />
            </div>

            {/* Status Filter */}
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price / Day</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((equipment) => (
                  <tr
                    key={equipment.id}
                    className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e5] text-[#ea580c]">
                          <Package size={21} />
                        </div>

                        <span className="font-semibold text-[#442719]">
                          {equipment.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      {equipment.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#442719]">
                      ৳{equipment.price.toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      {equipment.location}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                        {equipment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label="View equipment"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label="Edit equipment"
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label="Delete equipment"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label="More options"
                          className="rounded-lg p-2 text-[#9b8a7e] transition hover:bg-[#f5eee7]"
                        >
                          <MoreVertical size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package
                      size={38}
                      className="mx-auto text-[#c5b8ad]"
                    />

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Equipment Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      Add equipment to see your listings here.
                    </p>

                    <Link
                      href="/dashboard/owner/add-equipment"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                    >
                      Add Equipment
                      <ArrowUpRight size={17} />
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
