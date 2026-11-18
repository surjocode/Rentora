
"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays,
  MapPin,
  UserRound,
  Eye,
  Filter,
} from "lucide-react";

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface RentalRequest {
  id: string;
  customerName: string;
  equipmentName: string;
  location: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RequestStatus;
}

export default function RentalRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Real rental requests will be loaded from MongoDB API later.
  const [requests] = useState<RentalRequest[]>([]);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.customerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      request.equipmentName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
          Owner Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
          Rental Requests
        </h1>

        <p className="mt-2 text-sm text-[#9b8a7e]">
          Review and manage customer equipment booking requests.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Requests",
            value: requests.length,
            icon: ClipboardList,
            color: "text-blue-600 bg-blue-50",
          },
          {
            title: "Pending Requests",
            value: requests.filter(
              (request) => request.status === "Pending"
            ).length,
            icon: Clock,
            color: "text-orange-600 bg-orange-50",
          },
          {
            title: "Approved Requests",
            value: requests.filter(
              (request) => request.status === "Approved"
            ).length,
            icon: CheckCircle,
            color: "text-green-600 bg-green-50",
          },
          {
            title: "Rejected Requests",
            value: requests.filter(
              (request) => request.status === "Rejected"
            ).length,
            icon: XCircle,
            color: "text-red-600 bg-red-50",
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

              <h2 className="mt-3 text-3xl font-bold text-[#442719]">
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
            All Booking Requests
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Check customer requests and booking details.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
            <Search size={18} className="text-[#9b8a7e]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requests..."
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
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </section>

      {/* Request List */}
      {filteredRequests.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {filteredRequests.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e5] text-[#ea580c]">
                    <ClipboardList size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#442719]">
                      {request.equipmentName}
                    </h3>

                    <p className="mt-1 text-xs text-[#9b8a7e]">
                      Request ID: {request.id}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                  {request.status}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#eee4da] pt-4">
                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <UserRound size={17} />
                  {request.customerName}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <MapPin size={17} />
                  {request.location}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#6b5a50]">
                  <CalendarDays size={17} />
                  {request.startDate} – {request.endDate}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#eee4da] pt-4">
                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Total Rental Price
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#442719]">
                    ৳{request.totalPrice.toLocaleString("en-BD")}
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#eee4da] px-4 py-2.5 text-sm font-semibold text-[#442719] hover:bg-[#faf7f2]"
                >
                  <Eye size={17} />
                  Details
                </button>
              </div>

              {request.status === "Pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    <CheckCircle size={17} />
                    Accept
                  </button>

                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    <XCircle size={17} />
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#e5d8ca] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
            <ClipboardList size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#442719]">
            No Rental Requests Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9b8a7e]">
            Customer booking requests will appear here when
            someone requests to rent your equipment.
          </p>
        </section>
      )}
    </div>
  );
}
