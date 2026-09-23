"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  ShoppingBag,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Boxes,
  Minus,
} from "lucide-react";
import type { Product } from "@/types";

export default function AdminCatalogPage() {
  const {
    products,
    updateProductStockQuantity,
    adjustProductStock,
    updateProductPrice,
    toggleFlashSale,
    addProduct,
    deleteProduct,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempCost, setTempCost] = useState<number>(0);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    categorySlug: "phones-accessories",
    subCategorySlug: "smartphones",
    storeId: "tana-direct",
    price: 1999,
    originalPrice: 2499,
    costPrice: 1200,
    stockQuantity: 25,
    lowStockThreshold: 10,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 12,
    inStock: true,
    shippedFrom: "platform",
    fulfilledByPlatform: true,
  });

  // Calculate stock metrics
  const totalItems = products.length;
  const outOfStockItems = products.filter((p) => (p.stockQuantity ?? 0) === 0);
  const lowStockItems = products.filter((p) => {
    const qty = p.stockQuantity ?? 0;
    const threshold = p.lowStockThreshold ?? 10;
    return qty > 0 && qty <= threshold;
  });
  const inStockItems = products.filter((p) => {
    const qty = p.stockQuantity ?? 0;
    const threshold = p.lowStockThreshold ?? 10;
    return qty > threshold;
  });
  const totalValuation = products.reduce((acc, p) => acc + (p.price * (p.stockQuantity ?? 0)), 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categorySlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.categorySlug === categoryFilter;

    const qty = p.stockQuantity ?? 0;
    const threshold = p.lowStockThreshold ?? 10;
    let matchesStock = true;
    if (stockFilter === "IN_STOCK") matchesStock = qty > threshold;
    if (stockFilter === "LOW_STOCK") matchesStock = qty > 0 && qty <= threshold;
    if (stockFilter === "OUT_OF_STOCK") matchesStock = qty === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleSavePrice = (id: string) => {
    if (tempPrice > 0) {
      updateProductPrice(id, tempPrice, undefined, tempCost > 0 ? tempCost : undefined);
    }
    setEditingPriceId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const qty = Number(newProduct.stockQuantity ?? 10);
    const created: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      categorySlug: newProduct.categorySlug || "phones-accessories",
      subCategorySlug: newProduct.subCategorySlug || "smartphones",
      storeId: newProduct.storeId || "tana-direct",
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      costPrice: newProduct.costPrice ? Number(newProduct.costPrice) : Math.round(Number(newProduct.price) * 0.65),
      stockQuantity: qty,
      lowStockThreshold: 10,
      inStock: qty > 0,
      image: newProduct.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      rating: 5.0,
      reviews: 1,
      fulfilledByPlatform: true,
    };
    addProduct(created);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      categorySlug: "phones-accessories",
      price: 1999,
      costPrice: 1200,
      stockQuantity: 25,
      storeId: "tana-direct",
      inStock: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Stock Control & Inventory Master
          </h2>
          <p className="text-xs text-slate-500">
            Real-time automated stock tracking showing units remaining and threshold alerts
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Inventory SKU
        </button>
      </div>

      {/* Stock Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Total Catalog SKUs</span>
            <Boxes className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{totalItems} SKUs</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Valuation: <span className="font-semibold text-slate-800">KES {totalValuation.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Healthy Stock</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{inStockItems.length}</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">Over 10 units available</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Low Stock Alert</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-700">{lowStockItems.length}</div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">1 - 10 units left (restock soon)</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Out of Stock</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-rose-700">{outOfStockItems.length}</div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">0 units left (hidden on store)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white border border-slate-200 rounded p-3">
        <div className="md:col-span-2 flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, SKU, category, or vendor store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-900 bg-transparent focus:outline-none"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="phones-accessories">Phones & Accessories</option>
            <option value="electronics">Electronics & TV</option>
            <option value="appliances">Appliances & Home</option>
            <option value="fashion">Fashion & Shoes</option>
            <option value="supermarket">Supermarket & Groceries</option>
          </select>
        </div>

        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none"
          >
            <option value="ALL">All Stock Levels</option>
            <option value="IN_STOCK">Healthy Stock (&gt;10 units)</option>
            <option value="LOW_STOCK">Low Stock (1-10 units left)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Catalog & Inventory Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category & Store</th>
                <th className="py-3 px-4">Selling & Cost (KES)</th>
                <th className="py-3 px-4 text-center">Units Left & Control</th>
                <th className="py-3 px-4 text-center">Automatic Status</th>
                <th className="py-3 px-4 text-center">Flash Deal</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const qty = product.stockQuantity ?? 0;
                const threshold = product.lowStockThreshold ?? 10;
                const isOutOfStock = qty === 0;
                const isLowStock = qty > 0 && qty <= threshold;
                const cost = product.costPrice ?? Math.round(product.price * 0.65);
                const margin = Math.round(((product.price - cost) / product.price) * 100);

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            SKU: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 capitalize">
                        {product.subCategorySlug || product.categorySlug}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Store: <span className="font-semibold text-slate-700">{product.storeId}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {editingPriceId === product.id ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">Price:</span>
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">Cost:</span>
                            <input
                              type="number"
                              value={tempCost}
                              onChange={(e) => setTempCost(Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs"
                            />
                            <button
                              onClick={() => handleSavePrice(product.id)}
                              className="px-1.5 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900">
                              KES {product.price.toLocaleString()}
                            </span>
                            <button
                              onClick={() => {
                                setEditingPriceId(product.id);
                                setTempPrice(product.price);
                                setTempCost(cost);
                              }}
                              className="text-slate-400 hover:text-slate-700"
                              title="Edit price & cost"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Cost: KES {cost.toLocaleString()} •{" "}
                            <span className="text-emerald-700 font-semibold">{margin}% margin</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Stock Quantity Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded p-1">
                        <button
                          onClick={() => adjustProductStock(product.id, -1)}
                          disabled={qty <= 0}
                          className="h-6 w-6 flex items-center justify-center rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 disabled:opacity-40"
                          title="Decrease 1 unit"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => updateProductStockQuantity(product.id, Number(e.target.value))}
                          className="w-14 text-center font-mono font-bold text-xs bg-white border border-slate-300 rounded py-0.5 text-slate-900"
                        />

                        <button
                          onClick={() => adjustProductStock(product.id, 1)}
                          className="h-6 w-6 flex items-center justify-center rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700"
                          title="Add 1 unit"
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => adjustProductStock(product.id, 5)}
                          className="px-1.5 h-6 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-800"
                          title="Restock +5 units"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    {/* Automated Status Indicator */}
                    <td className="py-3 px-4 text-center">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                          <XCircle className="h-3 w-3" />
                          Out of Stock (0 units)
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock ({qty} left)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          In Stock ({qty} units)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFlashSale(product.id, !product.isFlashSale, 25)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          product.isFlashSale
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <Zap className={`h-3 w-3 ${product.isFlashSale ? "text-amber-600 fill-amber-600" : ""}`} />
                        {product.isFlashSale ? "Flash Deal" : "Normal"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Add Inventory SKU to Supermart
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Xiaomi Smart Band 9 - Glacier Silver"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Selling Price (KES)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Cost / COGS (KES)
                  </label>
                  <input
                    type="number"
                    value={newProduct.costPrice || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Initial Units
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Parent Category
                  </label>
                  <select
                    value={newProduct.categorySlug}
                    onChange={(e) => setNewProduct({ ...newProduct, categorySlug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    <option value="phones-accessories">Phones & Accessories</option>
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Appliances</option>
                    <option value="fashion">Fashion & Shoes</option>
                    <option value="supermarket">Supermarket</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Vendor Store
                  </label>
                  <select
                    value={newProduct.storeId}
                    onChange={(e) => setNewProduct({ ...newProduct, storeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    <option value="tana-direct">Tana Direct (Official)</option>
                    <option value="uphui">Uphui Kenya</option>
                    <option value="joyous-household">Joyous Household</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors"
                >
                  Save & Track Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
