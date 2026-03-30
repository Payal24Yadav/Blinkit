import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaShoppingBasket, FaPaperPlane } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-amber-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaShoppingBasket className="text-amber-500 text-3xl" />
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                blink<span className="text-amber-500">it</span>
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Indore's quickest grocery delivery service. Freshness delivered to Shanti Nagar and beyond in just 10 minutes.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaTwitter, FaLinkedin, FaGithub].map((Icon, idx) => (
                <a key={idx} href="#" className="text-slate-400 hover:text-amber-500 transition-colors duration-300">
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Useful Links</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li className="hover:text-amber-600 cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Press</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Lead</li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Categories</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Vegetables & Fruits</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Dairy & Breakfast</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Munchies & Drinks</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Home & Office</li>
              <li className="hover:text-amber-600 cursor-pointer transition-colors">Personal Care</li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Newsletter</h4>
            <p className="text-slate-500 text-sm">Join our mailing list for exclusive offers in Indore.</p>
            <div className="flex items-center">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-slate-50 border border-slate-200 rounded-l-xl py-3 px-4 text-slate-700 focus:outline-none focus:border-amber-400 transition-all text-sm"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white p-3.5 rounded-r-xl transition-colors">
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Middle Section: Download App (Optional but very Blinkit-style) */}
       

        {/* Bottom Section: Copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs italic">
            "Minutes away from happiness in Indore"
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <p>© 2026 Blinkit Clone Project</p>
            <a href="#" className="hover:text-amber-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};