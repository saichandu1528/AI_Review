"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Star, Users, MapPin, Loader2, Search, Edit3, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Reply Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/owner/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/owner/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: editImageUrl })
      });
      
      if (!res.ok) throw new Error("Failed to update image");
      
      setIsEditModalOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      alert("Failed to update image");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI thinking for a premium feel
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAIReview(true);
    }, 2000);
  };

  const handleFetchSuggestions = async () => {
    if (!selectedRating) return;
    setIsGeneratingSuggestions(true);
    try {
      const res = await fetch("/api/owner/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratingId: selectedRating.id })
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAiSuggestions(data);
    } catch (error) {
      alert("Failed to generate AI suggestions");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) return;
    setIsSubmittingReply(true);
    try {
      const res = await fetch("/api/owner/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratingId: selectedRating.id, reply: replyText })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setIsReplyModalOpen(false);
      fetchDashboardData();
    } catch (error: any) {
      alert(error.message || "Failed to submit reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Store Dashboard">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </Layout>
    );
  }

  if (error || !dashboardData) {
    return (
      <Layout title="Store Dashboard">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
          {error || "No store assigned to your account. Please contact an Administrator."}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Dashboard: ${dashboardData.storeName}`}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="relative group">
            {dashboardData.storeImageUrl ? (
              <img src={dashboardData.storeImageUrl} alt={dashboardData.storeName} className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-900 border-2 border-gray-800 flex items-center justify-center shadow-lg">
                <ImageIcon className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <button 
              onClick={() => {
                setEditImageUrl(dashboardData.storeImageUrl || "");
                setIsEditModalOpen(true);
              }}
              className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="w-6 h-6 text-white" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {dashboardData.storeName}
              <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full border border-amber-400/20 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{dashboardData.averageRating > 0 ? dashboardData.averageRating.toFixed(1) : "0.0"}</span>
              </div>
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {dashboardData.storeAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 relative z-10">
            <Star className="w-8 h-8 text-amber-400 fill-current" />
          </div>
          <div className="relative z-10">
            <div className="text-gray-400 text-sm font-medium">Average Rating</div>
            <div className="text-4xl font-bold text-white mt-1">
              {dashboardData.averageRating > 0 ? dashboardData.averageRating.toFixed(1) : "0.0"}
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 relative z-10">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <div className="relative z-10">
            <div className="text-gray-400 text-sm font-medium">Total Reviews</div>
            <div className="text-4xl font-bold text-white mt-1">
              {dashboardData.usersWhoRated.length}
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 relative z-10">
            <MapPin className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <div className="text-gray-400 text-sm font-medium">Location</div>
            <div className="text-sm text-white mt-2 font-medium line-clamp-2">
              {dashboardData.storeAddress || "No address provided"}
            </div>
          </div>
        </div>
      </div>

      {!showAIReview ? (
        <div className="bg-gray-900/50 border border-emerald-500/20 rounded-2xl p-8 mb-10 flex flex-col items-center justify-center text-center shadow-xl">
          <div className={`p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 ${isAnalyzing ? 'animate-pulse' : ''}`}>
            <Sparkles className={`w-10 h-10 text-emerald-400 ${isAnalyzing ? 'animate-spin-slow' : ''}`} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Want to see what customers think?</h3>
          <p className="text-gray-400 mb-6 max-w-md">Our AI can analyze all your feedback and give you a professional summary of your store&apos;s performance.</p>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Feedback...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Feedback with AI
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-gray-950 border border-emerald-500/30 rounded-2xl p-8 mb-10 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Sparkles className="w-32 h-32 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">AI Review</h2>
                <div className="h-1 w-12 bg-emerald-500 rounded-full mt-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <button 
              onClick={() => setShowAIReview(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-200 text-xl font-medium leading-relaxed italic relative z-10 max-w-4xl">
            &quot;{dashboardData.aiAnalysis || "Not enough data for analysis yet."}&quot;
          </p>
        </div>
      )}

      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl overflow-hidden border-t border-t-emerald-500/20">
        <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Ratings & Feedback</h2>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search reviewers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all w-full md:w-64"
              />
            </div>
            <div className="hidden sm:block text-xs text-gray-500 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
              Real-time Updates
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/80 text-gray-400 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-8">User Details</th>
                <th className="py-5 px-8">Rating</th>
                <th className="py-5 px-8">Date Submitted</th>
                <th className="py-5 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {dashboardData.usersWhoRated.filter((user: any) => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-800 p-4 rounded-full">
                        <Users className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-500 font-medium">No ratings received yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                dashboardData.usersWhoRated
                  .filter((user: any) => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user: any, index: number) => (
                  <tr key={index} className="hover:bg-emerald-500/[0.02] transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-emerald-400 font-bold group-hover:border-emerald-500/50 transition-all">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-lg">{user.name}</span>
                          <span className="text-gray-500 text-sm">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < user.ratingValue ? "text-amber-400 fill-current" : "text-gray-700"}`} 
                          />
                        ))}
                        <span className="ml-2 font-bold text-white">{user.ratingValue}.0</span>
                      </div>
                      {user.comment && (
                        <p className="text-gray-400 text-sm italic mt-2 border-l-2 border-emerald-500/30 pl-3">&quot;{user.comment}&quot;</p>
                      )}
                      {user.ownerReply && (
                        <div className="mt-3 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">
                          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Your Professional Reply</div>
                          <p className="text-gray-200 text-sm italic">&quot;{user.ownerReply}&quot;</p>
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-8 text-gray-400 font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <button 
                        onClick={() => {
                          setSelectedRating(user);
                          setReplyText(user.ownerReply || "");
                          setAiSuggestions([]);
                          setIsReplyModalOpen(true);
                        }}
                        className="bg-gray-800 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all inline-flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        {user.ownerReply ? "Edit Reply" : "Reply"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isReplyModalOpen && selectedRating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Reply to Review</h3>
              <button onClick={() => setIsReplyModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>

            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{selectedRating.name}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{selectedRating.ratingValue}.0</span>
                </div>
              </div>
              <p className="text-gray-400 italic">&quot;{selectedRating.comment || "No text provided"}&quot;</p>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Your Response</label>
                  <button 
                    type="button"
                    onClick={handleFetchSuggestions}
                    disabled={isGeneratingSuggestions || !selectedRating.comment}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSuggestions ? 'animate-spin' : ''}`} />
                    {isGeneratingSuggestions ? "Thinking..." : "Suggest AI Replies"}
                  </button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="space-y-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">AI Suggestions</p>
                    {aiSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyText(suggestion)}
                        className="w-full text-left p-3 text-sm bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-gray-300 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <textarea 
                  required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsReplyModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingReply}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                  {isSubmittingReply ? "Saving..." : "Submit Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Update Store Image</h3>
              <button onClick={() => setIsEditModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleUpdateImage} className="space-y-4">
              <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                {editImageUrl ? (
                  <div className="relative">
                    <img src={editImageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-600" />
                    <button 
                      type="button" 
                      onClick={() => setEditImageUrl("")}
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
                        setEditImageUrl(res[0].url);
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
                disabled={isSaving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Image"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
