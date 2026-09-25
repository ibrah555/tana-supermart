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
  Lock,
  Trash2,
  Briefcase,
  Key,
  ShieldAlert,
  ShoppingBag,
  Clock,
} from "lucide-react";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const { users, updateUserRole, updateUserStatus, addUser, deleteUser } = useAdmin();
  
  // Navigation Tabs: "staff" (Staff & Team Permissions) vs "customers" (Customer Directory)
  const [activeTab, setActiveTab] = useState<"staff" | "customers">("staff");
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // New Staff Member Form State
  const [newStaff, setNewStaff] = useState<{
    name: string;
    email: string;
    phone: string;
    role: "OPERATIONS" | "FINANCE" | "SUPER_ADMIN";
    assignedTask: string;
    password: string;
  }>({
    name: "",
    email: "",
    phone: "+254 ",
    role: "OPERATIONS",
    assignedTask: "Order Fulfillment & Courier Dispatch",
    password: "Staff@" + new Date().getFullYear() + "!",
  });

  // Separate staff from regular shoppers
  const staffMembers = useMemo(() => {
    return (users || []).filter(
      (u) => u && (u.role === "SUPER_ADMIN" || u.role === "OPERATIONS" || u.role === "FINANCE")
    );
  }, [users]);

  const customersList = useMemo(() => {
    return (users || []).filter((u) => u && (u.role === "CUSTOMER" || u.role === "VENDOR"));
  }, [users]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffMembers.filter((s) => {
      const matchesRole = staffRoleFilter === "ALL" || s.role === staffRoleFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.phone || "").includes(q);
      return matchesRole && matchesSearch;
    });
  }, [staffMembers, staffRoleFilter, searchQuery]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q)
      );
    });
  }, [customersList, searchQuery]);

  // Role task descriptions
  const getRoleResponsibilities = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return {
          title: "Executive Super Admin",
          task: "Full platform governance, RBAC role management, system presets & database access",
          badgeColor: "bg-slate-900 text-white",
        };
      case "OPERATIONS":
        return {
          title: "Operations & Logistics",
          task: "Order fulfillment, courier assignment (Sendy, Fargo, G4S), stock level verification",
          badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "FINANCE":
        return {
          title: "Finance & Accounting",
          task: "M-PESA Daraja reconciliation, transaction audit, merchant commissions, accounting reports",
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      default:
        return {
          title: "Staff Member",
          task: "Assigned internal administrative duties",
          badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const created: User = {
      id: `staff_${Date.now()}`,
      name: newStaff.name.trim(),
      email: newStaff.email.toLowerCase().trim(),
      phone: newStaff.phone.trim() || "+254 700 000 000",
      role: newStaff.role,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      ordersCount: 0,
      totalSpent: 0,
      defaultAddress: {
        fullName: newStaff.name,
        phone: newStaff.phone || "+254 700 000 000",
        addressLines: ["HQ Office"],
        city: "Nairobi",
        county: "Nairobi",
      },
    };

    addUser(created);
    setIsAddStaffModalOpen(false);
    setNewStaff({
      name: "",
      email: "",
      phone: "+254 ",
      role: "OPERATIONS",
      assignedTask: "Order Fulfillment & Courier Dispatch",
      password: "Staff@" + new Date().getFullYear() + "!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Staff & Access Permissions
          </h2>
          <p className="text-xs text-slate-500">
            Manage internal employees, assign operational duties, and control role permissions
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors"
        >
          <UserPlus className="h-4 w-4 text-[#24dcac]" />
          Add Staff Member
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Staff Members</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{staffMembers.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Internal team with platform access
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Operations & Logistics</span>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-blue-700">
            {staffMembers.filter((s) => s.role === "OPERATIONS").length} Officers
          </div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">
            Handling order fulfillment & couriers
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Finance & Audit</span>
            <Lock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-700">
            {staffMembers.filter((s) => s.role === "FINANCE").length} Accountants
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            Handling M-PESA & merchant payouts
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Registered Shoppers</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {customersList.length} Customers
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Buyer accounts directory
          </div>
        </div>
      </div>

      {/* Segmented View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab("staff");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded transition-colors ${
            activeTab === "staff"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-[#24dcac]" />
          <span>Staff & Internal Team ({staffMembers.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("customers");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded transition-colors ${
            activeTab === "customers"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Customer Directory ({customersList.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border border-slate-200 rounded p-3">
        <div className="md:col-span-2 flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === "staff"
                ? "Search staff by name, email, or phone (+254)..."
                : "Search customers by name, phone, or email..."
            }
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

        {activeTab === "staff" ? (
          <div>
            <select
              value={staffRoleFilter}
              onChange={(e) => setStaffRoleFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="ALL">All Staff Roles</option>
              <option value="SUPER_ADMIN">Super Admins</option>
              <option value="OPERATIONS">Operations Officers</option>
              <option value="FINANCE">Finance Accountants</option>
            </select>
          </div>
        ) : (
          <div className="text-right flex items-center justify-end text-xs text-slate-500 font-medium">
            Total {filteredCustomers.length} registered customers
          </div>
        )}
      </div>

      {/* TAB 1: Staff & Team Permissions Table */}
      {activeTab === "staff" && (
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role & Department</th>
                  <th className="py-3 px-4">Specific Assigned Tasks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => {
                  const info = getRoleResponsibilities(staff.role);
                  return (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {staff.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{staff.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{staff.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={staff.role || "OPERATIONS"}
                          onChange={(e) =>
                            updateUserRole(staff.id, e.target.value as User["role"])
                          }
                          className={`text-[11px] font-bold uppercase rounded px-2.5 py-1 border focus:outline-none cursor-pointer ${
                            staff.role === "SUPER_ADMIN"
                              ? "bg-slate-900 text-white border-slate-900"
                              : staff.role === "OPERATIONS"
                              ? "bg-blue-50 text-blue-900 border-blue-300"
                              : "bg-emerald-50 text-emerald-900 border-emerald-300"
                          }`}
                        >
                          <option value="SUPER_ADMIN">SUPER ADMIN</option>
                          <option value="OPERATIONS">OPERATIONS</option>
                          <option value="FINANCE">FINANCE</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {info.title}
                        </div>
                        <div className="text-[11px] text-slate-500 max-w-md mt-0.5 leading-relaxed">
                          {info.task}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            staff.status === "Active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {staff.status === "Active" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {staff.status || "Active"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              updateUserStatus(
                                staff.id,
                                staff.status === "Active" ? "Suspended" : "Active"
                              )
                            }
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                              staff.status === "Active"
                                ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                                : "border-emerald-300 bg-emerald-50 text-emerald-800"
                            }`}
                          >
                            {staff.status === "Active" ? "Suspend Access" : "Activate Access"}
                          </button>

                          {staff.role !== "SUPER_ADMIN" && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(`Are you sure you want to remove staff member ${staff.name}?`)
                                ) {
                                  deleteUser(staff.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Remove Staff"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Directory Table */}
      {activeTab === "customers" && (
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Customer Profile</th>
                  <th className="py-3 px-4">Registered Location</th>
                  <th className="py-3 px-4">Orders & Lifetime Spend</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">
                        {cust.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {cust.defaultAddress?.county || "Kenya (CBD)"}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        KES {Number(cust.totalSpent || 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {cust.ordersCount || 0} order(s) placed
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          cust.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : cust.status === "Flagged"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {cust.status || "Active"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={cust.status || "Active"}
                        onChange={(e) =>
                          updateUserStatus(cust.id, e.target.value as User["status"])
                        }
                        className="text-[11px] bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 font-semibold focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Flagged">Flag</option>
                        <option value="Suspended">Suspend</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Member Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add New Staff Member</h3>
                <p className="text-xs text-slate-500">Assign employee duties and access level</p>
              </div>
              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Employee Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Mwangi"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="s.mwangi@tanasupermart.co.ke"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Contact Phone (+254)
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Staff Department & Role
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => {
                    const r = e.target.value as "OPERATIONS" | "FINANCE" | "SUPER_ADMIN";
                    const defTask =
                      r === "OPERATIONS"
                        ? "Order Fulfillment & Courier Dispatch"
                        : r === "FINANCE"
                        ? "M-PESA Daraja Reconciliation & Invoices"
                        : "Executive Platform Governance & Presets";
                    setNewStaff({ ...newStaff, role: r, assignedTask: defTask });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-bold"
                >
                  <option value="OPERATIONS">Operations & Logistics</option>
                  <option value="FINANCE">Finance & Accounting</option>
                  <option value="SUPER_ADMIN">Executive Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Assigned Operational Responsibilities
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.assignedTask}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, assignedTask: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Temporary Access Password
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
