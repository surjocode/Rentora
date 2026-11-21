
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Package,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import {
  getAllAdminEquipment,
  updateEquipmentStatus,
  updateAdminEquipment,
  deleteAdminEquipment,
} from "@/services/admin.service";
import type { Equipment } from "@/services/equipment.service";
import { toast } from "sonner";

type EquipmentStatus = "pending" | "approved" | "rejected";

type EquipmentFormData = {
  name: string;
  description: string;
  category: string;
  rentalType: "daily" | "weekly" | "monthly";
  pricePerDay: number;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  location: string;
  termsAndConditions: string;
};

const emptyForm: EquipmentFormData = {
  name: "",
  description: "",
  category: "",
  rentalType: "daily",
  pricePerDay: 0,
  availableQuantity: 1,
  condition: "",
  brand: "",
  model: "",
  location: "",
  termsAndConditions: "",
};

export default function ManageEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [editingEquipment, setEditingEquipment] =
    useState<Equipment | null>(null);
  const [editForm, setEditForm] =
    useState<EquipmentFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllAdminEquipment();

      if (!response.success) {
        throw new Error(response.message || "Failed to load equipment.");
      }

      setEquipment(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEquipment();
  }, [fetchEquipment]);

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(id);

      const response = await updateEquipmentStatus(id, status);

      if (!response.success) {
        throw new Error(response.message || "Status update failed.");
      }

      toast.success(
        status === "approved"
          ? "Equipment approved successfully."
          : "Equipment rejected successfully."
      );

      await fetchEquipment();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditClick = (item: Equipment) => {
    setEditingEquipment(item);

    setEditForm({
      name: item.name,
      description: item.description,
      category: item.category,
      rentalType: item.rentalType,
      pricePerDay: item.pricePerDay,
      availableQuantity: item.availableQuantity,
      condition: item.condition,
      brand: item.brand,
      model: item.model,
      location: item.location,
      termsAndConditions: item.termsAndConditions,
    });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingEquipment) return;

    if (
      !editForm.name.trim() ||
      !editForm.category.trim() ||
      !editForm.location.trim() ||
      editForm.pricePerDay <= 0 ||
      editForm.availableQuantity < 1
    ) {
      toast.error("Please enter valid equipment information.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateAdminEquipment(
        editingEquipment._id,
        editForm
      );

      if (!response.success) {
        throw new Error(response.message || "Equipment update failed.");
      }

      toast.success("Equipment updated successfully.");
      setEditingEquipment(null);
      setEditForm(emptyForm);

      await fetchEquipment();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Equipment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);

      const response = await deleteAdminEquipment(item._id);

      if (!response.success) {
        throw new Error(response.message || "Equipment deletion failed.");
      }

      toast.success("Equipment deleted successfully.");
      await fetchEquipment();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<EquipmentStatus, number> = {
    pending: equipment.filter((item) => item.status === "pending").length,
    approved: equipment.filter((item) => item.status === "approved").length,
    rejected: equipment.filter((item) => item.status === "rejected").length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
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
            value: statusCounts.pending,
            icon: Clock,
            color: "bg-orange-50 text-orange-600",
          },
          {
            title: "Approved",
            value: statusCounts.approved,
            icon: CheckCircle,
            color: "bg-green-50 text-green-600",
          },
          {
            title: "Rejected",
            value: statusCounts.rejected,
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
                <p className="text-sm text-[#9b8a7e]">{item.title}</p>

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

      <section className="flex flex-col gap-4 rounded-2xl border border-[#eee4da] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#442719]">Equipment Listings</h2>
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
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent py-2.5 text-sm text-[#6b5a50] outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void fetchEquipment()}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] px-4 py-2.5 text-sm font-medium text-[#442719] hover:bg-[#faf7f2] disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-[#9b8a7e]">
                    Loading equipment...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <p className="font-semibold text-red-600">{error}</p>
                    <button
                      onClick={() => void fetchEquipment()}
                      className="mt-3 text-sm font-semibold text-[#ea580c]"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredEquipment.length > 0 ? (
                filteredEquipment.map((item) => (
                  <tr
                    key={item._id}
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
                      {item.ownerEmail}
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
                          item.status === "approved"
                            ? "bg-green-50 text-green-700"
                            : item.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                void handleStatusUpdate(item._id, "approved")
                              }
                              aria-label="Approve equipment"
                              title="Approve"
                              className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                            >
                              <CheckCircle size={18} />
                            </button>

                            <button
                              type="button"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                void handleStatusUpdate(item._id, "rejected")
                              }
                              aria-label="Reject equipment"
                              title="Reject"
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          title="Update equipment"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === item._id}
                          onClick={() => void handleDelete(item)}
                          title="Delete equipment"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === item._id ? (
                            <RefreshCw size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>

                        {updatingId === item._id && (
                          <span className="text-xs text-[#9b8a7e]">
                            Updating...
                          </span>
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
                      No equipment matches your current search or filter.
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

      <section className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
        <ShieldCheck size={22} className="mt-0.5 shrink-0 text-green-600" />

        <div>
          <h3 className="font-semibold text-green-900">
            Equipment Approval Process
          </h3>
          <p className="mt-1 text-sm leading-6 text-green-800/80">
            Review equipment details before approval. Only approved equipment
            should become visible to customers on the public marketplace.
          </p>
        </div>
      </section>

      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#442719]">
                  Update Equipment
                </h2>
                <p className="mt-1 text-sm text-[#9b8a7e]">
                  Edit equipment information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingEquipment(null)}
                disabled={saving}
                className="rounded-lg p-2 text-[#9b8a7e] hover:bg-[#faf7f2]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Equipment Name
                  </label>
                  <input
                    required
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm({ ...editForm, name: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Category
                  </label>
                  <input
                    required
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm({ ...editForm, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Rental Type
                  </label>
                  <select
                    value={editForm.rentalType}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        rentalType: event.target.value as EquipmentFormData["rentalType"],
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Price Per Day (৳)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={editForm.pricePerDay}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        pricePerDay: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Available Quantity
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={editForm.availableQuantity}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        availableQuantity: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Condition
                  </label>
                  <input
                    value={editForm.condition}
                    onChange={(event) =>
                      setEditForm({ ...editForm, condition: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Brand
                  </label>
                  <input
                    value={editForm.brand}
                    onChange={(event) =>
                      setEditForm({ ...editForm, brand: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Model
                  </label>
                  <input
                    value={editForm.model}
                    onChange={(event) =>
                      setEditForm({ ...editForm, model: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Location
                  </label>
                  <input
                    required
                    value={editForm.location}
                    onChange={(event) =>
                      setEditForm({ ...editForm, location: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        description: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[#442719]">
                    Terms and Conditions
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.termsAndConditions}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        termsAndConditions: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] px-4 py-3 text-sm outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEquipment(null)}
                  disabled={saving}
                  className="rounded-xl border border-[#eee4da] px-5 py-3 text-sm font-semibold text-[#6b5a50] hover:bg-[#faf7f2] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c94b08] disabled:opacity-50"
                >
                  <Save size={17} />
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
