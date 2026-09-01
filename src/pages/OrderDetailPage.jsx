import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getOrder } from "../api/orders";
import api from "../api/axios";
import ConfirmDialog from "../components/common/ConfirmDialog";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

// Format money like the design: 14,000,000.00 EGP
const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EGP`;
};

// Format date like: 27 Aug 2026
const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Capitalize the first letter.
const capitalize = (value) => {
  if (!value) return "—";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

// Static Tailwind classes are used so Tailwind can detect them.
const getStatusClasses = (status) => {
  switch (status) {
    case "delivered":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "shipped":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";

    case "processing":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";

    case "confirmed":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";

    case "cancelled":
      return "border-red-500/30 bg-red-500/10 text-red-300";

    case "returned":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";

    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
};

const getPaymentStatusClasses = (status) => {
  switch (status) {
    case "paid":
      return "bg-emerald-500/10 text-emerald-300";

    case "failed":
      return "bg-red-500/10 text-red-300";

    case "refunded":
      return "bg-blue-500/10 text-blue-300";

    default:
      return "bg-amber-500/10 text-amber-300";
  }
};

export default function OrderDetailPage() {
  // Get order ID from /dashboard/orders/:id
  const { id } = useParams();

  // Real order returned from backend.
  const [order, setOrder] = useState(null);

  // GET loading state.
  const [loading, setLoading] = useState(true);

  // GET/PATCH error.
  const [error, setError] = useState("");

  // Current dropdown value.
  const [selectedStatus, setSelectedStatus] = useState("");

  // Proposed status waiting for confirmation.
  const [pendingStatus, setPendingStatus] = useState(null);

  // Existing/new admin note.
  const [adminNote, setAdminNote] = useState("");

  // Controls ConfirmDialog.
  const [showConfirm, setShowConfirm] = useState(false);

  // PATCH loading state.
  const [isUpdating, setIsUpdating] = useState(false);

  
  // featch order 
  

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        // Uses the shared Axios instance through api/orders.js.
        const response = await getOrder(id);

        const fetchedOrder = response.data?.order;

        if (!fetchedOrder) {
          throw new Error("Order was not found in the API response.");
        }

        setOrder(fetchedOrder);
        setSelectedStatus(fetchedOrder.status || "");
        setAdminNote(fetchedOrder.adminNote || "");
      } catch (err) {
        console.error("Failed to fetch order:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // status change 
  

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    // Selecting the current persisted status does nothing.
    if (newStatus === order?.status) {
      setSelectedStatus(order.status);
      setPendingStatus(null);
      setShowConfirm(false);
      return;
    }

    // Only change the UI value.
    setSelectedStatus(newStatus);

    // Store proposed status separately.
    setPendingStatus(newStatus);

    // Ask for confirmation BEFORE PATCH.
    setShowConfirm(true);
  };

  // cancel status change 

  const handleCancelStatusChange = () => {
    // Return dropdown to persisted server status.
    setSelectedStatus(order?.status || "");

    // Remove proposed status.
    setPendingStatus(null);

    // Close confirmation.
    setShowConfirm(false);
  };

  
  // confirm status change 

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus || !order) return;

    try {
      setIsUpdating(true);
      setError("");

      /*
       * PATCH happens ONLY here after confirmation.
       */
      const response = await api.patch(
        `/orders/admin/${id}/status`,
        {
          status: pendingStatus,
          adminNote,
        }
      );

      const updatedOrder = response.data?.order;

      if (!updatedOrder) {
        throw new Error(
          "Updated order was not found in the API response."
        );
      }

      // Update UI only after backend confirms success.
      setOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);
      setAdminNote(updatedOrder.adminNote || adminNote);

      setPendingStatus(null);
      setShowConfirm(false);

      toast.success(
        response.data?.message ||
          "Order status updated successfully."
      );
    } catch (err) {
      console.error("Failed to update order:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status.";

      // Persisted order.status has not changed.
      setSelectedStatus(order.status);

      setPendingStatus(null);
      setShowConfirm(false);
      setError(message);

      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading 

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-slate-200" />

          <p className="mt-4 text-sm text-slate-400">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  //Feacth error 

  if (error && !order) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <h2 className="font-semibold text-red-300">
            Failed to load order
          </h2>

          <p className="mt-1 text-sm text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-slate-400">
        No order found.
      </div>
    );
  }

  // Last 8 characters like the design.
  const shortOrderId = order._id
    ?.slice(-8)
    .toUpperCase();

  // page

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Order Detail
            </p>

            <h1 className="mt-2 text-2xl font-bold text-white">
              #{shortOrderId}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  order.status
                )}`}
              >
                {capitalize(order.status)}
              </span>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${getPaymentStatusClasses(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus || "pending"}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Payment
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-200">
              {capitalize(order.paymentMethod)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* INFO */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Info
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {order.shippingAddress?.fullName || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {order.shippingAddress?.phone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Ship to
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {[
                      order.shippingAddress?.city,
                      order.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>

              {order.shippingAddress?.address && (
                <div className="mt-5 border-t border-slate-800 pt-5">
                  <p className="text-xs text-slate-500">
                    Shipping Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {order.shippingAddress.address}
                    {order.shippingAddress.postalCode
                      ? `, ${order.shippingAddress.postalCode}`
                      : ""}
                  </p>
                </div>
              )}
            </section>

            {/* ITEMS */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Items
              </h2>

              {order.items?.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product || "item"}-${index}`}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-slate-600">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-200">
                          {item.name || "Unnamed product"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Qty: {item.quantity || 0}
                        </p>
                      </div>

                      <p className="text-right text-sm font-semibold text-slate-200">
                        {formatMoney(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No items found.
                </p>
              )}
            </section>

            {/* CUSTOMER NOTE */}
            {order.customerNote && (
              <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Customer Note
                </h2>

                <p className="text-sm leading-6 text-slate-300">
                  {order.customerNote}
                </p>
              </section>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* TOTALS */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="text-slate-300">
                    {formatMoney(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="text-slate-300">
                    {formatMoney(order.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Tax
                  </span>

                  <span className="text-slate-300">
                    {formatMoney(order.tax)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="text-slate-300">
                    -{formatMoney(order.discount)}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-white">
                      TOTAL
                    </span>

                    <span className="text-lg font-bold text-white">
                      {formatMoney(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* UPDATE STATUS */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Update Status
              </h2>

              <label
                htmlFor="order-status"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Status
              </label>

              <select
                id="order-status"
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm capitalize text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {capitalize(status)}
                  </option>
                ))}
              </select>

              <label
                htmlFor="admin-note"
                className="mb-2 mt-5 block text-xs font-medium text-slate-400"
              >
                Admin Note
              </label>

              <textarea
                id="admin-note"
                value={adminNote}
                onChange={(event) =>
                  setAdminNote(event.target.value)
                }
                disabled={isUpdating}
                rows={4}
                placeholder="Add an internal note..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {error && (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-300">
                    {error}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* CONFIRM BEFORE PATCH */}
        <ConfirmDialog
          isOpen={showConfirm}
          title="Update Order Status"
          message={`Are you sure you want to mark this order as "${capitalize(
            pendingStatus
          )}"?`}
          confirmText="Update"
          loading={isUpdating}
          onConfirm={handleConfirmStatusChange}
          onCancel={handleCancelStatusChange}
        />
      </div>
    </div>
  );
}