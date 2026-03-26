import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPackage,
  FiMapPin,
  FiLogOut,
  FiGrid,
  FiLayers,
  FiUploadCloud,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi"; // Added unique icons
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        if (close) close();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="flex flex-col w-56 overflow-hidden bg-white shadow-lg rounded-lg border border-stone-100">
      {/* User Info Section */}
      <div className="p-4 bg-stone-50 border-b border-stone-100">
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
          My Account
        </p>
        <p className="text-stone-800 font-semibold truncate mt-1 flex items-center gap-2">
          <FiUser className="text-amber-600" />
          <Link
            to="/dashboard/profile"
            onClick={close}
            className="hover:text-amber-700 transition-colors"
          >
            {user.name || user.mobile}{" "}
            <span className="text-medium text-red-500">{user.role === "admin" ? "(Admin)" : ""}</span>
          </Link>
        </p>
      </div>

      {/* Links Section */}
      <div className="p-2 flex flex-col">
        {isAdmin(user.role) && (
          <Link
            onClick={close}
            to="/dashboard/category"
            className="flex items-center gap-3 px-3 py-2.5 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-all group"
          >
            <FiGrid className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Category</span>
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={close}
            to="/dashboard/subcategory"
            className="flex items-center gap-3 px-3 py-2.5 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-all group"
          >
            <FiLayers className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Sub Category</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={close}
            to="/dashboard/upload-product"
            className="flex items-center gap-3 px-3 py-2.5 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-all group"
          >
            <FiUploadCloud className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Upload Product</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={close}
            to="/dashboard/product"
            className="flex items-center gap-3 px-3 py-2.5 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-all group"
          >
            <FiPackage className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Product</span>
          </Link>
        )}

        <Link
          onClick={close}
          to="/dashboard/myorders"
          className="flex items-center gap-3 px-3 py-2.5 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-all group"
        >
          <FiShoppingBag className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">My Orders</span>
        </Link>

        <Link
          onClick={close}
          to="/dashboard/address"
          className="flex items-center gap-3 px-3 py-2.5 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-all group"
        >
          <FiMapPin className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Save Address</span>
        </Link>

        <hr className="my-2 border-stone-100" />

        <button
          className="flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-md transition-all text-left w-full group"
          onClick={handleLogout}
        >
          <FiLogOut className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
