import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegUserCircle, FaCamera } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import { fetchUserDetails } from "../utils/fetchUserDetails";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  // Local state for form (taaki user name/email change kar sake)
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseDta } = response;

      if (responseDta.success) {
        toast.success(responseDta.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      {/* Title section without box */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-stone-900">My Profile</h2>
        <p className="text-stone-500 text-sm">
          Manage your profile information
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-stone-100 border-4 border-white shadow-md">
              {user.avatar ? (
                <img
                  src={user.avatar.replace("http://", "https://")}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaRegUserCircle size={112} className="text-stone-300" />
              )}
            </div>
            {/* Camera Overlay */}
            <button
              onClick={() => setProfileAvatarEdit(true)}
              className="absolute bottom-1 right-1 p-2 bg-amber-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white"
            >
              <FaCamera size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-800 leading-tight">
              {user.name || "User Name"}
            </h3>
            <p className="text-stone-500 text-sm">
              {user.email || "No email provided"}
            </p>
          </div>
        </div>

        {/* Input Form Fields (Clean Design) */}
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-xs font-black text-stone-400 uppercase tracking-widest"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={userData.name}
                name="name"
                className="px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition-all font-medium text-stone-700"
                placeholder="Your Name"
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="mobile"
                className="text-xs font-black text-stone-400 uppercase tracking-widest"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                type="text"
                value={userData.mobile}
                name="mobile"
                className="px-4 py-3 bg-stone-100 border border-stone-100 rounded-xl text-stone-500 cursor-not-allowed outline-none font-medium"
                placeholder="Mobile Number"
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label
                htmlFor="email"
                className="text-xs font-black text-stone-400 uppercase tracking-widest"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={userData.email}
                name="email"
                className="px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition-all font-medium text-stone-700"
                placeholder="Email Address"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-fit px-8 py-3 mt-8 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}
    </div>
  );
};

export default Profile;
