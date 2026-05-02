"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, Store, Users, Star, Key } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

function LayoutContent({ children, title }: { children: React.ReactNode; title: string }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const user = session?.user as any;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const isActive = (path: string, exactTab?: string) => {
    if (exactTab) {
      return pathname === path && tab === exactTab;
    }
    return pathname === path && !tab;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-emerald-400 font-bold text-xl cursor-pointer hover:text-emerald-300 transition-colors"
          >
            REVAI
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {user?.role !== "ADMIN" && (
            <>
              <Link
                href={user?.role === "STORE_OWNER" ? "/owner" : "/dashboard"}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive("/dashboard") || isActive("/owner")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/change-password"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive("/change-password") ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Key className="w-5 h-5" />
                <span className="font-medium">Change Password</span>
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive("/admin") ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/admin?tab=users"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive("/admin", "users") ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </Link>
              <Link
                href="/admin?tab=stores"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive("/admin", "stores") ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">Stores</span>
              </Link>
              <Link
                href="/admin?tab=ratings"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive("/admin", "ratings") ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Ratings</span>
              </Link>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="px-3 py-2 mb-2">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 relative">
        {/* Header */}
        <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10 flex items-center px-8">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>

        {/* Page Content */}
        <main className="p-8 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}

export default function Layout(props: { children: React.ReactNode; title: string }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center">Loading...</div>}>
      <LayoutContent {...props} />
    </React.Suspense>
  );
}
