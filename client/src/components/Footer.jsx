import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord, FaPaperPlane } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="relative w-full py-10 px-6 bg-slate-900 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-fuchsia-600/20 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Main Floating Card */}
        <div className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                VORTEX.
              </h2>
              <p className="text-slate-400 max-w-sm">
                Crafting digital experiences that push the boundaries of what's possible. Join our journey into the future.
              </p>
              <div className="flex gap-4">
                {[FaGithub, FaTwitter, FaLinkedin, FaDiscord].map((Icon, idx) => (
                  <a key={idx} href="#" className="p-3 bg-white/5 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 text-slate-300">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links with a modern twist */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-white uppercase tracking-widest">Explore</h4>
                <ul className="space-y-2 text-slate-400">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Showcase</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Templates</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Resources</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-white uppercase tracking-widest">Company</h4>
                <ul className="space-y-2 text-slate-400">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Our Story</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy</li>
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="text-white font-semibold mb-2">Stay in the loop</h4>
              <p className="text-slate-400 text-sm mb-4">Get the latest updates directly to your inbox.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 rounded-md transition-colors">
                  <FaPaperPlane />
                </button>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
            <p>© 2026 Vortex Digital. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

