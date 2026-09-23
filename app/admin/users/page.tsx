"use client";

import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Mail,
  Phone,
  Calendar,
  Lock,
  Trash2,
} from "lucide-react";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const { users, updateUserRole, updateUserStatus, addUser, deleteUser } = useAdmin();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "+254 ",
    role: "CUSTOMER",
    status: "Active",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "ALL" || (u.role && u.role === roleFilter);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created: User = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "+254 700 000 000",
      role: newUser.role || "CUSTOMER",
      status: newUser.status || "Active",
      createdAt: new Date().toISOString().split("T")[0],
      ordersCount: 0,
      totalSpent: 0,
      defaultAddress: {
        fullName: newUser.name,
        phone: newUser.phone || "+254 700 000 000",
        addressLines: ["CBD"],
        city: "Nairobi",
        county: "Nairobi",
      },
    };

    addUser(created);
    setIsAddUserModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "+254 ",
      role: "CUSTOMER",
      status: "Active",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            User Management & Role Assignments
          </h2>
          <p className="text-xs text-slate-500">
            Control Role-Based Access Control (RBAC), credentials, and account statuses
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Create Platform User
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Total Registered Users</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{users.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Across 47 Kenyan Counties
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Platform Administrators</div>
          <div className="mt-1 text-2xl font-bold text-indigo-700">
            {users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "OPERATIONS" || u.role === "FINANCE").length}
          </div>
          <div className="mt-1 text-[11px] text-indigo-700 font-medium">
            Staff with elevated access
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Approved Store Vendors</div>
          <div className="mt-1 text-2xl font-bold text-[#189e7c]">
            {users.filter((u) => u.role === "VENDOR").length}
          </div>
          <div className="mt-1 text-[11px] text-[#189e7c] font-medium">
            Authorized merchant accounts
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Active Customers</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {users.filter((u) => u.role === "CUSTOMER" && u.status === "Active").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {users.filter((u) => u.status === "Suspended" || u.status === "Flagged").length} suspended/flagged
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border border-slate-200 rounded p-3">
        <div className="md:col-span-2 flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or Kenyan phone number (+254)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-900 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="OPERATIONS">Operations & Logistics</option>
            <option value="FINANCE">Finance & Accounting</option>
            <option value="VENDOR">Store Vendor</option>
            <option value="CUSTOMER">Customer / Shopper</option>
          </select>
        </div>
      </div>

      {/* Users & Roles Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Assigned Role (RBAC)</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Order History & Spend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 text-xs">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{user.phone}</span>
                    </div>
                  </td>

                  {/* Role Assignment Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={user.role || "CUSTOMER"}
                      onChange={(e) => updateUserRole(user.id, e.target.value as User["role"])}
                      className={`text-[11px] font-bold uppercase rounded px-2.5 py-1 border focus:outline-none cursor-pointer ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-slate-900 text-white border-slate-900"
                          : user.role === "OPERATIONS"
                          ? "bg-indigo-50 text-indigo-800 border-indigo-300"
                          : user.role === "FINANCE"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : user.role === "VENDOR"
                          ? "bg-amber-50 text-amber-900 border-amber-300"
                          : "bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="OPERATIONS">Operations</option>
                      <option value="FINANCE">Finance</option>
                      <option value="VENDOR">Store Vendor</option>
                      <option value="CUSTOMER">Customer</option>
                    </select>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={user.status || "Active"}
                      onChange={(e) => updateUserStatus(user.id, e.target.value as User["status"])}
                      className={`text-[11px] font-bold uppercase rounded px-2 py-1 border focus:outline-none cursor-pointer ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : user.status === "Flagged"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-rose-50 text-rose-800 border-rose-300"
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Flagged">Flagged</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {user.createdAt || "2026-01-01"}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      KES {(user.totalSpent || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {user.ordersCount || 0} order(s) placed
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={user.role === "SUPER_ADMIN"}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                      title={user.role === "SUPER_ADMIN" ? "Cannot delete Master Admin" : "Delete user"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#24dcac]" />
                Create New Platform User
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Mwangi"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. s.mwangi@tanasupermart.co.ke"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Phone Number (Kenya +254)
                </label>
                <input
                  type="text"
                  required
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    System Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-bold"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="VENDOR">Store Vendor</option>
                    <option value="OPERATIONS">Operations</option>
                    <option value="FINANCE">Finance</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User["status"] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Flagged">Flagged</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors"
                >
                  Create & Grant Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
