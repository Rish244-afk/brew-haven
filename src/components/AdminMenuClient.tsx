"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Check, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  category: string;
  imageUrl?: string | null;
  available: boolean;
}

export function AdminMenuClient({ initialItems }: { initialItems: MenuItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceDollars: "",
    category: "drinks",
    imageUrl: "",
    available: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      priceDollars: "",
      category: "drinks",
      imageUrl: "",
      available: true,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      priceDollars: (item.price / 100).toFixed(2),
      category: item.category,
      imageUrl: item.imageUrl || "",
      available: item.available,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  // Toggle Availability Switch
  const handleToggleAvailability = async (item: MenuItem) => {
    const newStatus = !item.available;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, available: newStatus } : i))
    );

    try {
      await fetch(`/api/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStatus }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle item availability:", err);
      // revert
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, available: item.available } : i))
      );
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Delete menu item error:", err);
    }
  };

  // Submit Add or Edit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const priceInCents = Math.round(parseFloat(formData.priceDollars) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      setErrorMsg("Please enter a valid price.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: priceInCents,
      category: formData.category,
      imageUrl: formData.imageUrl || null,
      available: formData.available,
    };

    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch(`/api/menu/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update item");
        }

        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      } else {
        // Create new
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create item");
        }

        const created = await res.json();
        setItems((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream font-light">Menu Management</h1>
          <p className="text-xs text-latte/80 font-sans tracking-widest uppercase mt-1">
            CRUD Operations & Item Availability
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="font-sans text-xs tracking-[0.2em] uppercase bg-latte text-dark px-5 py-3 hover:bg-[#e6c88b] transition-all flex items-center gap-2 self-start sm:self-auto font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Menu Table */}
      <div className="bg-espresso border border-latte/20 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-dark text-latte uppercase tracking-wider text-[0.65rem] border-b border-latte/20">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Available</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-latte/10 text-cream/80">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-dark/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <div className="w-12 h-12 relative bg-dark shrink-0 overflow-hidden border border-latte/20">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-dark shrink-0 flex items-center justify-center border border-latte/20 text-cream/40">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-serif text-lg text-cream leading-tight">{item.name}</p>
                      <p className="text-[0.65rem] text-cream/50 line-clamp-1 max-w-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4 uppercase tracking-wider text-[0.65rem] text-latte">
                  {item.category}
                </td>

                <td className="p-4 font-mono text-sm text-cream">
                  ${(item.price / 100).toFixed(2)}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1 text-[0.65rem] uppercase tracking-wider font-semibold border transition-all ${
                      item.available
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/40"
                        : "bg-red-950/40 text-red-400 border-red-500/40"
                    }`}
                  >
                    {item.available ? "Available" : "Sold Out"}
                  </button>
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-cream/70 hover:text-latte transition-colors"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-cream/40 hover:text-red-400 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-[#2A1F14] border border-latte/30 shadow-2xl max-w-lg w-full p-6 md:p-8 text-cream space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-latte/20">
              <h2 className="font-serif text-2xl">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream/50 hover:text-cream"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 border border-red-500/30 p-2 bg-red-950/30 font-sans">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-latte mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom Cortado"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark border border-latte/30 p-2.5 text-cream focus:outline-none focus:border-latte"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-latte mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="4.75"
                    value={formData.priceDollars}
                    onChange={(e) => setFormData({ ...formData, priceDollars: e.target.value })}
                    className="w-full bg-dark border border-latte/30 p-2.5 text-cream font-mono focus:outline-none focus:border-latte"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-latte mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-dark border border-latte/30 p-2.5 text-cream focus:outline-none focus:border-latte"
                  >
                    <option value="drinks">Drinks</option>
                    <option value="food">Food</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-latte mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Single-origin espresso, steamed milk, a whisper of cardamom."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-dark border border-latte/30 p-2.5 text-cream focus:outline-none focus:border-latte"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-latte mb-1">
                  Image URL (Unsplash or hosted asset)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-dark border border-latte/30 p-2.5 text-cream focus:outline-none focus:border-latte"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="accent-latte w-4 h-4"
                />
                <label htmlFor="available" className="text-xs text-cream cursor-pointer">
                  Available for ordering
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-cream/20 text-cream/70 hover:text-cream text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-latte text-dark font-medium text-xs uppercase tracking-wider hover:bg-[#e6c88b]"
                >
                  {isSubmitting ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
