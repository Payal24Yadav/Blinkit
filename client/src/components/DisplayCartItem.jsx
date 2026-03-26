import React from "react";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceRupees";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { Link, useNavigate } from "react-router-dom";

export const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);

  const user= useSelector(state => state.user)
  const navigate= useNavigate()
  const redirectToCheckoutPage =()=>{
    if(user?._id){
        navigate("/checkout")
        if(close){
            close()
        }
        return
    }
  }

  return (
    
    <section className="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-2xl z-[200] flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold text-stone-800">My Cart</h2>
        <button onClick={close} className="text-2xl text-stone-600 hover:text-red-500">
          <IoClose />
        </button>
      </div>

      {/* BODY */}
      {cartItem[0] ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* SAVINGS */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex justify-between">
            <p className="text-sm text-stone-600">Your total savings</p>
            <p className="text-amber-600 font-bold">
              {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
            </p>
          </div>

          {/* CART ITEMS */}
          <div className="space-y-4">
            {cartItem.map((item, index) => (
              <div key={item?._id+"cartItemDisplay"} className="flex gap-3 border rounded-lg p-3 shadow-sm">
                
                {/* IMAGE */}
                <div className="w-20 h-20 bg-stone-100 rounded-md overflow-hidden">
                  <img
                    src={item?.productId?.image[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <p className="font-semibold text-stone-800 text-sm line-clamp-2">
                    {item?.productId?.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {item?.productId?.unit}
                  </p>

                  <p className="text-amber-600 font-bold mt-1">
                    {DisplayPriceInRupees(
                      pricewithDiscount(
                        item?.productId?.price,
                        item?.productId?.discount
                      )
                    )}
                  </p>
                </div>

                {/* BUTTON */}
                <div className="flex items-center">
                  <AddToCartButton data={item?.productId} />
                </div>
              </div>
            ))}
          </div>

          {/* BILL DETAILS */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-semibold text-stone-800">Bill Details</h3>

            <div className="flex justify-between text-sm">
              <p>Items total</p>
              <p>
                <span className="line-through text-stone-400 mr-2">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span className="font-semibold">
                  {DisplayPriceInRupees(totalPrice)}
                </span>
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <p>Quantity</p>
              <p>{totalQty} items</p>
            </div>

            <div className="flex justify-between text-sm">
              <p>Delivery</p>
              <p className="text-green-600 font-medium">Free</p>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <p>Grand Total</p>
              <p className="text-amber-600">
                {DisplayPriceInRupees(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY CART */
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-stone-500">Your cart is empty</p>
          <Link
            to="/"
            onClick={close}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Shop Now
          </Link>
        </div>
      )}

      {/* FOOTER */}
      {cartItem[0] && (
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-amber-600">
              {DisplayPriceInRupees(totalPrice)}
            </p>
            <button onClick={redirectToCheckoutPage} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md">
              Proceed
            </button>
          </div>
        </div>
      )}
    </section>
  );
};