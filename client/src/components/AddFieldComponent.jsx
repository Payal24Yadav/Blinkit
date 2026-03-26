import React from "react";
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <h1 className="text-sm font-black text-stone-800 uppercase tracking-widest">Add Field</h1>
          <button 
            onClick={close} 
            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-stone-400"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Field Name</label>
            <input
              type="text"
              placeholder="e.g. Storage, Color, Material"
              value={value}
              onChange={onChange}
              className="w-full bg-stone-50 p-3 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-medium transition-all"
              autoFocus
            />
          </div>

          <button 
            onClick={submit}
            disabled={!value}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:cursor-not-allowed text-white py-3 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-100 uppercase tracking-widest"
          >
            Add Specification
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddFieldComponent;