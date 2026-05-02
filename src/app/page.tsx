"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Star, Zap, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [displayText, setDisplayText] = React.useState("");
  const fullText = "Customer Reviews into Smart Insights";
  
  React.useEffect(() => {
    let index = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentFullText = fullText;
      
      if (!isDeleting) {
        setDisplayText(currentFullText.slice(0, index));
        index++;
        
        if (index > currentFullText.length) {
          // Pause at the end
          setTimeout(() => {
            isDeleting = true;
            type();
          }, 4000); // Wait 5 seconds before starting to delete or reset
          return;
        }
      } else {
        setDisplayText(currentFullText.slice(0, index));
        index--;
        
        if (index < 0) {
          isDeleting = false;
          index = 0;
          setTimeout(type, 500); // Small pause before restarting
          return;
        }
      }
      
      const speed = isDeleting ? 50 : 100;
      setTimeout(type, speed);
    };

    type();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#050b1a] text-white selection:bg-emerald-500/30 overflow-x-hidden relative">
     
      <div className="fixed inset-0 pointer-events-none -z-10">
       
        <div className="absolute inset-0 bg-[#050b1a]" />
        

        <div 
          className="absolute inset-0 opacity-[0.2]" 
          style={{ 
            backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* Dynamic Glowing Orbs - Brighter and Larger */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-cyan-500/30 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute middle-0 left-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/15 blur-[120px]" />

        {/* Subtle Radial Gradient to give center focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050b1a_80%)]" />
        
        {/* AI Neural Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] mix-blend-screen pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/ai-bg.png')" }}
        />
      </div>

      <PublicNavbar />

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center relative flex flex-col items-center">
         
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[1.1] min-h-[2.4em]">
            {displayText.includes("Smart") ? (
              <>
                {displayText.split("Smart")[0]}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400">
                  {"Smart Insights".slice(0, Math.max(0, displayText.length - displayText.split("Smart")[0].length))}
                </span>
              </>
            ) : (
              displayText
            )}
            <span className="inline-block w-2 h-10 md:h-16 bg-emerald-500 ml-2 animate-pulse align-middle" />
          </h1>
           <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-full text-emerald-400 text-sm font-bold animate-bounce mb-10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
         
            From Reviews to Intelligence
          </div>
          
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500 mb-14">
          RevAI uses AI to turn customer feedback into clear, actionable insights—so you can make better decisions, faster.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link href="/register" className="group bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                Get Started 
                
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white font-bold text-lg transition-colors border-b-2 border-transparent hover:border-emerald-500 py-1">
                How it works
              </Link>
            </div>
          )}
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-10 rounded-[2.5rem] hover:border-emerald-500/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 group cursor-default">
              <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-inner">
                <Star className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">Verified Authenticity</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Our platform ensures every review comes from a real user, giving businesses data they can actually trust.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-10 rounded-[2.5rem] hover:border-cyan-500/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)] transition-all duration-500 group cursor-default">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-inner">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">Real-time Analytics</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Don&apos;t wait for reports. See customer sentiment shift in real-time with our live dashboard for owners.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-10 rounded-[2.5rem] hover:border-purple-500/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(168,85,247,0.1)] transition-all duration-500 group cursor-default">
              <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-inner">
                 <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">AI Magic Summaries</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Gemini-powered summaries give you the summary of a review.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
