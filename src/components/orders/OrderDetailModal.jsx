import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";

import { getOrder } from "../../api/orders";
import api from "../../api/axios";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EGP`;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const capitalize = (value) => {
  if (!value) return "—";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

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

export default function OrderDetailModal({
  isOpen,
  orderId,
  onClose,
}) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);

  const [adminNote, setAdminNote] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        setOrder(null);

        const response = await getOrder(orderId);
        const fetchedOrder = response.data?.order;

        if (!fetchedOrder) {
          throw new Error(
            "Order was not found in the API response."
          );
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
  }, [isOpen, orderId]);

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    if (newStatus === order?.status) {
      setSelectedStatus(order.status);
      setPendingStatus(null);
      setShowConfirm(false);
      return;
    }

    setSelectedStatus(newStatus);
    setPendingStatus(newStatus);

    setShowConfirm(true);
  };

  const handleCancelStatusChange = () => {
    setSelectedStatus(order?.status || "");
    setPendingStatus(null);
    setShowConfirm(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!order || !pendingStatus) return;

    try {
      setIsUpdating(true);
      setError("");

      const response = await api.patch(
        `/orders/admin/${order._id}/status`,
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
      console.error("Failed to update order status:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status.";

      setSelectedStatus(order.status);

      setPendingStatus(null);
      setShowConfirm(false);

      setError(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (isUpdating) return;

    setSelectedStatus(order?.status || "");
    setPendingStatus(null);
    setShowConfirm(false);
    setError("");

    onClose();
  };

  const shortOrderId = order?._id
    ?.slice(-8)
    .toUpperCase();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="order-detail-modal !max-w-[460px] !rounded-xl !border !border-slate-800 !bg-slate-950 !text-slate-100 sm:ml-auto sm:mr-0"
      >
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

        {!loading && error && !order && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-5">
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

                <p className="text-sm font-semibold text-slate-300">
                  {capitalize(order.paymentMethod)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {capitalize(order.status)}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getPaymentStatusClasses(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus || "pending"}
                </span>
              </div>
            </div>

            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Info
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Date
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Customer
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {order.shippingAddress?.fullName || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Phone
                  </span>

                  <span className="text-right text-sm font-medium text-slate-200">
                    {order.shippingAddress?.phone || "—"}
                  </span>
                </div>

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

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-5 text-slate-200">
                          {item.name || "Unnamed product"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Qty: {item.quantity || 0}
                        </p>
                      </div>

                      <p className="text-right text-xs font-semibold text-slate-200">
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