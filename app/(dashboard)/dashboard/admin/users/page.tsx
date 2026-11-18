
"use client";

import { useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  Filter,
  Eye,
  MoreVertical,
  UserPlus,
} from "lucide-react";

type UserRole = "Customer" | "Owner" | "Admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Blocked";
}

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // User information will be loaded from the backend API later.
  const [users] = useState<User[]>([]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleStyle = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "bg-purple-50 text-purple-700";
      case "Owner":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return ShieldCheck;
      case "Owner":
        return BriefcaseBusiness;
      default:
        return UserRound;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ea580c]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#442719] sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-2 text-sm text-[#9b8a7e]">
            View and manage all registered Rentora users.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm font-semibold text-[#442719]">
          <Users size={19} className="text-[#ea580c]" />
          User Management
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Users",
            value: users.length,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Customers",
            value: users.filter((user) => user.role === "Customer").length,
            icon: UserRound,
            color: "bg-green-50 text-green-600",
          },
          {
            title: "Equipment Owners",
            value: users.filter((user) => user.role === "Owner").length,
            icon: BriefcaseBusiness,
            color: "bg-orange-50 text-orange-600",
          },
          {
            title: "Administrators",
            value: users.filter((user) => user.role === "Admin").length,
            icon: ShieldCheck,
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
            </div>
          );
        })}
      </section>

      {/* User Management Table */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-[#eee4da] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-[#442719]">
              All Registered Users
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              Manage customer, owner and admin accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
              <Search size={18} className="text-[#9b8a7e]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users..."
                className="w-full bg-transparent text-sm outline-none sm:w-48"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3">
              <Filter size={17} className="text-[#9b8a7e]" />

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);

                  return (
                    <tr
                      key={user.id}
                      className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0e5] text-[#ea580c]">
                            <UserRound size={21} />
                          </div>

                          <div>
                            <p className="font-semibold text-[#442719]">
                              {user.name}
                            </p>

                            <p className="mt-1 text-xs text-[#9b8a7e]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getRoleStyle(user.role)}`}
                        >
                          <RoleIcon size={14} />
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            user.status === "Active"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            aria-label="View user"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            aria-label="More user actions"
                            className="rounded-lg p-2 text-[#9b8a7e] transition hover:bg-[#f5eee7]"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2] text-[#a18d7e]">
                      <Users size={32} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Users Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      Registered users will appear here after connecting the API.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-[#eee4da] px-5 py-4">
          <p className="text-sm text-[#9b8a7e]">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </section>

      {/* Admin Information */}
      <section className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50 p-5">
        <ShieldCheck size={22} className="mt-0.5 shrink-0 text-purple-600" />

        <div>
          <h3 className="font-semibold text-purple-900">
            Admin Access Control
          </h3>

          <p className="mt-1 text-sm leading-6 text-purple-800/80">
            Only authorized administrators should be able to manage
            user accounts and permissions. Role changes and account
            restrictions will be handled securely by the backend.
          </p>
        </div>
      </section>
    </div>
  );
}
