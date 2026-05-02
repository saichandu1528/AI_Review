import React from 'react';
import Link from 'next/link';
import { Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/10 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-black font-black text-xl italic tracking-tighter mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
   
              </div>
              REVAI
            </div>
            <p className="text-black text-sm leading-relaxed">
              Empowering businesses through the power of AI. We turn customer feedback into actionable growth insights using state-of-the-art Large Language Models.
            </p>
          </div>

          <div>
            <h4 className="text-black font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-black">
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Find Stores</Link></li>
              <li><Link href="/owner" className="hover:text-emerald-400 transition-colors">For Business</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">Our Mission</Link></li>
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-black font-bold mb-6">Developer</h4>
            <ul className="space-y-4 text-sm text-black">
              <li className="flex flex-col gap-1">
                <span className="text-black font-bold">Vengaladas Saichandu</span>
                <span className="text-emerald-500 text-xs font-medium">Full Stack Developer</span>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 cursor-pointer transition-colors">
                <Mail className="w-4 h-4" /> 
                <a href="mailto:vengaldassaichandu2002@gmail.com">vengaldassaichandu2002@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 cursor-pointer transition-colors">
                <Globe className="w-4 h-4" /> 
                <a href="https://github.com/saichandu1528" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
              </li>
            </ul>
          </div>

        
        </div>

        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-black text-xs text-center md:text-left">
            © {new Date().getFullYear()} RevAI Platform. Developed by <span className="text-emerald-500 font-bold">Vengaladas Saichandu</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-black hover:text-emerald-600 text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-black hover:text-emerald-600 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
