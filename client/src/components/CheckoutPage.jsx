import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceRupees";
import AddAddress from "./AddAddress";
import { FiMapPin, FiPlus, FiCreditCard, FiTruck } from "react-icons/fi";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track which payment method is selected: 'ONLINE' or 'COD'
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [selectAddress, setSelectAddress] = useState(null);

  const addressList = useSelector((state) => state.addresses.addressList);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  const handleCashOnDelivery = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          totalAmt: totalPrice,
          addressId: selectAddress?._id, // Fixed: accessing ID directly from the selected object
          subTotalAmt: totalPrice,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate("/success", {
          state: {
            text: "Order",
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  //  ONLINE PAYMENT (STRIPE)
  // ONLINE PAYMENT (STRIPE)
  const handleOnlinePayment = async () => {
    try {
      console.log("--- 1. Starting Online Payment ---");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

      if (!stripePublicKey) {
        console.error("❌ Stripe Public Key missing in .env");
        return toast.error("Stripe public key missing!");
      }

      setLoading(true);

      console.log("--- 2. Sending Request to Backend ---", {
        list_items: cartItemsList.length,
        totalAmt: totalPrice,
        addressId: selectAddress?._id
      });

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          totalAmt: totalPrice,
          addressId: selectAddress?._id,
          subTotalAmt: totalPrice,
        },
      });

      const { data: session } = response;
      
      console.log("--- 3. Backend Response Received ---", session);

      if (!session?.url) {
        console.error("❌ No Session URL in response:", session);
        return toast.error("Payment session invalid!");
      }

      console.log("--- 4. Redirecting to Stripe ---", session.url);
      
      // Redirecting user to Stripe Checkout page
      window.location.href = session.url;

    } catch (error) {
      console.error("❌ Frontend Payment Error:", error);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  //  MAIN ORDER HANDLER
  // MAIN ORDER HANDLER
  const handlePlaceOrder = () => {
    console.log("--- 0. Place Order Triggered ---");
    console.log("Selected Address:", selectAddress);
    console.log("Payment Method:", paymentMethod);
    console.log("Cart Items Length:", cartItemsList.length);

    if (!selectAddress) {
      console.error("❌ Address not selected");
      return toast.error("Please select a delivery address");
    }

    if (cartItemsList.length === 0) {
      console.error("❌ Cart is empty");
      return toast.error("Cart is empty");
    }

    if (paymentMethod === "COD") {
      console.log("Proceeding with COD...");
      handleCashOnDelivery();
    } else {
      console.log("Proceeding with Online Payment...");
      handleOnlinePayment();
    }
  };


  
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE: Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-10">
          {/* ADDRESS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl text-stone-800 flex items-center gap-2">
                <FiMapPin className="text-amber-500" />
                Delivery Address
              </h3>

              <button
                onClick={() => setOpenAddress(true)}
                className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition"
              >
                <FiPlus /> Add New
              </button>
            </div>

            {addressList && addressList.length > 0 ? (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {addressList.map((address) => {
                  const isSelected = selectAddress?._id === address._id;

                  return (
                    <label
                      key={address._id}
                      className={`group relative flex gap-4 p-5 rounded-xl border cursor-pointer transition-all
                        ${
                          isSelected
                            ? "border-amber-500 ring-2 ring-amber-200 bg-amber-50"
                            : "border-amber-200 bg-gradient-to-br from-white to-amber-50 hover:border-amber-400 hover:shadow-md"
                        }`}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectAddress(address)}
                        name="address"
                        className="mt-1 accent-amber-500"
                      />

                      <div className="p-2 h-fit bg-amber-100 text-amber-600 rounded-lg">
                        <FiMapPin />
                      </div>

                      <div className="flex flex-col text-sm flex-1">
                        <p className="font-bold text-stone-800">
                          {address.address_line}
                        </p>
                        <p className="text-stone-600">
                          {address.city}, {address.state}
                        </p>
                        <p className="text-stone-500 text-xs">
                          {address.country}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-amber-700">
                          📞 {address.mobile}
                        </p>
                      </div>

                      <span
                        className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full transition
                        ${isSelected ? "bg-amber-500 text-white" : "bg-amber-500 text-white opacity-0 group-hover:opacity-100"}`}
                      >
                        {isSelected ? "Selected" : "Deliver Here"}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div
                onClick={() => setOpenAddress(true)}
                className="border border-dashed border-amber-300 rounded-xl p-10 text-center cursor-pointer hover:bg-amber-50 transition-all hover:shadow-sm"
              >
                <FiMapPin size={42} className="mx-auto text-amber-300 mb-3" />
                <p className="font-semibold text-stone-700">No address added</p>
                <p className="text-xs text-stone-400 mt-1">
                  Click to add your delivery address
                </p>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD SECTION */}
          <div>
            <h3 className="text-2xl text-stone-800 flex items-center gap-2 mb-5">
              <FiCreditCard className="text-amber-500" />
              Payment Method
            </h3>

            <div className="space-y-4">
              {/* ONLINE OPTION */}
              <button
                onClick={() => setPaymentMethod("ONLINE")}
                className={`w-full flex items-center justify-between px-5 py-4 border rounded-xl transition ${paymentMethod === "ONLINE" ? "border-amber-400 bg-amber-50" : "border-stone-200 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${paymentMethod === "ONLINE" ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600"}`}
                  >
                    <FiCreditCard />
                  </div>
                  <span
                    className={`font-bold ${paymentMethod === "ONLINE" ? "text-stone-800" : "text-stone-600"}`}
                  >
                    Online Payment
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-4 ${paymentMethod === "ONLINE" ? "border-amber-500" : "border-stone-200"}`}
                ></div>
              </button>

              {/* COD OPTION */}
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`w-full flex items-center justify-between px-5 py-4 border rounded-xl transition ${paymentMethod === "COD" ? "border-amber-400 bg-amber-50" : "border-stone-200 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${paymentMethod === "COD" ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600"}`}
                  >
                    <FiTruck />
                  </div>
                  <span
                    className={`font-bold ${paymentMethod === "COD" ? "text-stone-800" : "text-stone-600"}`}
                  >
                    Cash on Delivery
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-4 ${paymentMethod === "COD" ? "border-amber-500" : "border-stone-200"}`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Summary */}
        <div className="lg:col-span-1 sticky top-24 h-fit">
          <div className="space-y-5 border-l pl-6">
            <h3 className="text-xl text-stone-800 uppercase tracking-wide">
              Order Summary
            </h3>

            <div className="flex justify-between text-sm">
              <p className="text-stone-500">Items ({totalQty})</p>
              <div>
                <span className="line-through text-stone-300 mr-2 text-xs">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span className="font-semibold text-stone-800">
                  {DisplayPriceInRupees(totalPrice)}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <p className="text-stone-500">Delivery</p>
              <p className="text-green-600 font-bold text-xs uppercase">Free</p>
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <p className="text-lg text-stone-800">Total</p>
              <p className="text-2xl font-black text-amber-600">
                {DisplayPriceInRupees(totalPrice)}
              </p>
            </div>

            <div className="text-center text-xs text-green-700 font-semibold bg-green-50 py-2 rounded-lg">
              You saved{" "}
              {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
            </div>

            <button
              disabled={loading || cartItemsList.length === 0}
              onClick={handlePlaceOrder}
              className={`w-full text-white font-black py-4 rounded-xl transition active:scale-95 uppercase tracking-wide 
                ${loading ? "bg-stone-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"}`}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
