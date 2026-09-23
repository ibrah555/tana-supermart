"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Layers, Plus, FolderTree, Tag, CheckCircle2 } from "lucide-react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { categories, addCategory, products } = useAdmin();
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const getProductCount = (slug: string) => {
    return products.filter((p) => p.categorySlug === slug || p.subCategorySlug === slug).length;
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;

    if (selectedParentId) {
      // Add as subcategory to existing category
      const target = categories.find((c) => c.id === selectedParentId);
      if (target) {
        const sub: Category = {
          id: `sub-${Date.now()}`,
          name: newCatName,
          slug: newCatSlug,
        };
        if (!target.children) target.children = [];
        target.children.push(sub);
      }
    } else {
      // Add as top-level category
      const created: Category = {
        id: `cat-${Date.now()}`,
        name: newCatName,
        slug: newCatSlug,
        children: [],
      };
      addCategory(created);
    }

    setIsSuccess(true);
    setNewCatName("");
    setNewCatSlug("");
    setSelectedParentId("");
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Category Taxonomy & Subcategories
          </h2>
          <p className="text-xs text-slate-500">
            Structure departments, navigation hierarchies, and catalog slugs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Tree Table - 2 Cols */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-[#24dcac]" />
              Active Categories & Sub-Taxonomies ({categories.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Kenya Marketplace
            </span>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border border-slate-200 rounded p-3 bg-slate-50/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#24dcac]" />
                    <span className="font-bold text-xs text-slate-900">{cat.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      /category/{cat.slug}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    {getProductCount(cat.slug)} products
                  </span>
                </div>

                {cat.children && cat.children.length > 0 && (
                  <div className="mt-2.5 pl-4 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {cat.children.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-800"
                      >
                        <Tag className="h-2.5 w-2.5 text-slate-400" />
                        {sub.name}
                        <span className="text-[9px] text-slate-400 font-mono">({sub.slug})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Form - 1 Col */}
        <div className="bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#24dcac]" />
            Add Category / Subcategory
          </h3>

          {isSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Category created successfully!
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Parent Category (Optional)
              </label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
              >
                <option value="">None (Create as Top-Level Category)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    Subcategory of: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Solar & Backup Power"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (!newCatSlug) {
                    setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                placeholder="e.g. solar-power"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-xs text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors mt-2"
            >
              Add to Taxonomy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
