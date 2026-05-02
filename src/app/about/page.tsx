"use client";

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Sparkles, BarChart3, MessageSquare, Zap } from 'lucide-react';

export default function AboutPage() {
  const [displayText, setDisplayText] = React.useState("");
  const fullText = "From Reviews to Intelligence by ";

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* Visionary Green Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#020617]" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `linear-gradient(#064e3b 1px, transparent 1px), linear-gradient(90deg, #064e3b 1px, transparent 1px)`, 
            backgroundSize: '100px 100px' 
          }} 
        />
        
        {/* Emerald/Cyan Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/20 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/20 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Link
        href="/"
        className="fixed top-10 right-10 flex items-center gap-2 text-emerald-400 font-bold text-lg cursor-pointer hover:text-emerald-300 transition-colors z-50 border border-transparent hover:border-emerald-400 rounded-md px-4 py-1.5 bg-black/50 backdrop-blur-md"
      >
        ← Home
      </Link>
      
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          animation: gradient-move 4s ease infinite;
          background-size: 200% auto;
        }
      `}</style>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* Compact Hero */}
        <div className="text-center space-y-6 pt-12">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight min-h-[1.5em]">
            {displayText}
            {displayText.length === fullText.length ? (
              <>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-text">
                  RevAI
                </span>
              </>
            ) : (
              <span className="inline-block w-1.5 h-12 md:h-20 bg-emerald-500 ml-2 animate-pulse align-middle" />
            )}
          </h2>
        </div>

        {/* Split Mission Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-400 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              Our Mission
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Bridging the gap between <span className="text-emerald-400">Feedback</span> and <span className="text-cyan-400">Growth</span>
            </h3>
            <p className="text-gray-400 text-xl leading-relaxed">
              We believe that every customer review is a hidden gem of intelligence. RevAI was built to help businesses stop guessing and start knowing what their customers truly feel.
            </p>
      
          </div>
          
          <div className="relative group animate-in zoom-in duration-1000 delay-300">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative bg-gray-950 border border-gray-800 p-12 rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Sparkles className="w-32 h-32 text-emerald-500" />
               </div>
               <BarChart3 className="w-16 h-16 text-emerald-500 mb-8" />
               <h4 className="text-2xl font-bold mb-4 text-white">Data-First Approach</h4>
               <p className="text-gray-400 leading-relaxed text-lg">
                 By using advanced sentiment analysis, we turn emotional feedback into hard data that helps you optimize your business operations.
               </p>
            </div>
          </div>
        </section>

        {/* Feature Grid - Distinct Style */}
        <section className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">The Platform Advantage</h3>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to master your brand reputation in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-10 rounded-3xl hover:border-emerald-500/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 group">
              <Zap className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-3">Instant AI Summaries</h4>
              <p className="text-gray-500 leading-relaxed">Actionable intelligence delivered in milliseconds, not months.</p>
            </div>
            
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-10 rounded-3xl hover:border-cyan-500/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)] transition-all duration-500 group">
              <MessageSquare className="w-10 h-10 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-3">Smart Owner Replies</h4>
              <p className="text-gray-500 leading-relaxed">Respond with empathy and precision using our suggested templates.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
