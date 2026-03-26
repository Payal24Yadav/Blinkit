import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "./utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
import AxiosToastError from "./utils/AxiosToastError";
import { handleAddItemCart } from "./store/cartProduct";
import GlobalProvider from "./provider/GlobalProvider";


function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    if (userData) {
      dispatch(setUserDetails(userData.data));
    }
    setLoading(false);
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;
      if (responseData.success || responseData.succcess) {
        // setCategoryData(responseData.data);
        dispatch(setAllCategory(responseData.data));
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;
      if (responseData.success || responseData.succcess) {
        // setCategoryData(responseData.data);
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
    fetchCategory();
    fetchSubCategory();
    // fetchCartItem();
  }, []);

  if (loading) return null; // wait until auth check finishes

  return (
    <GlobalProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
        <Toaster />
      </div>
    </GlobalProvider>
  );
}

export default App;
