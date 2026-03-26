import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiXCircle } from "react-icons/fi";

const Cancel = () => {
  const location = useLocation();

  // Safely check for state text, default to "Order"
  const cancelMessage = location.state?.text || "Order";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Cancel/Error Icon */}
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <FiXCircle size={80} className="text-red-500" />
      </div>

      {/* Main Message */}
      <h1 className="text-4xl  text-stone-800 mb-2">
        Order Cancelled
      </h1>
      
      <p className="text-lg text-stone-600 mb-8 max-w-md">
        {cancelMessage} was not processed. If this was a mistake, you can return to your cart and try again.
      </p>

      {/* Navigation Links */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          to="/checkout"
          className="bg-amber-400 hover:bg-stone-900 text-black px-10 py-3 rounded-full font-bold transition shadow-lg active:scale-95"
        >
          Return to Checkout
        </Link>
        
        <Link
          to="/"
          className="text-stone-500 hover:text-amber-600 font-semibold transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Cancel;