import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useLocation } from "react-router-dom";

const OtpVerification = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const response = await Axios({
        url: SummaryApi.forgot_password_otp_verification.url, // make sure this exists
        method: SummaryApi.forgot_password_otp_verification.method,
        data: {
          otp: finalOtp,
          email: location?.state?.email,
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("OTP Verified");
        navigate("/reset-password",{
          state:{
            data:response.data,
            email:location?.state?.email,
          }
        });
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
            OTP Verification
          </h2>
          <p className="text-stone-500 mt-2">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 text-center text-lg font-bold border border-stone-300 rounded-xl focus:border-amber-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md transition-all"
          >
            Verify OTP
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

export default OtpVerification;
