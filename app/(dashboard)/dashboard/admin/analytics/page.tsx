
"use client";

import {
  BarChart3,
  Users,
  Package,
  CalendarCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
} from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 25 },
  { month: "Feb", revenue: 40 },
  { month: "Mar", revenue: 32 },
  { month: "Apr", revenue: 55 },
  { month: "May", revenue: 45 },
  { month: "Jun", revenue: 70 },
  { month: "Jul", revenue: 60 },
  { month: "Aug", revenue: 85 },
  { month: "Sep", revenue: 68 },
  { month: "Oct", revenue: 90 },
  { month: "Nov", revenue: 75 },
  { month: "Dec", revenue: 100 },
];

const categoryStats = [
  { name: "Construction", percentage: 35 },
  { name: "Photography", percentage: 25 },
  { name: "Electronics", percentage: 20 },
  { name: "Vehicles", percentage: 12 },
  { name: "Others", percentage: 8 },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.revenue)
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            Platform Analytics
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            Monitor Rentora's overall performance and activity.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm font-medium text-[#6b5a50]">
          <Activity size={18} className="text-green-600" />
          Analytics Overview
        </div>
      </section>

      {/* Main Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Users",
            value: "0",
            change: "Live data pending",
            icon: Users,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Total Equipment",
            value: "0",
            change: "Live data pending",
            icon: Package,
            color: "bg-orange-50 text-orange-600",
          },
          {
            title: "Total Rentals",
            value: "0",
            change: "Live data pending",
            icon: CalendarCheck,
            color: "bg-green-50 text-green-600",
          },
          {
            title: "Total Revenue",
            value: "৳0",
            change: "Live data pending",
            icon: Wallet,
            color: "bg-purple-50 text-purple-600",
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

              <p className="mt-2 text-xs text-[#9b8a7e]">
                {item.change}
              </p>
            </div>
          );
        })}
      </section>

      {/* Revenue Chart */}
      <section className="rounded-2xl border border-[#eee4da] bg-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#442719]">
              Revenue Overview
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              Monthly revenue visualization
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <TrendingUp size={17} />
            Revenue Analytics
          </div>
        </div>

        <div className="mt-8">
          <div className="flex h-64 items-end justify-between gap-2 border-b border-l border-[#eee4da] px-2 sm:gap-4 sm:px-4">
            {monthlyRevenue.map((item) => (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full max-w-10 rounded-t-lg bg-[#ea580c] transition hover:bg-[#c2410c]"
                  style={{
                    height: `${(item.revenue / maxRevenue) * 85}%`,
                  }}
                  title={`${item.month}: ${item.revenue}`}
                />

                <span className="text-[10px] text-[#9b8a7e] sm:text-xs">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-[#9b8a7e]">
            Monthly revenue chart — sample visualization only
          </p>
        </div>
      </section>

      {/* Category Statistics */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold text-[#442719]">
            Equipment by Category
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Sample category distribution
          </p>

          <div className="mt-7 space-y-6">
            {categoryStats.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6b5a50]">
                    {item.name}
                  </span>

                  <span className="text-sm font-bold text-[#442719]">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#f3ede6]">
                  <div
                    className="h-full rounded-full bg-[#ea580c]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Activity */}
        <div className="rounded-2xl border border-[#eee4da] bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold text-[#442719]">
            Platform Activity
          </h2>

          <p className="mt-1 text-sm text-[#9b8a7e]">
            Important platform performance indicators
          </p>

          <div className="mt-7 space-y-4">
            {[
              {
                title: "User Registration",
                description: "New customer and owner accounts",
                icon: Users,
              },
              {
                title: "Equipment Listing",
                description: "New equipment submitted by owners",
                icon: Package,
              },
              {
                title: "Rental Bookings",
                description: "Customer booking activities",
                icon: CalendarCheck,
              },
              {
                title: "Revenue Generation",
                description: "Successful rental payments",
                icon: Wallet,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl bg-[#faf7f2] p-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#ea580c]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#442719]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#9b8a7e]">
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="ml-auto text-[#a18d7e]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Notice */}
      <section className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-5">
        <BarChart3
          size={22}
          className="mt-0.5 shrink-0 text-[#ea580c]"
        />

        <div>
          <h3 className="font-semibold text-[#442719]">
            Analytics Data Integration
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#8b5e3c]">
            Revenue chart and category percentages currently use
            sample visualization data. We will replace these with
            real MongoDB statistics and verified payment records
            after the backend analytics API is ready.
          </p>
        </div>
      </section>
    </div>
  );
}
