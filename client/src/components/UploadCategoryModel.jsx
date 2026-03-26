import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";


const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false); // Image upload ke liye alag loading

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadCategoryImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setImageLoading(true); // Image loading start
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;

      if (ImageResponse.success) {
        setData((prev) => ({
          ...prev,
          image: ImageResponse.data.url,
        }));
        toast.success(ImageResponse.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageLoading(false); // Image loading stop
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!data.image) return toast.error("Please upload category image");

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchData();
        close();
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#FDFCF0] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
          <h1 className="font-black text-stone-900 tracking-tighter text-lg">
            Add Category<span className="text-amber-500">.</span>
          </h1>
          <button onClick={close} className="p-1 hover:bg-stone-100 rounded-full text-stone-600 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 ml-1">Category Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              placeholder="e.g. Dairy & Breakfast"
              className="w-full mt-1 px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 ml-1">Category Image</label>
            <div className="mt-1 relative flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-xl min-h-[160px] bg-stone-50/50 overflow-hidden group hover:border-amber-400 transition-all">
              
              {imageLoading ? (
                /* Spinner State */
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-500 font-medium">Uploading...</p>
                </div>
              ) : data.image ? (
                /* Preview State */
                <div className="relative w-full h-full flex flex-col items-center p-2">
                  <img src={data.image} alt="preview" className="w-full h-32 object-contain rounded-lg" />
                  <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-tight">Click button below to change</p>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center p-4">
                  <p className="text-sm text-stone-400 font-medium">No image selected</p>
                </div>
              )}

              {/* Custom Styled Upload Button */}
              <label className="mt-2 mb-4">
                <span className="px-4 py-2 bg-white border border-stone-200 text-xs font-bold text-stone-700 rounded-full shadow-sm cursor-pointer hover:bg-stone-50 active:scale-95 transition-all">
                  {data.image ? "Change Image" : "Choose Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCategoryImage}
                  className="hidden" // Browser ka ganda "No file chosen" hide kar diya
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || imageLoading}
            className={`w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2 ${
              (loading || imageLoading) && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating..." : "Add Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;