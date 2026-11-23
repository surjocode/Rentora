
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
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
  MapPin,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

import {
  getMyEquipment,
  updateEquipment,
  deleteEquipment,
  type Equipment,
} from "@/services/equipment.service";

type EquipmentStatus = "pending" | "approved" | "rejected";
type RentalType = "daily" | "weekly" | "monthly";

interface EditFormData {
  name: string;
  description: string;
  category: string;
  rentalType: RentalType;
  pricePerDay: string;
  location: string;
  image: string;
}

const initialFormData: EditFormData = {
  name: "",
  description: "",
  category: "",
  rentalType: "daily",
  pricePerDay: "",
  location: "",
  image: "",
};

const statusStyles: Record<EquipmentStatus, string> = {
  pending: "bg-orange-50 text-orange-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const getRentalPriceLabel = (rentalType: RentalType) => {
  if (rentalType === "weekly") return "Week";
  if (rentalType === "monthly") return "Month";
  return "Day";
};

export default function MyEquipmentPage() {
  const router = useRouter();

  const {
    isAuthenticated,
    loading: authLoading,
    isOwner,
  } = useAuth();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
        throw new Error(result.message || "Failed to fetch equipment.");
      }

      setEquipment(result.data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch your equipment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Authentication and authorization
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

  // Unique categories
  const categories = useMemo(() => {
    return Array.from(
      new Set(equipment.map((item) => item.category).filter(Boolean))
    ).sort();
  }, [equipment]);

  // Search and filtering
  const filteredEquipment = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue) ||
        item.location.toLowerCase().includes(searchValue) ||
        item.brand.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [equipment, search, statusFilter, categoryFilter]);

  // Summary statistics
  const summary = useMemo(
    () => [
      {
        title: "Total Equipment",
        value: equipment.length,
        color: "text-[#442719]",
        icon: Package,
        bg: "bg-[#fff0e5]",
      },
      {
        title: "Approved",
        value: equipment.filter((item) => item.status === "approved").length,
        color: "text-green-600",
        icon: CheckCircle,
        bg: "bg-green-50",
      },
      {
        title: "Pending",
        value: equipment.filter((item) => item.status === "pending").length,
        color: "text-orange-600",
        icon: Clock,
        bg: "bg-orange-50",
      },
      {
        title: "Rejected",
        value: equipment.filter((item) => item.status === "rejected").length,
        color: "text-red-600",
        icon: XCircle,
        bg: "bg-red-50",
      },
    ],
    [equipment]
  );

  // Open edit modal
  const handleEdit = (item: Equipment) => {
    setError(null);
    setSuccess("");
    setEditingEquipment(item);

    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      rentalType: item.rentalType,
      pricePerDay: String(item.pricePerDay),
      location: item.location,
      image: item.image,
    });
  };

  // Close edit modal
  const handleCloseEdit = () => {
    if (saving) return;

    setEditingEquipment(null);
    setFormData(initialFormData);
  };

  // Update equipment
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingEquipment) return;

    const price = Number(formData.pricePerDay);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid rental price.");
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Equipment name and description are required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess("");

      const result = await updateEquipment(editingEquipment._id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        rentalType: formData.rentalType,
        pricePerDay: price,
        location: formData.location.trim(),
        image: formData.image.trim(),
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to update equipment.");
      }

      setEditingEquipment(null);
      setFormData(initialFormData);
      setSuccess("Equipment updated successfully.");

      await fetchEquipment();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update equipment."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete equipment
  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError(null);
      setSuccess("");

      const result = await deleteEquipment(id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete equipment.");
      }

      setEquipment((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setSuccess("Equipment deleted successfully.");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete equipment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-[#ea580c]"
            size={32}
          />

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

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void fetchEquipment()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm font-semibold text-[#442719] transition hover:bg-[#faf7f2]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            href="/dashboard/owner/add-equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            <Plus size={19} />
            Add Equipment
          </Link>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
        >
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

      {/* Success Message */}
      {success && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <p>{success}</p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#9b8a7e]">
                    {item.title}
                  </p>

                  <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <Icon size={24} className={item.color} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Equipment Management */}
      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white shadow-sm">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 border-b border-[#eee4da] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-[#442719]">
              Equipment Listings
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              {filteredEquipment.length} of {equipment.length} equipment
              listings
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
                className="w-full bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-[#eee4da] bg-white px-3 py-2.5 text-sm text-[#6b5a50] outline-none"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Rental Price</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((item) => {
                  const status = item.status as EquipmentStatus;
                  const StatusIcon =
                    statusIcons[status] || Clock;

                  return (
                    <tr
                      key={item._id}
                      className="border-t border-[#eee4da] transition hover:bg-[#faf7f2]"
                    >
                      {/* Equipment */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff0e5] text-[#ea580c]">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package size={22} />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-[#442719]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-[#9b8a7e]">
                              {item.brand} {item.model}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-sm text-[#6b5a50]">
                        {item.category}
                      </td>

                      {/* Rental Price */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#442719]">
                          ৳{item.pricePerDay.toLocaleString("en-BD")}
                        </p>

                        <p className="mt-1 text-xs text-[#9b8a7e]">
                          Per {getRentalPriceLabel(item.rentalType)}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4 text-sm text-[#6b5a50]">
                        {item.availableQuantity}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[#6b5a50]">
                          <MapPin size={15} />
                          {item.location}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                            statusStyles[status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <StatusIcon size={14} />
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${item._id}`}
                            aria-label="View equipment"
                            title="View equipment"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            aria-label="Edit equipment"
                            title="Edit equipment"
                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item._id, item.name)}
                            disabled={deletingId === item._id}
                            aria-label="Delete equipment"
                            title="Delete equipment"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === item._id ? (
                              <RefreshCw
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package
                      size={40}
                      className="mx-auto text-[#c5b8ad]"
                    />

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Equipment Found
                    </h3>

                    <p className="mt-2 text-sm text-[#9b8a7e]">
                      {search ||
                      statusFilter !== "all" ||
                      categoryFilter !== "all"
                        ? "Try changing your search or filters."
                        : "Add equipment to see your listings here."}
                    </p>

                    {!search &&
                      statusFilter === "all" &&
                      categoryFilter === "all" && (
                        <Link
                          href="/dashboard/owner/add-equipment"
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
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
            {/* Modal Header */}
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
                onClick={handleCloseEdit}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-[#9b8a7e] transition hover:bg-[#faf7f2] disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Equipment Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Equipment Name *
                </label>

                <input
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Category and Rental Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#442719]">
                    Category *
                  </label>

                  <input
                    required
                    value={formData.category}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#442719]">
                    Rental Type *
                  </label>

                  <select
                    required
                    value={formData.rentalType}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        rentalType: event.target.value as RentalType,
                      }))
                    }
                    className="w-full rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Rental Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Rental Price Per {getRentalPriceLabel(formData.rentalType)} (৳) *
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.pricePerDay}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      pricePerDay: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />

                <p className="mt-1 text-xs text-[#9b8a7e]">
                  Enter the price for each {formData.rentalType} rental period.
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Location *
                </label>

                <input
                  required
                  value={formData.location}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      location: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Image URL *
                </label>

                <input
                  required
                  type="url"
                  value={formData.image}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      image: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#442719]">
                  Description *
                </label>

                <textarea
                  required
                  minLength={10}
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  className="w-full resize-y rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={saving}
                  className="rounded-xl border border-[#eee4da] px-5 py-3 text-sm font-semibold text-[#6b5a50] transition hover:bg-[#faf7f2] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
