import React, { useEffect, useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart) || [];

  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState(null);

  // Sync local state with Redux Cart Store
  useEffect(() => {
  if (!data) return;

  const product = cartItem?.find(
    (item) => item?.productId?._id === data?._id
  );

  if (product) {
    setIsAvailableCart(true);
    setQty(product.quantity);
    setCartItemsDetails(product);
  } else {
    setIsAvailableCart(false);
    setQty(0);
    setCartItemsDetails(null);
  }
}, [data, cartItem]);

  const handleADDToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: { productId: data?._id },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await updateCartItem(cartItemDetails?._id, qty + 1);
    if (response.success) {
      toast.success("Item added");
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      // If you have a deleteCartItem function in context, call it here
      // For now, we'll assume updateCartItem handles 0 or removal
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);
      if (response.success) {
        toast.success("Item remove");
      }
    }
  };

  return (
    <div className="w-full min-h-[36px] flex items-center justify-center">
      {isAvailableCart ? (
        <div className="flex items-center justify-center gap-3 px-2 py-1 bg-amber-600 text-white rounded-lg shadow-sm">
  
  <button
    onClick={decreaseQty}
    className="w-7 h-7 flex items-center justify-center hover:bg-amber-700 rounded-md transition text-lg font-bold"
  >
    −
  </button>

  <span className="min-w-[20px] text-center font-black text-sm">
    {qty}
  </span>

  <button
    onClick={increaseQty}
    className="w-7 h-7 flex items-center justify-center hover:bg-amber-700 rounded-md transition text-lg font-bold"
  >
    +
  </button>

</div>
      ) : (
        <button
          onClick={handleADDToCart}
          disabled={loading}
          className="w-full bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg text-[12px] font-black transition-all shadow-sm active:scale-95 uppercase tracking-wider text-center flex items-center justify-center"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-amber-600 border-t-transparent animate-spin rounded-full" />
          ) : (
            "Add"
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
