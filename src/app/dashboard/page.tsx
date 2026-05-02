"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Search, Star, Edit3, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";

export default function UserDashboard() {
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Rating modal state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/stores?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStores(data);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStores(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores(searchQuery);
  };

  const openRatingModal = (store: any) => {
    setSelectedStore(store);
    setRatingValue(store.userRating || 5);
    setReviewComment(store.userComment || "");
    setIsRatingModalOpen(true);
  };

  const submitRating = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: selectedStore.id,
          value: ratingValue,
          comment: reviewComment
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit rating");
      }
      setIsRatingModalOpen(false);
      fetchStores(searchQuery);
    } catch (error: any) {
      alert(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Stores Directory">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 shadow-lg">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Stores List</h2>
          <p className="text-gray-500 text-sm">Showing {stores.length} stores</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No stores found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Image</th>
                  <th className="py-4 px-6 font-semibold">Store Name</th>
                  <th className="py-4 px-6 font-semibold">Address</th>
                  <th className="py-4 px-6 font-semibold">Overall Rating</th>
                  <th className="py-4 px-6 font-semibold">Your Rating</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {stores.map(store => (
                  <tr key={store.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="py-4 px-6">
                      {store.imageUrl ? (
                        <img src={store.imageUrl} alt={store.name} className="w-12 h-12 rounded-lg object-cover border border-gray-700 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shadow-sm">
                          <ImageIcon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white font-bold text-lg">{store.name}</div>
                      {store.aiAnalysis && (
                        <div className="mt-3 flex items-start gap-3 bg-gray-950 border border-emerald-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 transition-all max-w-md">
                          <div className="bg-emerald-500/20 p-2 rounded-lg mt-1">
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.1em]">AI Review</span>
                              <div className="h-px bg-emerald-500/20 flex-1 min-w-[20px]" />
                            </div>
                            <p className="text-gray-200 text-sm font-medium leading-relaxed italic">
                              {store.aiAnalysis}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm">{store.address}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-white font-medium">{store.overallRating ? store.overallRating.toFixed(1) : "New"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {store.userRating ? (
                        <div>
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-sm font-bold">{store.userRating} / 5</span>
                          </div>
                          {store.userComment && (
                            <p className="text-gray-500 text-xs mt-2 italic max-w-[200px] truncate" title={store.userComment}>&quot;{store.userComment}&quot;</p>
                          )}
                          {store.userOwnerReply && (
                            <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg shadow-sm">
                              <div className="text-[10px] font-black text-emerald-400 uppercase mb-1 tracking-wider">Reply from Store Owner</div>
                              <p className="text-gray-100 text-sm leading-relaxed italic">&quot;{store.userOwnerReply}&quot;</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm italic">Not rated</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openRatingModal(store)}
                        className="inline-flex items-center gap-2 bg-gray-800 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                        {store.userRating ? "Change" : "Rate Now"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isRatingModalOpen && selectedStore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-2">Rate Store</h3>
            <p className="text-gray-400 mb-6">{selectedStore.name}</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRatingValue(star)}>
                  <Star className={`w-10 h-10 ${star <= ratingValue ? "fill-amber-400 text-amber-400" : "text-gray-700"}`} />
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">Review (Optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share details of your own experience at this place"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24 resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setIsRatingModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium">Cancel</button>
              <button onClick={submitRating} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
