"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string | Date;
  items: OrderItem[];
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream font-light">Customer Orders</h1>
          <p className="text-xs text-latte/80 font-sans tracking-widest uppercase mt-1">
            Order Fulfillment & Status Updates
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 text-xs font-sans">
          {["all", "pending", "paid", "fulfilled", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 uppercase tracking-wider border transition-all ${
                statusFilter === st
                  ? "bg-latte text-dark border-latte font-medium"
                  : "border-latte/20 text-cream/70 hover:text-cream"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-espresso p-12 text-center border border-latte/20 text-cream/60">
          <p className="font-serif text-2xl">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-espresso border border-latte/20 shadow-lg p-6 space-y-4 font-sans text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-latte/15">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl text-cream font-normal">
                      {order.customerName}
                    </span>
                    <span className="text-[0.65rem] font-mono text-latte">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-cream/50 text-[0.7rem]">{order.customerEmail}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xl text-latte font-bold">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`bg-dark border px-3 py-1.5 uppercase tracking-wider text-[0.65rem] font-semibold focus:outline-none ${
                      order.status === "paid"
                        ? "border-emerald-500/50 text-emerald-400"
                        : order.status === "fulfilled"
                        ? "border-blue-500/50 text-blue-400"
                        : order.status === "cancelled"
                        ? "border-red-500/50 text-red-400"
                        : "border-amber-500/50 text-amber-400"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-dark/40 p-4 border border-latte/10">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-cream/80">
                      {item.name} <strong className="text-latte">x{item.quantity}</strong>
                    </span>
                    <span className="font-mono text-cream/60">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[0.65rem] text-cream/40 text-right">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
