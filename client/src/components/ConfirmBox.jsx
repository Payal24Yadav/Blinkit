import React from 'react';
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmBox = ({ cancel, confirm }) => {
  return (
    // Backdrop with the same blur as your header
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      
      {/* Modal Card - Matching your Header's #FDFCF0 background */}
      <div className="w-full max-w-sm bg-[#FDFCF0] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        
        <div className="p-8 text-center">
          {/* Theme Icon: Amber Pulse to match your Zap icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <FiAlertTriangle size={28} />
              </div>
              <div className="absolute inset-0 bg-amber-400 blur-lg opacity-20 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-xl font-black text-stone-900 tracking-tighter">
            Permanent Delete<span className="text-amber-500">.</span>
          </h1>
          
          <p className="mt-3 text-stone-600 font-medium leading-relaxed">
            Are you sure? This action will remove the data permanently from your account.
          </p>
        </div>

        {/* Action Buttons - Using your Stone and Amber accents */}
        <div className="flex items-center gap-0 border-t border-stone-200">
          <button 
            onClick={cancel}
            className="flex-1 px-6 py-4 text-sm font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors border-r border-stone-200"
          >
            CANCEL
          </button>
          <button 
            onClick={confirm}
            className="flex-1 px-6 py-4 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors"
          >
            CONFIRM DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;