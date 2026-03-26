import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updateAvatar } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const UserProfileAvatarEdit = ({ close }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleUploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData
            });

            const { data: responseData } = response;

            if (responseData.success) {
                // IMPORTANT: Aapke console ke hisaab se image 'data.avatar' mein hai
                // Hum pura responseData bhej rahe hain, check karein userSlice ise kaise handle karta hai
                dispatch(updateAvatar(responseData.data.avatar)); 
                
                toast.success(responseData.message);
                close(); // Upload hote hi modal band ho jaye
            }

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={close}
                    className="absolute right-4 top-4 p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                    <IoClose size={24} className="text-stone-500" />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-xl font-black text-stone-900 mb-2">Update Photo</h2>
                    <p className="text-stone-500 text-sm mb-8">Choose a clear photo for your profile</p>

                    {/* Upload Area */}
                    <label htmlFor="uploadProfile" className="cursor-pointer">
                        <div className={`border-2 border-dashed rounded-2xl p-10 transition-all group ${loading ? 'bg-stone-50 border-stone-200' : 'border-stone-200 hover:border-amber-500 hover:bg-amber-50/50'}`}>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaCamera size={20} />
                                </div>
                                <span className="text-sm font-bold text-stone-600">
                                    {loading ? "Uploading..." : "Click to upload"}
                                </span>
                            </div>
                            <input 
                                type="file" 
                                id="uploadProfile" 
                                className="hidden" 
                                onChange={handleUploadAvatar} 
                                disabled={loading}
                            />
                        </div>
                    </label>

                    <p className="mt-4 text-xs text-stone-400">
                        Square images work best. Max 2MB.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default UserProfileAvatarEdit;