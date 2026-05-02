"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Store as StoreIcon, Star, Plus, Trash2, X, Loader2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get("tab") as "users" | "stores" | "ratings") || null;

  const handleTabChange = (tab: "users" | "stores" | "ratings") => {
    router.push(`/admin?tab=${tab}`);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "NORMAL" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", ownerId: "", imageUrl: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, storesRes, ratingsRes] = await Promise.all([
        fetch("/api/admin/dashboard").then(res => res.json()),
        fetch("/api/admin/users").then(res => res.json()),
        fetch("/api/admin/stores").then(res => res.json()),
        fetch("/api/admin/ratings").then(res => res.json())
      ]);
      
      setStats(statsRes);
      setUsers(usersRes);
      setStores(storesRes);
      setRatings(ratingsRes);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete any store they own.")) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    try {
      await fetch(`/api/admin/stores/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      alert("Failed to delete store");
    }
  };

  const handleDeleteRating = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rating?")) return;
    try {
      await fetch(`/api/admin/ratings/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      alert("Failed to delete rating");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || `Failed with status ${res.status}`);
      }

      setIsUserModalOpen(false);
      setNewUser({ name: "", email: "", password: "", address: "", role: "NORMAL" });
      fetchData();
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.message || "Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.ownerId) {
      alert("Please select a store owner");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStore),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || `Failed with status ${res.status}`);
      }
      setIsStoreModalOpen(false);
      setNewStore({ name: "", email: "", address: "", ownerId: "", imageUrl: "" });
      fetchData();
    } catch (error: any) {
      console.error("Error creating store:", error);
      alert(error.message || "Failed to create store");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableOwners = users.filter(user => 
    user.role === "STORE_OWNER" && 
    !stores.some(store => store.ownerId === user.id)
  );

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredStores = Array.isArray(stores) ? stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredRatings = Array.isArray(ratings) ? ratings.filter(rating => 
    rating.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rating.store?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {!activeTab && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => handleTabChange("users")} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-lg cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-medium">Total Users</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</div>
            </div>
          </div>

          <div onClick={() => handleTabChange("stores")} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-lg cursor-pointer hover:border-emerald-500/30 transition-all">
            <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20">
              <StoreIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-medium">Total Stores</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.totalStores}</div>
            </div>
          </div>

          <div onClick={() => handleTabChange("ratings")} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-lg cursor-pointer hover:border-amber-500/30 transition-all">
            <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/20">
              <Star className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-medium">Total Ratings</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.totalRatings}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Area */}
      {activeTab && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white capitalize">{activeTab} Management</h2>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                />
                {activeTab !== "ratings" && (
                  <button 
                    onClick={() => activeTab === "users" ? setIsUserModalOpen(true) : setIsStoreModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm">
                    {activeTab === "users" ? (
                      <>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Actions</th>
                      </>
                    ) : activeTab === "stores" ? (
                      <>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Store Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Store</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {activeTab === "users" && filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4"><span className="bg-gray-800 px-2 py-1 rounded text-xs">{user.role}</span></td>
                      <td className="py-3 px-4"><button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                  {activeTab === "stores" && filteredStores.map(store => (
                    <tr key={store.id}>
                      <td className="py-3 px-4">
                        {store.imageUrl ? (
                          <img src={store.imageUrl} alt={store.name} className="w-10 h-10 rounded-md object-cover border border-gray-700 transition-transform duration-300 hover:scale-[3] hover:z-50 relative origin-left cursor-zoom-in" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center border border-gray-700 text-xs text-gray-500">N/A</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{store.name}</td>
                      <td className="py-3 px-4 text-gray-400">{store.email}</td>
                      <td className="py-3 px-4 text-amber-400"><Star className="w-3 h-3 inline mr-1 fill-current" />{store.rating.toFixed(1)}</td>
                      <td className="py-3 px-4"><button onClick={() => handleDeleteStore(store.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                  {activeTab === "ratings" && filteredRatings.map(rating => (
                    <tr key={rating.id}>
                      <td className="py-3 px-4 text-sm">{rating.user?.name}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{rating.store?.name}</td>
                      <td className="py-3 px-4">
                        <div className="text-amber-400">{rating.value} ★</div>
                        {rating.comment && <div className="text-gray-400 text-xs mt-1 italic max-w-xs truncate" title={rating.comment}>"{rating.comment}"</div>}
                      </td>
                      <td className="py-3 px-4"><button onClick={() => handleDeleteRating(rating.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button onClick={() => setIsUserModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input type="email" placeholder="Email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input type="password" placeholder="Password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                <option value="NORMAL">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <textarea placeholder="Address" required value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-24" />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Store Modal */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add New Store</h3>
              <button onClick={() => setIsStoreModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <input type="text" placeholder="Store Name" required value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input type="email" placeholder="Store Email" required value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <select required value={newStore.ownerId} onChange={e => setNewStore({...newStore, ownerId: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                <option value="">Select Owner</option>
                {availableOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name}</option>
                ))}
              </select>
              <textarea placeholder="Address" required value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-24" />
              <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-400 mb-2">Store Image (Optional)</span>
                {newStore.imageUrl ? (
                  <div className="relative">
                    <img src={newStore.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-600" />
                    <button 
                      type="button" 
                      onClick={() => setNewStore({...newStore, imageUrl: ""})}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setNewStore({...newStore, imageUrl: res[0].url});
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                      button: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm",
                      allowedContent: "text-gray-400 text-xs mt-2"
                    }}
                  />
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Store"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
