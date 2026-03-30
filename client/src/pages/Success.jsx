import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle } from "react-icons/fi";
import { useGlobalContext } from '../provider/GlobalProvider';
import { useEffect } from 'react';

const Success = () => {
  const location = useLocation();

   const { fetchCartItem, fetchAddress, fetchOrder } = useGlobalContext();
  // Safely check for the state text, default to "Order placed"
  const successMessage = location.state?.text || "Order placed";
    useEffect(() => {
    fetchCartItem();   //  cart refresh
    fetchAddress();    //  optional
    fetchOrder();      //  optional
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Success Icon */}
      <FiCheckCircle size={80} className="text-green-500 mb-6" />

      {/* Main Message */}
      <h1 className="text-4xl  text-stone-800 mb-2">
        Thank You!
      </h1>
      
      <p className="text-lg text-stone-600 mb-8 max-w-md">
        {successMessage} successfully. Your items are being prepared for delivery.
      </p>

      {/* Navigation Links */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          to="/"
          className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-3 rounded-full font-bold transition shadow-lg active:scale-95"
        >
          Continue Shopping
        </Link>
        
        {/* <Link
          to="/dashboard/my-orders"
          className="text-stone-500 hover:text-amber-600 font-semibold transition"
        >
          View Order History
        </Link> */}
      </div>
    </div>
  );
};

export default Success;