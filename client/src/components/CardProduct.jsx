import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceRupees";
import { Link } from "react-router-dom";
import { validateURLConvert } from "../utils/valideURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validateURLConvert(data.name)}-${data._id}`;

  return (
    <Link
      to={url}
      className="min-w-[150px] md:min-w-[200px] bg-white border border-stone-200 rounded-2xl p-3 hover:border-amber-400 transition-all duration-300 group shadow-sm flex flex-col justify-between h-full"
    >
      {/* Top Part: Image & Name */}
      <div>
        <div className="w-full aspect-square bg-stone-50 rounded-xl overflow-hidden mb-3 p-2 relative flex items-center justify-center">
          <img
            src={data.image[0]}
            alt={data.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />

          {/* Delivery Badge */}
          <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm border border-stone-100 px-1.5 py-0.5 rounded shadow-sm">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter italic">
              ⚡ 10 min
            </span>
          </div>

          {/* Premium Discount Badge */}
          {Boolean(data.discount) && (
            <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-bl-xl shadow-md">
              {data.discount}% OFF
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-[13px] font-bold text-stone-800 line-clamp-2 leading-snug h-9">
            {data.name}
          </h4>
          <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
            {data.unit}
          </p>
        </div>
      </div>

      {/* Bottom Part: Price & Action */}
      <div className="mt-4">
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col">
            {/* Final Price */}
            <span className="text-sm font-black text-slate-900 tracking-tighter">
              {DisplayPriceInRupees(
                pricewithDiscount(data.price, data.discount),
              )}
            </span>

            {/* Original Price */}
            {Boolean(data.discount) && (
              <span className="text-[10px] font-bold text-slate-400 line-through decoration-slate-300">
                {DisplayPriceInRupees(data.price)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center min-w-[80px]">
            {data.stock == 0 ? (
              <div className="bg-red-50 text-red-500 border border-red-100 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter text-center w-full leading-tight">
                Out of <br /> Stock
              </div>
            ) : (
              <AddToCartButton data={data}/>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
