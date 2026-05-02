"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function PublicNavbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user as any;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="w-full bg-gray-950 border-b border-gray-800 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link 
        href="/"
        className="flex items-center gap-2 text-emerald-600 font-black text-2xl tracking-tight cursor-pointer"
      >
        REVAI
      </Link>
      
      <div className="flex items-center gap-6">
        {!isAuthenticated ? (
          <Link 
            href="/about"
            className="text-gray-300 font-semibold hover:text-emerald-400 transition-colors text-lg"
          >
            About Us
          </Link>
        ) : (
          <Link 
            href={
              user?.role === "ADMIN" 
                ? "/admin" 
                : user?.role === "STORE_OWNER" 
                  ? "/owner" 
                  : "/dashboard"
            }
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors text-lg"
          >
            {user?.role === "ADMIN" ? "Admin Dashboard" : user?.role === "STORE_OWNER" ? "Store Dashboard" : "Dashboard"}
          </Link>
        )}
        
        {!isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-300 font-semibold hover:text-emerald-400 transition-colors text-lg px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="group relative flex items-center gap-4">
            <div className="flex items-center gap-2 text-white font-semibold bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 cursor-default transition-all group-hover:bg-gray-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user?.name}
            </div>
            
            <button
              onClick={handleLogout}
              className="absolute right-0 top-full mt-2 bg-white border border-slate-200 shadow-xl rounded-xl px-4 py-2 text-red-600 font-bold text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all hover:bg-red-50 hover:border-red-100 z-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
