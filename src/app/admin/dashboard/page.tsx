import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, Calendar, MessageSquare, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard — Brew Haven",
};

export const revalidate = 0; // Always fresh for admin dashboard

export default async function AdminDashboardPage() {
  let totalRevenueCents = 0;
  let totalOrdersCount = 0;
  let pendingOrdersCount = 0;
  let todayReservationsCount = 0;
  let unreadMessagesCount = 0;

  let recentOrders: any[] = [];
  let recentReservations: any[] = [];

  try {
    // 1. Revenue
    const paidOrders = await prisma.order.findMany({
      where: { status: { in: ["paid", "fulfilled"] } },
      select: { totalAmount: true },
    });
    totalRevenueCents = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 2. Orders Stats
    totalOrdersCount = await prisma.order.count();
    pendingOrdersCount = await prisma.order.count({ where: { status: "pending" } });

    // 3. Today's Reservations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    todayReservationsCount = await prisma.reservation.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // 4. Messages
    unreadMessagesCount = await prisma.contactMessage.count({
      where: { isRead: false },
    });

    // Recent lists
    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    recentReservations = await prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Dashboard metrics load error:", error);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl text-cream font-light">Dashboard Overview</h1>
        <p className="text-xs text-latte/80 font-sans tracking-widest uppercase mt-1">
          Real-time Operations & Metrics
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-espresso p-6 border border-latte/20 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-latte">
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/60">
              Total Revenue
            </span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="font-mono text-3xl text-cream font-bold">
            ${(totalRevenueCents / 100).toFixed(2)}
          </div>
          <p className="text-[0.65rem] text-cream/40 font-mono">From paid & fulfilled orders</p>
        </div>

        {/* Orders Count */}
        <div className="bg-espresso p-6 border border-latte/20 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-latte">
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/60">
              Orders
            </span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="font-mono text-3xl text-cream font-bold">{totalOrdersCount}</div>
          <p className="text-[0.65rem] text-latte font-mono">{pendingOrdersCount} pending fulfillment</p>
        </div>

        {/* Today's Reservations */}
        <div className="bg-espresso p-6 border border-latte/20 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-latte">
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/60">
              Today's Bookings
            </span>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="font-mono text-3xl text-cream font-bold">{todayReservationsCount}</div>
          <p className="text-[0.65rem] text-cream/40 font-mono">For today's service</p>
        </div>

        {/* Unread Messages */}
        <div className="bg-espresso p-6 border border-latte/20 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-latte">
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/60">
              Unread Messages
            </span>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="font-mono text-3xl text-cream font-bold">{unreadMessagesCount}</div>
          <p className="text-[0.65rem] text-cream/40 font-mono">Requires concierge response</p>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-espresso p-6 border border-latte/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-latte/15">
            <h2 className="font-serif text-2xl text-cream">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-latte hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-cream/50 py-4">No recent orders found.</p>
          ) : (
            <div className="divide-y divide-latte/10 text-xs">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-cream">{order.customerName}</p>
                    <p className="text-cream/50 text-[0.65rem] font-mono">
                      #{order.id.slice(-6).toUpperCase()} · {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-latte font-bold">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </span>
                    <span
                      className={`block text-[0.6rem] uppercase tracking-wider font-semibold ${
                        order.status === "paid"
                          ? "text-emerald-400"
                          : order.status === "fulfilled"
                          ? "text-blue-400"
                          : "text-amber-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reservations */}
        <div className="bg-espresso p-6 border border-latte/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-latte/15">
            <h2 className="font-serif text-2xl text-cream">Recent Reservations</h2>
            <Link
              href="/admin/reservations"
              className="text-xs text-latte hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReservations.length === 0 ? (
            <p className="text-xs text-cream/50 py-4">No recent reservations found.</p>
          ) : (
            <div className="divide-y divide-latte/10 text-xs">
              {recentReservations.map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-cream">{res.name}</p>
                    <p className="text-cream/50 text-[0.65rem]">
                      {new Date(res.date).toLocaleDateString()} at {res.time} ({res.partySize} guests)
                    </p>
                  </div>
                  <span
                    className={`text-[0.65rem] uppercase tracking-wider px-2 py-0.5 border ${
                      res.status === "confirmed"
                        ? "border-emerald-500/40 text-emerald-400"
                        : res.status === "cancelled"
                        ? "border-red-500/40 text-red-400"
                        : "border-amber-500/40 text-amber-400"
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
