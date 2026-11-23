
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  Users,
  Search,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  Filter,
  Eye,
  MoreVertical,
  X,
  CalendarDays,
  Mail,
  Loader2,
  RefreshCw,
  Save,
} from "lucide-react";

import {
  getAllUsers,
  updateUserRole,
} from "@/services/admin.service";

import type { User as ApiUser } from "@/services/user.service";

// ==========================================
// TYPES
// ==========================================

type UserRole = "Customer" | "Owner" | "Admin";
type BackendRole = "renter" | "owner" | "admin";

interface DisplayUser extends ApiUser {
  _id: string;
}

// ==========================================
// ROLE CONVERSION
// ==========================================

const roleToDisplay = (role: BackendRole): UserRole => {
  switch (role) {
    case "renter":
      return "Customer";
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
  }
};

const displayToRole = (role: UserRole): BackendRole => {
  switch (role) {
    case "Customer":
      return "renter";
    case "Owner":
      return "owner";
    case "Admin":
      return "admin";
  }
};

// ==========================================
// COMPONENT
// ==========================================

export default function ManageUsersPage() {
  const [users, setUsers] = useState<DisplayUser[]>([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<DisplayUser | null>(null);

  const [editingUser, setEditingUser] =
    useState<DisplayUser | null>(null);

  const [newRole, setNewRole] =
    useState<UserRole>("Customer");

  const [updating, setUpdating] = useState(false);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllUsers();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load users."
        );
      }

      const formattedUsers: DisplayUser[] = result.data
        .filter(
          (user) =>
            typeof user._id === "string" &&
            user._id.length > 0
        )
        .map((user) => ({
          ...user,
          _id: user._id as string,
        }));

      setUsers(formattedUsers);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(searchTerm) ||
        (user.email || "").toLowerCase().includes(searchTerm);

      const matchesRole =
        roleFilter === "All" ||
        roleToDisplay(user.role) === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const customers = users.filter(
    (user) => user.role === "renter"
  ).length;

  const owners = users.filter(
    (user) => user.role === "owner"
  ).length;

  const admins = users.filter(
    (user) => user.role === "admin"
  ).length;

  // ==========================================
  // ROLE STYLE
  // ==========================================

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

  // ==========================================
  // EDIT USER ROLE
  // ==========================================

  const handleEditRole = (user: DisplayUser) => {
    if (user.role === "admin") {
      setError("Administrator roles cannot be changed here.");
      return;
    }

    setEditingUser(user);
    setNewRole(roleToDisplay(user.role));

    setSuccess("");
    setError("");
  };

  // ==========================================
  // UPDATE USER ROLE
  // ==========================================

  const handleUpdateRole = async () => {
    if (!editingUser || updating) return;

    if (editingUser.role === "admin") {
      setError("You cannot change an administrator's role.");
      setEditingUser(null);
      return;
    }

    const updatedRole = displayToRole(newRole);

    if (editingUser.role === updatedRole) {
      setEditingUser(null);
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const result = await updateUserRole(
        editingUser._id,
        updatedRole
      );

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update user role."
        );
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === editingUser._id
            ? { ...user, role: updatedRole }
            : user
        )
      );

      setSuccess(
        `${editingUser.name}'s role updated successfully.`
      );

      setEditingUser(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update user role."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (
    date: ApiUser["createdAt"]
  ) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString();
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* PAGE HEADING */}

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#ea580c] uppercase">
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

      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}

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
            value: customers,
            icon: UserRound,
            color: "bg-green-50 text-green-600",
          },
          {
            title: "Equipment Owners",
            value: owners,
            icon: BriefcaseBusiness,
            color: "bg-orange-50 text-orange-600",
          },
          {
            title: "Administrators",
            value: admins,
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
                {loading ? "..." : item.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* USER MANAGEMENT TABLE */}

      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">

        {/* SEARCH AND FILTER */}

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

            {/* SEARCH */}

            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3 py-2.5">
              <Search size={18} className="text-[#9b8a7e]" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search users..."
                className="w-full bg-transparent text-sm outline-none sm:w-48"
              />
            </div>

            {/* ROLE FILTER */}

            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] px-3">
              <Filter size={17} className="text-[#9b8a7e]" />

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => void fetchUsers()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] px-4 py-2.5 text-sm font-medium text-[#442719] transition hover:bg-[#faf7f2] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">

            <thead className="bg-[#faf7f2] text-xs tracking-wider text-[#9b8a7e] uppercase">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Registration Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <Loader2
                      className="mx-auto animate-spin text-[#ea580c]"
                      size={32}
                    />

                    <p className="mt-3 text-sm text-[#9b8a7e]">
                      Loading registered users...
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const displayRole = roleToDisplay(user.role);
                  const RoleIcon = getRoleIcon(displayRole);

                  return (
                    <tr
                      key={user._id}
                      className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User"}
                              width={44}
                              height={44}
                              unoptimized
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0e5] text-[#ea580c]">
                              <UserRound size={21} />
                            </div>
                          )}

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
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getRoleStyle(displayRole)}`}
                        >
                          <RoleIcon size={14} />
                          {displayRole}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#6b5a50]">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            aria-label="View user"
                            title="View user"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Eye size={18} />
                          </button>

                          {/* CHANGE ROLE */}

                          {user.role !== "admin" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleEditRole(user)
                              }
                              aria-label="Change user role"
                              title="Change role"
                              className="rounded-lg p-2 text-[#9b8a7e] transition hover:bg-[#f5eee7]"
                            >
                              <MoreVertical size={18} />
                            </button>
                          )}
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
                      {error
                        ? "Unable to Load Users"
                        : "No Users Found"}
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      {error
                        ? "Please check your connection and try again."
                        : "No users match your current search or filter."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}

        <div className="border-t border-[#eee4da] px-5 py-4">
          <p className="text-sm text-[#9b8a7e]">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </section>

      {/* ADMIN INFORMATION */}

      <section className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50 p-5">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-purple-600"
        />

        <div>
          <h3 className="font-semibold text-purple-900">
            Admin Access Control
          </h3>

          <p className="mt-1 text-sm leading-6 text-purple-800/80">
            Only authorized administrators should be able to manage
            user accounts and permissions. Existing administrator
            roles cannot be changed from this page.
          </p>
        </div>
      </section>

      {/* VIEW USER MODAL */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#442719]">
                User Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-[#9b8a7e] hover:bg-[#faf7f2]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center">
              {selectedUser.image ? (
                <Image
                  src={selectedUser.image}
                  alt={selectedUser.name || "User"}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0e5] text-[#ea580c]">
                  <UserRound size={36} />
                </div>
              )}

              <h3 className="mt-3 text-lg font-bold text-[#442719]">
                {selectedUser.name}
              </h3>

              <span
                className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                  roleToDisplay(selectedUser.role)
                )}`}
              >
                {roleToDisplay(selectedUser.role)}
              </span>
            </div>

            <div className="mt-6 space-y-4 rounded-xl bg-[#faf7f2] p-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#ea580c]" />

                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Email Address
                  </p>

                  <p className="break-all text-sm font-medium text-[#442719]">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays
                  size={18}
                  className="text-[#ea580c]"
                />

                <div>
                  <p className="text-xs text-[#9b8a7e]">
                    Registration Date
                  </p>

                  <p className="text-sm font-medium text-[#442719]">
                    {selectedUser.createdAt
                      ? new Date(
                          selectedUser.createdAt
                        ).toLocaleString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE ROLE MODAL */}

      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !updating && setEditingUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#442719]">
                Change User Role
              </h2>

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                disabled={updating}
                aria-label="Close modal"
                className="rounded-lg p-2 text-[#9b8a7e] hover:bg-[#faf7f2] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-4 text-sm text-[#9b8a7e]">
              Update the account role for:
            </p>

            <div className="mt-2 rounded-xl bg-[#faf7f2] p-4">
              <p className="font-semibold text-[#442719]">
                {editingUser.name}
              </p>

              <p className="mt-1 text-xs text-[#9b8a7e]">
                {editingUser.email}
              </p>
            </div>

            {/* SELECT NEW ROLE */}

            <label
              htmlFor="user-role"
              className="mt-5 block text-sm font-semibold text-[#442719]"
            >
              Select New Role
            </label>

            <select
              id="user-role"
              value={newRole}
              onChange={(event) =>
                setNewRole(event.target.value as UserRole)
              }
              disabled={updating}
              className="mt-2 w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
            >
              <option value="Customer">Customer</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
            </select>

            {/* ACTION BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                disabled={updating}
                className="rounded-xl border border-[#eee4da] px-4 py-2.5 text-sm font-semibold text-[#6b5a50] hover:bg-[#faf7f2] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleUpdateRole()}
                disabled={
                  updating ||
                  newRole === roleToDisplay(editingUser.role)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c94b08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
