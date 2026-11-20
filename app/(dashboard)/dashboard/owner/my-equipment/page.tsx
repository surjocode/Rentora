
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowUpRight,
  X,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import {
  getMyEquipment,
  updateEquipment,
  deleteEquipment,
  type Equipment,
} from "@/services/equipment.service";

type EquipmentStatus = "pending" | "approved" | "rejected";

interface EditFormData {
  name: string;
  description: string;
  category: string;
  pricePerDay: string;
  location: string;
  image: string;
}

const initialFormData: EditFormData = {
  name: "",
  description: "",
  category: "",
  pricePerDay: "",
  location: "",
  image: "",
};

const statusStyles: Record<EquipmentStatus, string> = {
  pending: "bg-orange-50 text-orange-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
};

export default function MyEquipmentPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, isOwner } = useAuth();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingEquipment, setEditingEquipment] =
    useState<Equipment | null>(null);

  const [formData, setFormData] =
    useState<EditFormData>(initialFormData);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch owner's equipment
  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyEquipment();

      if (!result.success) {
        throw new Error(result.message);
      }

      setEquipment(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch your equipment"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication and fetch equipment
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isOwner) {
      router.replace("/dashboard");
      return;
    }

    void fetchEquipment();
  }, [
    authLoading,
    isAuthenticated,
    isOwner,
    router,
    fetchEquipment,
  ]);

  // Search and status filtering
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue) ||
        item.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [equipment, search, statusFilter]);

  // Summary counts
  const summary = useMemo(
    () => [
      {
        title: "Total Equipment",
        value: equipment.length,
        color: "text-[#442719]",
      },
      {
        title: "Approved",
        value: equipment.filter((item) => item.status === "approved").length,
        color: "text-green-600",
      },
      {
        title: "Pending",
        value: equipment.filter((item) => item.status === "pending").length,
        color: "text-orange-600",
      },
      {
        title: "Rejected",
        value: equipment.filter((item) => item.status === "rejected").length,
        color: "text-red-600",
      },
    ],
    [equipment]
  );

  // Open edit modal
  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);

    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      pricePerDay: String(item.pricePerDay),
      location: item.location,
      image: item.image,
    });
  };

  // Update equipment
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingEquipment) return;

    const price = Number(formData.pricePerDay);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const result = await updateEquipment(editingEquipment._id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        pricePerDay: price,
        location: formData.location.trim(),
        image: formData.image.trim(),
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setEditingEquipment(null);
      setFormData(initialFormData);

      await fetchEquipment();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update equipment"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete equipment
  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError(null);

      const result = await deleteEquipment(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      setEquipment((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete equipment"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-[#ea580c]" size={32} />
          <p className="mt-3 text-sm text-[#9b8a7e]">
            Loading your equipment...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isOwner) {
    return null;
  }

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

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Close error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#eee4da] bg-white p-5"
          >
            <p className="text-sm text-[#9b8a7e]">
              {item.title}
            </p>

            <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      {/* Equipment Management */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">

        {/* Search and Filter */}
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
                onChange={(event) => setStatusFilter(event.target.value)}
                className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Table */}
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
                filteredEquipment.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e5] text-[#ea580c]">
                          <Package size={21} />
                        </div>

                        <span className="font-semibold text-[#442719]">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      {item.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#442719]">
                      ৳{item.pricePerDay.toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6b5a50]">
                      {item.location}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <Link
                          href={`/equipment/${item._id}`}
                          aria-label="View equipment"
                          title="View equipment"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </Link>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          aria-label="Edit equipment"
                          title="Edit equipment"
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                        >
                          <Pencil size={17} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.name)}
                          disabled={deletingId === item._id}
                          aria-label="Delete equipment"
                          title="Delete equipment"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === item._id ? (
                            <RefreshCw size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
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
                      {search || statusFilter !== "all"
                        ? "Try changing your search or status filter."
                        : "Add equipment to see your listings here."}
                    </p>

                    {!search && statusFilter === "all" && (
                      <Link
                        href="/dashboard/owner/add-equipment"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                      >
                        Add Equipment
                        <ArrowUpRight size={17} />
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Equipment Modal */}
      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#442719]">
                  Edit Equipment
                </h2>

                <p className="mt-1 text-sm text-[#9b8a7e]">
                  Update your equipment information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingEquipment(null)}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-[#9b8a7e] hover:bg-[#faf7f2]"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Equipment Name
                </label>

                <input
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#442719]">
                    Category
                  </label>

                  <input
                    required
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({ ...formData, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#442719]">
                    Price Per Day (৳)
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.pricePerDay}
                    onChange={(event) =>
                      setFormData({ ...formData, pricePerDay: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Location
                </label>

                <input
                  required
                  value={formData.location}
                  onChange={(event) =>
                    setFormData({ ...formData, location: event.target.value })
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Image URL
                </label>

                <input
                  required
                  type="url"
                  value={formData.image}
                  onChange={(event) =>
                    setFormData({ ...formData, image: event.target.value })
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEquipment(null)}
                  disabled={saving}
                  className="rounded-xl border border-[#eee4da] px-5 py-3 text-sm font-semibold text-[#6b5a50] hover:bg-[#faf7f2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <RefreshCw size={16} className="animate-spin" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
