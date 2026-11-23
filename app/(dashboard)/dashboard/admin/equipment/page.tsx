
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
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
  Boxes,
  TrendingUp,
  AlertCircle,
  Tag,
  UserRound,
  RotateCcw,
} from "lucide-react";

import {
  getAllAdminEquipment,
  updateEquipmentStatus,
  updateAdminEquipment,
  deleteAdminEquipment,
} from "@/services/admin.service";

import type { Equipment } from "@/services/equipment.service";
import { toast } from "sonner";

// ==========================================
// TYPES
// ==========================================

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

// ==========================================
// HELPERS
// ==========================================

const formatPrice = (price: number) =>
  `৳${price.toLocaleString("en-BD")}`;

const getRentalLabel = (type: Equipment["rentalType"]) => {
  if (type === "weekly") return "week";
  if (type === "monthly") return "month";
  return "day";
};

const getStatusStyle = (status: EquipmentStatus) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const getStatusIcon = (status: EquipmentStatus) => {
  switch (status) {
    case "approved":
      return CheckCircle;

    case "rejected":
      return XCircle;

    default:
      return Clock;
  }
};

// ==========================================
// COMPONENT
// ==========================================

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

  // ==========================================
  // FETCH EQUIPMENT
  // ==========================================

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllAdminEquipment();

      if (!response.success) {
        throw new Error(
          response.message || "Failed to load equipment."
        );
      }

      setEquipment(response.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEquipment();
  }, [fetchEquipment]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const statusCounts = useMemo(
    () => ({
      pending: equipment.filter(
        (item) => item.status === "pending"
      ).length,

      approved: equipment.filter(
        (item) => item.status === "approved"
      ).length,

      rejected: equipment.filter(
        (item) => item.status === "rejected"
      ).length,
    }),
    [equipment]
  );

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================

  const filteredEquipment = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.ownerEmail.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.location.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [equipment, search, statusFilter]);

  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const handleStatusUpdate = async (
    id: string,
    status: EquipmentStatus
  ) => {
    try {
      setUpdatingId(id);

      const response = await updateEquipmentStatus(id, status);

      if (!response.success) {
        throw new Error(
          response.message || "Status update failed."
        );
      }

      setEquipment((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, status }
            : item
        )
      );

      const statusLabel =
        status.charAt(0).toUpperCase() + status.slice(1);

      toast.success(
        `Equipment status changed to ${statusLabel} successfully.`
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // EDIT EQUIPMENT
  // ==========================================

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

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingEquipment) return;

    if (
      !editForm.name.trim() ||
      !editForm.category.trim() ||
      !editForm.location.trim() ||
      !Number.isFinite(editForm.pricePerDay) ||
      editForm.pricePerDay <= 0 ||
      !Number.isInteger(editForm.availableQuantity) ||
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
        throw new Error(
          response.message || "Equipment update failed."
        );
      }

      setEquipment((previous) =>
        previous.map((item) =>
          item._id === editingEquipment._id
            ? { ...item, ...editForm }
            : item
        )
      );

      toast.success("Equipment updated successfully.");

      setEditingEquipment(null);
      setEditForm(emptyForm);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE EQUIPMENT
  // ==========================================

  const handleDelete = async (item: Equipment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);

      const response = await deleteAdminEquipment(item._id);

      if (!response.success) {
        throw new Error(
          response.message || "Equipment deletion failed."
        );
      }

      setEquipment((previous) =>
        previous.filter(
          (equipmentItem) => equipmentItem._id !== item._id
        )
      );

      toast.success("Equipment deleted successfully.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // STAT CARDS
  // ==========================================

  const statCards = [
    {
      title: "Total Equipment",
      value: equipment.length,
      description: "All submitted listings",
      icon: Boxes,
      iconStyle: "bg-blue-50 text-blue-600",
      borderStyle: "border-blue-100",
    },
    {
      title: "Pending Review",
      value: statusCounts.pending,
      description: "Waiting for approval",
      icon: Clock,
      iconStyle: "bg-amber-50 text-amber-600",
      borderStyle: "border-amber-100",
    },
    {
      title: "Approved",
      value: statusCounts.approved,
      description: "Available for customers",
      icon: CheckCircle,
      iconStyle: "bg-emerald-50 text-emerald-600",
      borderStyle: "border-emerald-100",
    },
    {
      title: "Rejected",
      value: statusCounts.rejected,
      description: "Listings not approved",
      icon: XCircle,
      iconStyle: "bg-red-50 text-red-600",
      borderStyle: "border-red-100",
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">

      {/* HEADER */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#442719] via-[#66391f] to-[#9a4a20] p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-100">
              <ShieldCheck size={14} />
              ADMIN CONTROL CENTER
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Equipment
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-orange-100/80">
              Review owner submissions, manage equipment listings,
              and control marketplace approval.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur sm:h-20 sm:w-20">
            <Package size={38} className="text-orange-100" />
          </div>
        </div>

        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="absolute -bottom-24 right-40 h-52 w-52 rounded-full border-[30px] border-white/5" />
      </section>

      {/* STATISTICS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`group rounded-2xl border ${item.borderStyle} bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9b8a7e]">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#442719]">
                    {item.value.toLocaleString("en-BD")}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconStyle} transition group-hover:scale-110`}
                >
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-[#9b8a7e]">
                <TrendingUp size={14} />
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* FILTER TOOLBAR */}

      <section className="rounded-2xl border border-[#eee4da] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#442719]">
              Equipment Listings
            </h2>

            <p className="mt-1 text-sm text-[#9b8a7e]">
              Search, filter and manage all equipment submissions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}

            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] bg-[#faf8f5] px-3.5 transition focus-within:border-[#ea580c] focus-within:bg-white">
              <Search size={18} className="shrink-0 text-[#9b8a7e]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment..."
                aria-label="Search equipment"
                className="w-full bg-transparent py-3 text-sm text-[#442719] outline-none placeholder:text-[#b6a79c] sm:w-48"
              />
            </div>

            {/* STATUS FILTER */}

            <div className="flex items-center gap-2 rounded-xl border border-[#eee4da] bg-[#faf8f5] px-3.5">
              <Filter size={17} className="text-[#9b8a7e]" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                aria-label="Filter equipment by status"
                className="w-full cursor-pointer bg-transparent py-3 text-sm text-[#6b5a50] outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => void fetchEquipment()}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#eee4da] bg-white px-4 py-3 text-sm font-semibold text-[#442719] transition hover:border-[#ea580c] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* EQUIPMENT TABLE */}

      <section className="overflow-hidden rounded-2xl border border-[#eee4da] bg-white shadow-sm">

        <div className="flex flex-col gap-2 border-b border-[#eee4da] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-[#442719]">
              All Equipment
            </h3>

            <p className="mt-1 text-xs text-[#9b8a7e]">
              Manage equipment details and approval status.
            </p>
          </div>

          <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#ea580c]">
            {filteredEquipment.length} Listings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-[#faf8f5] text-[11px] font-bold uppercase tracking-wider text-[#9b8a7e]">
              <tr>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Rental Price</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-t border-[#eee4da]"
                  >
                    <td colSpan={7} className="px-5 py-5">
                      <div className="h-8 animate-pulse rounded-lg bg-[#f5f0eb]" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <AlertCircle
                      size={36}
                      className="mx-auto text-red-500"
                    />

                    <p className="mt-3 font-semibold text-red-600">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={() => void fetchEquipment()}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c94b08]"
                    >
                      <RotateCcw size={15} />
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredEquipment.length > 0 ? (
                filteredEquipment.map((item) => {
                  const StatusIcon = getStatusIcon(
                    item.status as EquipmentStatus
                  );

                  return (
                    <tr
                      key={item._id}
                      className="border-t border-[#eee4da] transition hover:bg-[#fdfbf9]"
                    >
                      {/* EQUIPMENT */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#eee4da] bg-[#fff5ec] text-[#ea580c]">
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

                          <div className="max-w-[200px]">
                            <p className="truncate text-sm font-bold text-[#442719]">
                              {item.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-[#9b8a7e]">
                              <Tag size={12} />
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* OWNER */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserRound size={15} />
                          </div>

                          <span className="max-w-[170px] truncate text-xs font-medium text-[#6b5a50]">
                            {item.ownerEmail}
                          </span>
                        </div>
                      </td>

                      {/* LOCATION */}

                      <td className="px-5 py-4">
                        <div className="flex max-w-[150px] items-center gap-1.5 text-xs text-[#6b5a50]">
                          <MapPin
                            size={14}
                            className="shrink-0 text-[#ea580c]"
                          />

                          <span className="truncate">
                            {item.location}
                          </span>
                        </div>
                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#442719]">
                          {formatPrice(item.pricePerDay)}
                        </p>

                        <p className="mt-1 text-[11px] text-[#9b8a7e]">
                          / {getRentalLabel(item.rentalType)}
                        </p>
                      </td>

                      {/* QUANTITY */}

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f0eb] px-2.5 py-1.5 text-xs font-semibold text-[#6b5a50]">
                          <Boxes size={13} />
                          {item.availableQuantity}
                        </span>
                      </td>

                      {/* STATUS DROPDOWN */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            size={16}
                            className={
                              item.status === "approved"
                                ? "text-emerald-600"
                                : item.status === "rejected"
                                  ? "text-red-600"
                                  : "text-amber-600"
                            }
                          />

                          <select
                            value={item.status}
                            onChange={(event) =>
                              void handleStatusUpdate(
                                item._id,
                                event.target.value as EquipmentStatus
                              )
                            }
                            disabled={updatingId === item._id}
                            aria-label={`Change ${item.name} status`}
                            className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-bold outline-none transition focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-50 ${getStatusStyle(
                              item.status as EquipmentStatus
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>

                      {/* ACTIONS: UPDATE AND DELETE ONLY */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">

                          {/* UPDATE */}

                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            title="Edit equipment"
                            aria-label="Edit equipment"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={deletingId === item._id}
                            onClick={() => void handleDelete(item)}
                            title="Delete equipment"
                            aria-label="Delete equipment"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
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

                          {updatingId === item._id && (
                            <span className="text-[10px] text-[#9b8a7e]">
                              Updating...
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff5ec] text-[#ea580c]">
                      <Package size={30} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#442719]">
                      No Equipment Found
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm text-[#9b8a7e]">
                      No equipment matches your current search
                      or selected status filter.
                    </p>

                    {(search || statusFilter !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("all");
                        }}
                        className="mt-4 text-sm font-bold text-[#ea580c] hover:underline"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}

        <div className="flex flex-col gap-2 border-t border-[#eee4da] bg-[#fdfbf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#9b8a7e]">
            Showing{" "}
            <span className="font-bold text-[#442719]">
              {filteredEquipment.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#442719]">
              {equipment.length}
            </span>{" "}
            equipment listings
          </p>

          <p className="flex items-center gap-1.5 text-xs text-[#9b8a7e]">
            <ShieldCheck size={14} className="text-emerald-600" />
            Admin equipment management
          </p>
        </div>
      </section>

      {/* APPROVAL INFORMATION */}

      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h3 className="font-bold text-emerald-900">
              Equipment Approval Process
            </h3>

            <p className="mt-1 text-sm leading-6 text-emerald-800/80">
              Review equipment information before approving a listing.
              Only approved equipment should be visible to customers
              in the public marketplace. Owners cannot approve their
              own equipment.
            </p>
          </div>
        </div>
      </section>

      {/* EDIT MODAL */}

      {editingEquipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#24160f]/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setEditingEquipment(null);
            }
          }}
        >
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between bg-gradient-to-r from-[#442719] to-[#85401f] px-6 py-5 text-white">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-200">
                  <Pencil size={13} />
                  Equipment Management
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  Update Equipment
                </h2>

                <p className="mt-1 text-xs text-orange-100/80">
                  Edit listing information and rental details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingEquipment(null)}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20 disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleUpdate}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Equipment Name *
                  </label>

                  <input
                    required
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter equipment name"
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Category *
                  </label>

                  <input
                    required
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        category: event.target.value,
                      })
                    }
                    placeholder="Enter category"
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* RENTAL TYPE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Rental Type *
                  </label>

                  <select
                    value={editForm.rentalType}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        rentalType: event.target.value as EquipmentFormData["rentalType"],
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Price Per{" "}
                    {editForm.rentalType === "daily"
                      ? "Day"
                      : editForm.rentalType === "weekly"
                        ? "Week"
                        : "Month"}{" "}
                    (৳) *
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={editForm.pricePerDay}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        pricePerDay: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* QUANTITY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Available Quantity *
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={editForm.availableQuantity}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        availableQuantity: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* CONDITION */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Condition
                  </label>

                  <input
                    value={editForm.condition}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        condition: event.target.value,
                      })
                    }
                    placeholder="e.g. Excellent"
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* BRAND */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Brand
                  </label>

                  <input
                    value={editForm.brand}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        brand: event.target.value,
                      })
                    }
                    placeholder="Enter brand"
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* MODEL */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Model
                  </label>

                  <input
                    value={editForm.model}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        model: event.target.value,
                      })
                    }
                    placeholder="Enter model"
                    className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* LOCATION */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Location *
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8a7e]"
                    />

                    <input
                      required
                      value={editForm.location}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          location: event.target.value,
                        })
                      }
                      placeholder="Enter equipment location"
                      className="w-full rounded-xl border border-[#eee4da] bg-[#fdfbf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        description: event.target.value,
                      })
                    }
                    placeholder="Write equipment description..."
                    className="w-full resize-y rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>

                {/* TERMS */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#442719]">
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
                    placeholder="Enter rental terms and conditions..."
                    className="w-full resize-y rounded-xl border border-[#eee4da] bg-[#fdfbf9] px-4 py-3 text-sm outline-none transition focus:border-[#ea580c] focus:bg-white"
                  />
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#eee4da] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEquipment(null)}
                  disabled={saving}
                  className="rounded-xl border border-[#eee4da] px-5 py-3 text-sm font-semibold text-[#6b5a50] transition hover:bg-[#faf7f2] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-[#c94b08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
