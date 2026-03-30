import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { fetchUserDetails } from "../utils/fetchUserDetails";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
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
        url: SummaryApi.login.url,
        method: SummaryApi.login.method,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accesstoken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const uerDetails= await fetchUserDetails()
        dispatch(setUserDetails(uerDetails.data));
        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FDFCF0] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Login
          </h2>
          <p className="text-stone-500 mt-2">
            Join <span className="text-amber-600 font-bold">BlinkIT</span> for
            fresh groceries
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

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-stone-700 ml-1">
              Password
            </label>

            <div className="relative mt-1">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-amber-400 focus:bg-white"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          {/* Forgot Password Link */}
          <div className="text-right mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-amber-600 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all mt-4"
          >
            Login
          </button>
        </form>

        <p className="text-center text-stone-500 mt-8 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-600 font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
