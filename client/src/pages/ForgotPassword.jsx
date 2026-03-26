import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        url: SummaryApi.forgot_password.url,
        method: SummaryApi.forgot_password.method,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp",{
            state:data
        });
        setData({
          email: "",
        });
       
      }
      console.log("Login Data:", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
  <div className="min-h-[calc(100vh-80px)] bg-[#FDFCF0] flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-stone-900 tracking-tight">
          Forgot Password
        </h2>
        <p className="text-stone-500 mt-2">
          Enter your email to receive OTP
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-stone-700 ml-1">
            Email Address
          </label>
          <div className="relative group mt-1">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-amber-400 focus:bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all mt-4"
        >
          Send OTP
        </button>
      </form>

      <p className="text-center text-stone-500 mt-8 text-sm">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-amber-600 font-bold hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  </div>
);

};

export default ForgotPassword;
