import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount"; // Import this!
import { handleAddAddress } from "../store/addressSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
     const cartItem = useSelector((state) => state.cartItem.cart) || [];
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)

  const user = useSelector(state=> state?.user)

  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: cartItemId,
          qty: quantity,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        // toast.success(responseData.message);
        fetchCartItem();
        return responseData
      }
    } catch (error) {
      AxiosToastError(error);
      return error
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchAddress = async ()=>{
    try{
      const response = await Axios({
        ...SummaryApi.getAddress
      })
      const {data:responseData}= response
      if(responseData.success){
        dispatch(handleAddAddress(responseData.data))
      }
    } catch(error){
      AxiosToastError(error)
    }
  }

  // Sync Price and Qty (With Discount Logic)
  useEffect(() => {
  const qty = cartItem.reduce((prev, curr) => {
    return prev + (Number(curr?.quantity) || 0);
  }, 0);

  const price = cartItem.reduce((prev, curr) => {
    const price = Number(curr?.productId?.price) || 0;
    const discount = Number(curr?.productId?.discount) || 0;
    const quantity = Number(curr?.quantity) || 0;

    const actualPrice = Number(pricewithDiscount(price, discount)) || 0;

    return prev + (actualPrice * quantity);
  }, 0);

  const notDiscountPrice = cartItem.reduce((prev, curr) => {
    const price = Number(curr?.productId?.price) || 0;
    const quantity = Number(curr?.quantity) || 0;

    return prev + (price * quantity);
  }, 0);

  setTotalQty(qty);
  setTotalPrice(price);
  setNotDiscountTotalPrice(notDiscountPrice);

}, [cartItem]);
  

  


//   useEffect(() => {
//   if (user?._id) {
//     fetchCartItem(); // login ke baad cart load
//   } else {
//     dispatch(handleAddItemCart([])); // logout pe clear
//   }
// }, [user]);
useEffect(() => {
  if (user?._id) {
    fetchCartItem();
    fetchAddress();
  } else {
    dispatch(handleAddItemCart([]));
    dispatch(handleAddAddress([]));
  }
}, [user?._id]);   // 👈 ONLY THIS


  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountTotalPrice
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
