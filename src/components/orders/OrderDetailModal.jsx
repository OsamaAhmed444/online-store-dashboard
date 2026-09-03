import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";

import { getOrder } from "../../api/orders";
import api from "../../api/axios";

// These are the statuses currently supported by the orders API.
// Keeping them here makes the dropdown easier to maintain.
const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

// Format all order amounts in the same way.
// API values can be missing, so we fall back to zero.
const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EGP`;
};

// Use one date format across the modal instead of formatting
// dates directly inside the JSX.
const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// API values are lowercase, but we want a cleaner label in the UI.
const capitalize = (value) => {
  if (!value) return "—";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

// Return the badge style based on the current order status.
// Unknown values use the pending/default style.
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

// Payment status has its own badge colors since it is separate
// from the order fulfillment status.
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

export default function OrderDetailModal({
  isOpen,
  orderId,
  onClose,
}) {
  // Main order data and GET request states.
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // selectedStatus controls what the dropdown displays.
  // pendingStatus keeps the new value until the user confirms it.
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);

  // Admin note is kept locally and sent with the status update.
  const [adminNote, setAdminNote] = useState("");

  // The confirmation dialog and PATCH request need their own states.
  // This keeps the initial GET loading separate from the update loading.
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load the order whenever the modal opens with a valid order ID.
  // It also runs again if the user opens another order.
  useEffect(() => {
    if (!isOpen || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        // Clear the previous order so we do not show old details
        // while the next order is being loaded.
        setOrder(null);

        const response = await getOrder(orderId);
        const fetchedOrder = response.data?.order;

        // A successful request should always contain an order object.
        // Treat a missing object as an error instead of rendering bad data.
        if (!fetchedOrder) {
          throw new Error(
            "Order was not found in the API response."
          );
        }

        setOrder(fetchedOrder);

        // Start the editable fields with the latest server values.
        setSelectedStatus(fetchedOrder.status || "");
        setAdminNote(fetchedOrder.adminNote || "");
      } catch (err) {
        console.error("Failed to fetch order:", err);

        // Prefer the backend message when available.
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
  }, [isOpen, orderId]);

  // Changing the dropdown should not update the order immediately.
  // We keep the new value pending and ask for confirmation first.
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    // There is nothing to update if the selected value
    // is already the status saved on the order.
    if (newStatus === order?.status) {
      setSelectedStatus(order.status);
      setPendingStatus(null);
      setShowConfirm(false);
      return;
    }

    // Update the dropdown locally, but do not call the API yet.
    setSelectedStatus(newStatus);
    setPendingStatus(newStatus);

    // The actual PATCH request happens only after confirmation.
    setShowConfirm(true);
  };

  // If the user cancels, restore the dropdown to the last
  // status received from the server.
  const handleCancelStatusChange = () => {
    setSelectedStatus(order?.status || "");
    setPendingStatus(null);
    setShowConfirm(false);
  };

  // This is the only place where we persist a status change.
  // It runs after the user clicks Update in the confirmation dialog.
  const handleConfirmStatusChange = async () => {
    if (!order || !pendingStatus) return;

    try {
      setIsUpdating(true);
      setError("");

      // Send both values together so the admin note can be stored
      // with the status update when one has been entered.
      const response = await api.patch(
        `/orders/admin/${order._id}/status`,
        {
          status: pendingStatus,
          adminNote,
        }
      );

      const updatedOrder = response.data?.order;

      // The update response should contain the latest order.
      // We use it directly instead of making another GET request.
      if (!updatedOrder) {
        throw new Error(
          "Updated order was not found in the API response."
        );
      }

      // Keep local state in sync with what the server returned.
      setOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);

      // Keep the typed note if the response does not return one.
      setAdminNote(updatedOrder.adminNote || adminNote);

      // The pending value is no longer needed after a successful update.
      setPendingStatus(null);
      setShowConfirm(false);

      toast.success(
        response.data?.message ||
          "Order status updated successfully."
      );
    } catch (err) {
      console.error("Failed to update order status:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status.";

      // The server update failed, so the persisted order status
      // is still the source of truth for the dropdown.
      setSelectedStatus(order.status);

      setPendingStatus(null);
      setShowConfirm(false);

      // Keep an inline error for context and a toast for feedback.
      setError(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset temporary status state before closing the modal.
  // Closing is disabled while PATCH is still running.
  const handleClose = () => {
    if (isUpdating) return;

    setSelectedStatus(order?.status || "");
    setPendingStatus(null);
    setShowConfirm(false);
    setError("");

    onClose();
  };

  // A shorter ID is easier to scan in the modal header
  // while the full ID is still used for API requests.
  const shortOrderId = order?._id
    ?.slice(-8)
    .toUpperCase();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="!max-w-[460px] !rounded-xl !border !border-slate-800 !bg-slate-950 !text-slate-100 sm:ml-auto sm:mr-0"
      >
        {/* Show a local loading state while fetching this order */}
        {loading && (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-slate-200" />

              <p className="mt-4 text-sm text-slate-400">
                Loading order details...
              </p>
            </div>
          </div>
        )}

        {/* Initial fetch error - there is no order to display yet */}
        {!loading && error && !order && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Render the details only after the order has loaded */}
        {!loading && order && (
          <div className="space-y-5">
            {/* Order header and current statuses */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Order Detail
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    #{shortOrderId}
                  </h2>
                </div>

                {/* Payment method is shown separately from payment status */}
                <p className="text-sm font-semibold text-slate-300">
                  {capitalize(order.paymentMethod)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Current fulfillment status */}
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {capitalize(order.status)}
                </span>

                {/* Current payment status */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getPaymentStatusClasses(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus || "pending"}
                </span>
              </div>
            </div>

            {/* Basic customer and shipping information */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Info
              </h3>

              <div className="space-y-4">
                {/* Order creation date */}
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Date
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Customer name comes from the shipping address */}
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Customer
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {order.shippingAddress?.fullName || "—"}
                  </span>
                </div>

                {/* Contact number used for delivery */}
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Phone
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {order.shippingAddress?.phone || "—"}
                  </span>
                </div>

                {/* Keep the compact modal address short */}
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Ship to
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {[
                      order.shippingAddress?.city,
                      order.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Products included in the order */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Items
              </h3>

              {order.items?.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product || "item"}-${index}`}
                      className="flex items-center gap-3"
                    >
                      {/* Product thumbnail with a fallback for missing images */}
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-slate-600">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product name and quantity */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-5 text-slate-200">
                          {item.name || "Unnamed product"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Qty: {item.quantity || 0}
                        </p>
                      </div>

                      {/* Unit price returned with the order item */}
                      <p className="text-right text-xs font-semibold text-slate-200">
                        {formatMoney(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Keep an empty state here in case an order has no items
                <p className="text-sm text-slate-500">
                  No items found.
                </p>
              )}
            </section>

            {/* Order price breakdown */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="text-slate-300">
                    {formatMoney(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="text-slate-300">
                    {formatMoney(order.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tax
                  </span>

                  <span className="text-slate-300">
                    {formatMoney(order.tax)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="text-slate-300">
                    -{formatMoney(order.discount)}
                  </span>
                </div>

                {/* Keep the final total visually separated from other amounts */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      TOTAL
                    </span>

                    <span className="text-base font-bold text-white">
                      {formatMoney(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Status can be selected here, but it is not saved immediately */}
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Update Status
              </h3>

              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm capitalize text-slate-100 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
            </section>

            {/* Internal note that will be sent with the status update */}
            <section>
              <label
                htmlFor="modal-admin-note"
                className="mb-3 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
              >
                Admin Note
              </label>

              <textarea
                id="modal-admin-note"
                value={adminNote}
                onChange={(event) =>
                  setAdminNote(event.target.value)
                }
                disabled={isUpdating}
                rows={3}
                placeholder="Add an internal note..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </section>

            {/* PATCH errors stay visible without removing the order details */}
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Always confirm before persisting the selected status */}
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
    </>
  );
}